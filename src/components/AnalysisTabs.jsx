const btn = {
  padding: "8px 12px",
  border: "1px solid #ccc",
  borderRadius: 8,
  cursor: "pointer",
  background: "#fff"
};

export default function AnalysisTabs({ onSelect }) {
  const options = [
    { key: "summary", label: "Summary" },
    { key: "plain", label: "Plain English" },
    { key: "analysis", label: "Analysis" },
    { key: "full", label: "Full Report" },
    { key: "top5", label: "Top 5 Points" },
    { key: "clauses", label: "Key Clauses" },
  ];

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {options.map((o) => (
        <button key={o.key} style={btn} onClick={() => onSelect(o.key)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}