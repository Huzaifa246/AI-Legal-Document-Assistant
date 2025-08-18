import React, { useState } from "react";
import { analyzeLegalDoc, chatWithGemini } from "./api/gemini";
import FileUploader from "./components/FileUploader";
import AnalysisTabs from "./components/AnalysisTabs";
import ChatBox from "./components/ChatBox";
import HistorySidebar from "./components/HistorySidebar";

const styles = {
  page: {
    display: "flex",
    height: "100vh",
    fontFamily: "Inter, sans-serif",
    background: "#f9fafb",
    color: "#111827",
  },
  main: {
    flex: 1,
    padding: 20,
    overflowY: "auto",
  },
   mainWithSidebar: {
    flex: 1,
    padding: 20,
    overflowY: "auto",
    marginLeft: 280, // only on desktop
  },
  heading: {
    fontSize: "28px",
    fontWeight: 700,
    marginBottom: "20px",
    color: "#1f2937",
  },
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    marginBottom: "20px",
  },
  sectionTitle: {
    fontSize: "18px",
    marginTop: "12px",
    fontWeight: 600,
  },
  textMuted: {
    fontStyle: "italic",
    color: "#6b7280",
  },
};

export default function App() {
  const [docText, setDocText] = useState("");
  const [docName, setDocName] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [mode, setMode] = useState("summary");
  const [loading, setLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [history, setHistory] = useState([]);

  async function runAnalysis(selectedMode = mode) {
    if (!docText) return;
    setLoading(true);
    try {
      const result = await analyzeLegalDoc(docText, selectedMode);
      setAnalysis(result);

      // Save into history
      const entry = {
        id: Date.now(),
        title: docName,
        timestamp: Date.now(),
        result,
        mode: selectedMode
      };
      setHistory((prev) => [entry, ...prev]);
    } catch (err) {
      setAnalysis({ summary: "Error: " + err.message, plain_english: "", risks: [] });
    }
    setLoading(false);
  }

  async function handleChatSend(text) {
    setChatMessages((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);
    try {
      const answer = await chatWithGemini(
        [...chatMessages, { role: "user", content: text }],
        docText
      );
      setChatMessages((prev) => [...prev, { role: "assistant", content: answer }]);
    } catch (err) {
      setChatMessages((prev) => [...prev, { role: "assistant", content: "Error: " + err.message }]);
    }
    setLoading(false);
  }

  function handleHistorySelect(id) {
    const item = history.find((h) => h.id === id);
    if (!item) return;
    setDocName(item.title);
    setAnalysis(item.result);
    setMode(item.mode);
  }
  function handleHistoryDelete(id) {
    if (window.confirm("Are you sure you want to delete this history item?")) {
      setHistory((prev) => prev.filter((item) => item.id !== id));
    }
  }

return (
    <div style={styles.page}>
      <HistorySidebar
        items={history}
        onSelect={handleHistorySelect}
        onDelete={handleHistoryDelete}
      />
      <main style={styles.main}>
        <h1 style={styles.heading}>AI Legal Document Assistant ⚖️</h1>

        <div style={styles.card}>
          <FileUploader
            onTextReady={(text, name) => {
              setDocText(text);
              setDocName(name);
              setAnalysis(null);
              setChatMessages([]);
            }}
          />
        </div>

        {docText && (
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>Choose Analysis</h2>
            <AnalysisTabs
              onSelect={(m) => {
                setMode(m);
                runAnalysis(m);
              }}
            />
          </div>
        )}

        {loading && <p style={styles.textMuted}>Processing…</p>}

        {analysis && (
          <div style={styles.card}>
            <h2 style={{ ...styles.sectionTitle, fontSize: "22px" }}>
              Analysis Result ({mode})
            </h2>
            {analysis.summary && (
              <>
                <h3 style={styles.sectionTitle}>Summary</h3>
                <p style={{ lineHeight: 1.6 }}>{analysis.summary}</p>
              </>
            )}
            {analysis.plain_english && (
              <>
                <h3 style={styles.sectionTitle}>Plain English</h3>
                <p>{analysis.plain_english}</p>
              </>
            )}
            {analysis.risks?.length > 0 && (
              <>
                <h3 style={styles.sectionTitle}>Points</h3>
                <ul style={{ paddingLeft: "20px", lineHeight: 1.6 }}>
                  {analysis.risks.map((r, i) => (
                    <li key={i} style={{ marginBottom: "8px" }}>
                      <strong>{r.clause}:</strong> {r.issue} ({r.severity}) –{" "}
                      {r.recommendation}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}

        {docText && (
          <div style={styles.card}>
            <ChatBox
              onSend={handleChatSend}
              messages={chatMessages}
              loading={loading}
            />
          </div>
        )}
      </main>
    </div>
  );
}