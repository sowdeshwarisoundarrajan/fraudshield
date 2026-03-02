export default function Dashboard({ result }) {
  if (!result) return null;

  const color =
    result.status === "ALLOWED" ? "#16a34a" :
    result.status === "FLAGGED" ? "#d97706" : "#dc2626";

  const emoji =
    result.status === "ALLOWED" ? "✅" :
    result.status === "FLAGGED" ? "⚠️" : "🚫";

  const message =
    result.status === "ALLOWED" ? "Transaction is Safe!" :
    result.status === "FLAGGED" ? "Transaction is Suspicious!" :
    "Transaction is BLOCKED — Fraud Detected!";

  return (
    <div style={{
      padding: 20,
      border: `3px solid ${color}`,
      borderRadius: 10,
      marginTop: 20,
      background: "#fff"
    }}>

      {/* Status */}
      <h2 style={{ color, textAlign: "center", fontSize: 24 }}>
        {emoji} {message}
      </h2>

      {/* Risk Score Bar */}
      <h3>Risk Score: {result.risk_score} / 100</h3>
      <div style={{ background: "#e2e8f0", borderRadius: 10, height: 25, width: "100%" }}>
        <div style={{
          width: `${result.risk_score}%`,
          background: color,
          height: 25,
          borderRadius: 10,
          transition: "width 0.5s ease"
        }} />
      </div>

      {/* Scores */}
      <div style={{ display: "flex", gap: 20, marginTop: 15 }}>
        <div style={{ flex: 1, background: "#f1f5f9", padding: 10, borderRadius: 8 }}>
          <b>🤖 ML Score</b>
          <p style={{ fontSize: 22, margin: 0 }}>{result.ml_score}</p>
        </div>
        <div style={{ flex: 1, background: "#f1f5f9", padding: 10, borderRadius: 8 }}>
          <b>📋 Rule Score</b>
          <p style={{ fontSize: 22, margin: 0 }}>{result.rule_score}</p>
        </div>
      </div>

      {/* Flags */}
      {result.flags.length > 0 && (
        <div style={{ marginTop: 15, background: "#fef2f2", padding: 10, borderRadius: 8 }}>
          <h4 style={{ color: "#dc2626" }}>⚠️ Fraud Flags Detected:</h4>
          <ul>
            {result.flags.map((f, i) => (
              <li key={i} style={{ color: "#dc2626" }}>{f}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Safe message */}
      {result.flags.length === 0 && (
        <div style={{ marginTop: 15, background: "#f0fdf4", padding: 10, borderRadius: 8 }}>
          <p style={{ color: "#16a34a" }}>✅ No fraud flags detected. Transaction looks safe!</p>
        </div>
      )}
    </div>
  );
}
