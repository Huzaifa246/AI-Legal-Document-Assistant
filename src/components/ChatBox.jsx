import { useState, useRef, useEffect } from "react";

export default function ChatBox({ onSend, messages = [], loading }) {
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  async function handleSend() {
    const text = input.trim();
    if (!text) return;
    setInput("");
    await onSend(text);
  }

  // Split text by newlines and render bullets for lines starting with * or -
  function renderMessageContent(text) {
    return text.split("\n").map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
        return (
          <div key={idx} style={{ listStyleType: "disc" }}>
            {trimmed.slice(2)}
          </div>
        );
      }
      return <div key={idx}>{trimmed}</div>;
    });
  }

  return (
    <div style={{ borderTop: "1px solid #eee", paddingTop: 12, marginTop: 12 }}>
      <h3>Ask follow‑up questions about this document</h3>

      <div
        ref={scrollRef}
        style={{
          maxHeight: 240,
          overflowY: "auto",
          border: "1px solid #eee",
          borderRadius: 8,
          padding: 8,
          marginBottom: 8,
          overflowAnchor: "auto",
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              background: m.role === "user" ? "#e8f0fe" : "#f5f5f5",
              padding: 8,
              borderRadius: 8,
              margin: "8px 0",
            }}
          >
            <strong>{m.role === "user" ? "You" : "AI"}:</strong>
            <div style={{ marginTop: 4 }}>
              {renderMessageContent(m.content)}
            </div>
          </div>
        ))}
        {loading && <div>Thinking…</div>}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a question…"
          style={{ flex: 1, padding: 8, borderRadius: 8, border: "1px solid #ccc" }}
        />
        <button
          onClick={handleSend}
          style={{ padding: "8px 16px", borderRadius: 8 }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
