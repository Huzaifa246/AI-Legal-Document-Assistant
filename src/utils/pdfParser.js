import * as pdfjsLib from "pdfjs-dist";
// import mammoth from "mammoth";

// pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url
).toString();


export async function extractTextFromFile(file) {
  const type = file.type || "";

  if (type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((it) => it.str).join(" ");
      text += `\n\n[Page ${i}]\n` + pageText;
    }
    return text.trim();
  }
  // --- Word logic ---
  // if (
  //   type ===
  //     "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
  //   file.name.toLowerCase().endsWith(".docx")
  // ) {
  //   const arrayBuffer = await file.arrayBuffer();
  //   const result = await mammoth.extractRawText({ arrayBuffer });
  //   return result.value.trim();
  // }

  // Plain text fallback
  if (type.startsWith("text/") || file.name.toLowerCase().endsWith(".txt")) {
    return await file.text();
  }

  // Attempt to read as text
  try {
    return await file.text();
  } catch (e) {
    throw new Error("Unsupported file type. Please upload PDF, DOCX, or TXT.");
  }
}