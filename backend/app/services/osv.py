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