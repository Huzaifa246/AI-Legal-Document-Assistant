⚖️ AI Legal Document Assistant

An AI-powered tool that helps you analyze, summarize, and chat with legal documents.
Upload your contracts, agreements, or policies in PDF, DOCX, or TXT format and get:

📑 Summaries of key points
📝 Plain English translations
🔎 Clause-level analysis
💬 Interactive Q&A chat with the document
🗂 History management to revisit past analyses

🚀 Features
Multi-format file support → PDF, Word (.docx), TXT
AI-powered analysis → Summaries, analysis, plain English explanations
Interactive Chat → Ask questions directly about your document
History Sidebar → Save & manage past document analyses
Responsive design → Mobile + Desktop sidebar toggle

🛠️ Tech Stack
Frontend: React (CRA), Hooks, JSX
PDF Parsing: pdfjs-dist
Word Parsing: mammoth
Backend (AI): Gemini API (via custom analyzeLegalDoc + chatWithGemini)
State Management: React useState, useEffect

git clone https://github.com/your-username/ai-legal-doc-assistant.git
cd ai-legal-doc-assistant

npm install