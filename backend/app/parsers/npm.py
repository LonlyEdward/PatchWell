import json

#function to extract dependencies as strings and then parse it
def extract_dependencies(package_json_text: str) -> list[dict]:

    package_data = json.loads(package_json_text)

    dependencies = []

    #production dependencies
    for name, version in package_data.get("dependencies", {}).items():
        dependencies.append({
            "name": name,
            "version": version,
            "type": "production"
        })

    #development dependencies
    for name, version in package_data.get("devDependencies", {}).items():
        dependencies.append({
            "name": name,
            "version": version,
            "type": "development"
        })

    return dependencies