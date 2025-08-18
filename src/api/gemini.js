import axios from 'axios';

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

const MODEL = "gemini-1.5-flash";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
console.log("Using Gemini API Key:", API_KEY);
console.log("Using ENDPOINT API Key:", ENDPOINT);

function extractJSON(text) {
    if (!text) return null;
    const fence = text.match(/```json\n([\s\S]*?)```/i) || text.match(/```\n([\s\S]*?)```/i);
    const candidate = fence ? fence[1] : text;
    // Try direct parse first
    try { return JSON.parse(candidate); } catch (_) { }
    // Fallback: take substring from first { to last }
    const first = candidate.indexOf("{");
    const last = candidate.lastIndexOf("}");
    if (first !== -1 && last !== -1 && last > first) {
        const slice = candidate.slice(first, last + 1);
        try { return JSON.parse(slice); } catch (_) { }
    }
    return null;
}

export async function analyzeLegalDoc(docText, mode = "full") {
    if (!docText || docText.trim().length === 0) {
        throw new Error("No document text provided.");
    }
    const instructions = `You are a meticulous legal analysis assistant.\n` +
        `Given a legal document, output STRICT JSON matching this schema exactly (no commentary).\n` +
        `Schema: {\n  \"summary\": string,\n  \"plain_english\": string,\n  \"risks\": [\n    {\n      \"clause\": string,\n      \"issue\": string,\n      \"severity\": \"Low\" | \"Medium\" | \"High\",\n      \"recommendation\": string\n    }\n  ]\n}\n` +
        `When mode=summary, only fill summary and keep others as empty string or [].\n` +
        `When mode=plain, only fill plain_english and keep others minimal.\n` +
        `When mode=risks, focus on risks array (3-10 items).\n` +
        `When mode=full, fill all fields.`;

    const user = `MODE: ${mode}\n\nDOCUMENT:\n${docText}`;

    const payload = {
        contents: [
            { role: "user", parts: [{ text: instructions }, { text: user }] }
        ]
    };
    const res = await axios.post(ENDPOINT, payload)
    const raw = res?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const parsed = extractJSON(raw);

    if (!parsed) {
        return {
            summary: raw,
            plain_english: "",
            risks: []
        }
    }
    return {
        summary: parsed.summary || "",
        plain_english: parsed.plain_english || "",
        risks: Array.isArray(parsed.risks) ? parsed.risks : []
    };
}

export async function chatWithGemini(messages = [], context = "") {
  const system = `You are a helpful legal assistant.\n` +
    `Answer briefly and reference the provided document context when relevant.\n` +
    `If a question cannot be answered from the context, say so and suggest what is missing.`;

  const parts = [ { text: system }, { text: `CONTEXT:\n${context}` } ];
  for (const m of messages) {
    parts.push({ text: `${m.role.toUpperCase()}: ${m.content}` });
  }

  const payload = { contents: [ { role: "user", parts } ] };
  const res = await axios.post(ENDPOINT, payload);
  const text = res?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  return text.trim();
}