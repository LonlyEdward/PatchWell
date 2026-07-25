from pathlib import Path
from app.parsers.npm import extract_dependencies
from app.services.osv import check_package


path = Path("test-files/package.json")
content = path.read_text(encoding="utf-8")

result = extract_dependencies(content)

for dep in result:
    print(dep)


vulns = check_package("lodash", "4.17.11")
for v in vulns:
    print(v)