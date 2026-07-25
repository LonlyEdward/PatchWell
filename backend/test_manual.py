from pathlib import Path
from app.parsers.npm import extract_dependencies
from app.services.osv import check_package
from app.services.osv import check_packages


#test for extraction
path = Path("test-files/package.json")
content = path.read_text(encoding="utf-8")

result = extract_dependencies(content)

for dep in result:
    print(dep)

#test for single package
vulns = check_package("lodash", "4.17.11")
for v in vulns:
    print(v)

#test for batch request
deps = extract_dependencies(content)
packages_to_check = [{"name": d["name"], "version": d["version"].lstrip("^~")} for d in deps]

results = check_packages(packages_to_check)
for name, vulns in results.items():
    print(name, "->", len(vulns), "vulnerabilities found")

axios_findings = results["axios"]
print(axios_findings[0])