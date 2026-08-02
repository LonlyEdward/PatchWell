from pydantic import BaseModel


class ManifestScanRequest(BaseModel):
    

    #the raw text content of a package.json file
    file_content: str  