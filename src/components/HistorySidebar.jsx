import { useState, useEffect } from "react";

export default function HistorySidebar({ items = [], onSelect, onDelete }) {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

 const sidebarStyle = {
    width: 280,
    borderRight: "1px solid #eee",
    padding: 12,
    overflowY: "auto",
    background: "#fff",
    transition: "left 0.3s ease",
    zIndex: 1000,
    ...(isMobile
      ? {
          position: "fixed",
          top: 0,
          bottom: 0,
          left: open ? 0 : -310, // slide in/out
        }
      : {
          position: "relative",
          top: "auto",
          bottom: "auto",
          left: "auto",
          height: "100vh", // fill vertically on desktop
        }),
  };

  const toggleBtnStyle = {
    position: "fixed",
    top: 10,
    left: open ? "60%" : "10px",
    zIndex: 1100,
    padding: "6px 10px",
    border: "1px solid #ddd",
    borderRadius: 6,
    background: "#fff",
    cursor: "pointer",
  };

  return (
    <>
      {/* Show toggle only on mobile */}
      {isMobile && (
        <button style={toggleBtnStyle} onClick={() => setOpen(!open)}>
          {open ? "✖" : "☰"}
        </button>
      )}

      <aside style={sidebarStyle}>
        <h3 style={{ marginTop: "30px" }}>Saved Analyses</h3>
        {items.length === 0 && (
          <div style={{ color: "#777" }}>No history yet.</div>
        )}
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {items.map((it) => (
            <li
              key={it.id}
              style={{
                border: "1px solid #eee",
                borderRadius: 8,
                padding: 8,
                marginBottom: 8,
              }}
            >
              <div style={{ fontWeight: 600 }}>{it.title || "Untitled"}</div>
              <div style={{ fontSize: 12, color: "#666" }}>
                {new Date(it.timestamp).toLocaleString()}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button
                  onClick={() => {
                    onSelect(it.id);
                    setOpen(false); // close after selection on mobile
                  }}
                  style={{ padding: "4px 8px" }}
                >
                  Open
                </button>
                {onDelete && (
                  <button
                    onClick={() => onDelete(it.id)}
                    style={{
                      padding: "4px 8px",
                      backgroundColor: "#f44336",
                      color: "#fff",
                      border: "none",
                      borderRadius: 4,
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
