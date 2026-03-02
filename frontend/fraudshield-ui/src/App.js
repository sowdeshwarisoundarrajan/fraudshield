import { useState } from "react";
import Form from "./Form";
import Dashboard from "./Dashboard";
import History from "./History";
import Stats from "./Stats";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const handleResult = (data) => {
    setResult(data);

    const newEntry = {
      id: Date.now(),
      amount: data?.input_amount || "N/A",
      status: data.status,
      risk_score: data.risk_score,
      time: new Date().toLocaleTimeString(),
    };

    setHistory((prev) => [newEntry, ...prev]);

    showToast(data.status);
  };

  const showToast = (status) => {
    const options = {
      position: "top-center",
      autoClose: 4000,
    };

    if (status === "BLOCKED") {
      toast.error("🚫 FRAUD DETECTED! Transaction Blocked!", options);
    } else if (status === "FLAGGED") {
      toast.warning("⚠️ Suspicious Transaction Flagged!", options);
    } else {
      toast.success("✅ Transaction is Safe!", {
        ...options,
        autoClose: 3000,
      });
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e3a8a, #1e40af)",
        padding: 20,
        fontFamily: "Arial",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <h1 style={{ color: "white", fontSize: 36, margin: 0 }}>
          🛡️ FraudShield
        </h1>
        <p style={{ color: "#93c5fd", fontSize: 16 }}>
          AI-Powered Real-Time Fraud Detection System
        </p>
      </div>

      {/* Stats Section */}
      <Stats history={history} />

      {/* Main Section */}
      <div
        style={{
          display: "flex",
          gap: 20,
          marginTop: 20,
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: 320 }}>
          <Form onResult={handleResult} />
        </div>

        <div style={{ flex: 1, minWidth: 320 }}>
          <Dashboard result={result} />
        </div>
      </div>

      {/* Transaction History */}
      <History history={history} />

      <ToastContainer />
    </div>
  );
}

export default App;