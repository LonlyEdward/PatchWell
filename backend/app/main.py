from fastapi import FastAPI

from app.models.schemas import ManifestScanRequest
from app.parsers.npm import extract_dependencies
from app.services.osv import check_packages

app = FastAPI()


@app.get("/")
def read_root():
    return {"message": "hello world"}


@app.post("/scan")
def scan_manifest(request: ManifestScanRequest):
    #parse the manifest into a clean list of dependencies
    dependencies = extract_dependencies(request.file_content)

    #strip version range prefixes (^, ~) before checking OSV
    packages_to_check = [
        {"name": dep["name"], "version": dep["version"].lstrip("^~")}
        for dep in dependencies
    ]

    #check all packages against OSV in one batch call
    vulnerabilities_by_package = check_packages(packages_to_check)

    # combining dependency info with its vulnerabilities into one clean result
    results = []
    for dep in dependencies:
        results.append({
            "name": dep["name"],
            "version": dep["version"],
            "type": dep["type"],
            "vulnerabilities": vulnerabilities_by_package.get(dep["name"], [])
        })

    return {"dependencies": results}