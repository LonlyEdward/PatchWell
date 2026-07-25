from pathlib import Path
from app.parsers.npm import extract_dependencies


path = Path("test-files/package.json")
content = path.read_text(encoding="utf-8")

result = extract_dependencies(content)

for dep in result:
    print(dep)