import httpx

OSV_API_URL = "https://api.osv.dev/v1/query"

#func to build request, send it and hand raw response.
#works for a single response
def check_package(name: str, version: str) -> list[dict]:

    #the request body for osv
    request_body = {
        "package": {
            "name": name,
            "ecosystem": "npm"
        },
        "version": version
    }

    #send request to osv
    response = httpx.post(OSV_API_URL, json=request_body, timeout=10)
    response.raise_for_status()

    data = response.json()
    raw_vulns = data.get("vulns", [])

    findings = []
    for vuln in raw_vulns:
        findings.append(_clean_vuln(vuln, name))

    return findings

#func to get only what is required from the reponse
def _clean_vuln(vuln: dict, package_name: str) -> dict:

    severity = vuln.get("database_specific", {}).get("severity", "UNKNOWN")
    fixed_version = _extract_fixed_version(vuln, package_name)

    return {
        "id": vuln.get("id"),
        "summary": vuln.get("summary", ""),
        "details": vuln.get("details", ""),
        "severity": severity,
        "fixed_version": fixed_version
    }

#extract fixed version if it exist
def _extract_fixed_version(vuln: dict, package_name: str) -> str | None:

    for affected in vuln.get("affected", []):
        if affected.get("package", {}).get("name") != package_name:
            continue 

        for version_range in affected.get("ranges", []):
            for event in version_range.get("events", []):
                if "fixed" in event:
                    return event["fixed"]

    return None 


OSV_BATCH_API_URL = "https://api.osv.dev/v1/querybatch"

#func to build and send the batch request
def check_packages(packages: list[dict]) -> dict[str, list[dict]]:

    #the batch request body
    queries = [
        {"package": {"name": pkg["name"], "ecosystem": "npm"}, "version": pkg["version"]}
        for pkg in packages
    ]

    response = httpx.post(OSV_BATCH_API_URL, json={"queries": queries}, timeout=30)
    response.raise_for_status()

    data = response.json()
    results = data.get("results", [])

    #matching each result back to its package by position in the list
    findings_by_package = {}
    for pkg, result in zip(packages, results):
        raw_vulns = result.get("vulns", [])

        full_findings = []
        for raw_vuln in raw_vulns:
            vuln_id = raw_vuln["id"]
            # fetch full details
            full_vuln = get_vuln_details(vuln_id) 
            full_findings.append(_clean_vuln(full_vuln, pkg["name"]))

        findings_by_package[pkg["name"]] = full_findings

    return findings_by_package

#fetching full details for a single vuln since the batch request returns only ids
def get_vuln_details(vuln_id: str) -> dict:

    url = f"https://api.osv.dev/v1/vulns/{vuln_id}"
    response = httpx.get(url, timeout=10)
    response.raise_for_status()
    return response.json()