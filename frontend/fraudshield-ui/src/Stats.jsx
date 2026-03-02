export default function Stats({ history }) {
  const total = history.length;
  const blocked = history.filter(h => h.status === "BLOCKED").length;
  const flagged = history.filter(h => h.status === "FLAGGED").length;
  const allowed = history.filter(h => h.status === "ALLOWED").length;

  const cards = [
    { label: "Total Transactions", value: total, color: "#3b82f6", emoji: "📊" },
    { label: "Allowed", value: allowed, color: "#16a34a", emoji: "✅" },
    { label: "Flagged", value: flagged, color: "#d97706", emoji: "⚠️" },
    { label: "Blocked", value: blocked, color: "#dc2626", emoji: "🚫" },
  ];

  return (
    <div style={{ display: "flex", gap: 15, flexWrap: "wrap", justifyContent: "center" }}>
      {cards.map((card, i) => (
        <div key={i} style={{
          background: "white",
          borderRadius: 12,
          padding: "15px 25px",
          textAlign: "center",
          minWidth: 140,
          borderTop: `4px solid ${card.color}`
        }}>
          <div style={{ fontSize: 28 }}>{card.emoji}</div>
          <div style={{ fontSize: 28, fontWeight: "bold", color: card.color }}>
            {card.value}
          </div>
          <div style={{ fontSize: 13, color: "#64748b" }}>{card.label}</div>
        </div>
      ))}
    </div>
  );
}