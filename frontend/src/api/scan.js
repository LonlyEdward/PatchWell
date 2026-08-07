const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export class ScanError extends Error {}

export async function scanManifest(fileContent) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/scan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ file_content: fileContent }),
    });
  } catch {
    throw new ScanError("Could not reach the PatchWell backend.");
  }

  if (!response.ok) {
    let detail = "Scan failed. Check that the manifest is valid JSON.";
    try {
      const body = await response.json();
      if (body?.detail) {
        detail = Array.isArray(body.detail)
          ? body.detail.map((d) => d.msg || JSON.stringify(d)).join("; ")
          : String(body.detail);
      }
    } catch {
      // response body wasn't JSON, keep default detail
    }
    throw new ScanError(detail);
  }

  return response.json();
}
