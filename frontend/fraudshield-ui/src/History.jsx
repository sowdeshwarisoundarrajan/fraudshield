export default function History({ history }) {
  if (history.length === 0) return null;

  return (
    <div style={{
      background: "white",
      borderRadius: 12,
      padding: 20,
      marginTop: 20
    }}>
      <h3 style={{ marginTop: 0 }}>📝 Transaction History</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f1f5f9" }}>
            <th style={{ padding: 10, textAlign: "left" }}>#</th>
            <th style={{ padding: 10, textAlign: "left" }}>Time</th>
            <th style={{ padding: 10, textAlign: "left" }}>Amount</th>
            <th style={{ padding: 10, textAlign: "left" }}>Risk Score</th>
            <th style={{ padding: 10, textAlign: "left" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {history.map((h, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #e2e8f0" }}>
              <td style={{ padding: 10 }}>{i + 1}</td>
              <td style={{ padding: 10 }}>{h.time}</td>
              <td style={{ padding: 10 }}>₹{h.amount}</td>
              <td style={{ padding: 10 }}>{h.risk_score}</td>
              <td style={{ padding: 10 }}>
                <span style={{
                  padding: "4px 10px",
                  borderRadius: 20,
                  fontSize: 13,
                  fontWeight: "bold",
                  background:
                    h.status === "ALLOWED" ? "#dcfce7" :
                    h.status === "FLAGGED" ? "#fef9c3" : "#fee2e2",
                  color:
                    h.status === "ALLOWED" ? "#16a34a" :
                    h.status === "FLAGGED" ? "#d97706" : "#dc2626"
                }}>
                  {h.status === "ALLOWED" ? "✅" :
                   h.status === "FLAGGED" ? "⚠️" : "🚫"} {h.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}