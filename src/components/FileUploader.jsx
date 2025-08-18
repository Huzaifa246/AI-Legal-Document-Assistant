import { useState } from "react";
import { extractTextFromFile } from "../utils/pdfParser";

export default function FileUploader({ onTextReady }) {
  const [fileName, setFileName] = useState("");
  const [status, setStatus] = useState("");

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setStatus("Extracting text…");
    try {
      const text = await extractTextFromFile(file);
      onTextReady(text, file.name);
      setStatus(`Loaded ${file.name} (${text.length.toLocaleString()} chars)`);
    } catch (err) {
      setStatus("Error: " + err.message);
    }
  }

  return (
    <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
      <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
        Upload PDF or Word or TXT File Only
      </label>
      <input type="file" accept=".pdf,.txt,.docx" onChange={handleFile} />
      <div style={{ marginTop: 8, color: "#555" }}>
        {fileName && <div><strong>File:</strong> {fileName}</div>}
        {status && <div>{status}</div>}
      </div>
    </div>
  );
}