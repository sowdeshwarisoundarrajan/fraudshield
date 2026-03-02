import { useState } from "react";
import axios from "axios";

export default function Form({ onResult }) {
  const [form, setForm] = useState({
    amount: "",
    hour: new Date().getHours(),
    location_match: 1,
    device_match: 1,
    failed_attempts: 0,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "amount" ? value : Number(value),
    }));
  };

  const handleSubmit = async () => {
    if (!form.amount || Number(form.amount) <= 0) {
      alert("Please enter a valid amount!");
      return;
    }

    if (form.hour < 0 || form.hour > 23) {
      alert("Hour must be between 0 and 23");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/predict",
        {
          ...form,
          amount: Number(form.amount),
        }
      );

      onResult(res.data, form.amount);

    } catch (err) {
      alert("Backend error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    padding: 10,
    width: "100%",
    marginBottom: 15,
    fontSize: 15,
    borderRadius: 8,
    border: "1px solid #e2e8f0",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        background: "white",
        borderRadius: 12,
        padding: 25,
        boxShadow: "0 6px 15px rgba(0,0,0,0.05)",
      }}
    >
      <h2 style={{ marginTop: 0, color: "#1e3a8a" }}>
        🔍 Check Transaction
      </h2>

      {/* Amount */}
      <label style={{ fontWeight: "bold" }}>💰 Amount (₹)</label>
      <input
        name="amount"
        type="number"
        value={form.amount}
        placeholder="Enter amount"
        onChange={handleChange}
        style={inputStyle}
      />

      {/* Hour */}
      <label style={{ fontWeight: "bold" }}>🕐 Hour (0–23)</label>
      <input
        name="hour"
        type="number"
        value={form.hour}
        onChange={handleChange}
        style={inputStyle}
      />

      {/* Location */}
      <label style={{ fontWeight: "bold" }}>📍 Location</label>
      <select
        name="location_match"
        value={form.location_match}
        onChange={handleChange}
        style={inputStyle}
      >
        <option value={1}>✅ Same Location</option>
        <option value={0}>❌ Different Location</option>
      </select>

      {/* Device */}
      <label style={{ fontWeight: "bold" }}>📱 Device</label>
      <select
        name="device_match"
        value={form.device_match}
        onChange={handleChange}
        style={inputStyle}
      >
        <option value={1}>✅ Known Device</option>
        <option value={0}>❌ Unknown Device</option>
      </select>

      {/* Failed Attempts */}
      <label style={{ fontWeight: "bold" }}>❗ Failed Attempts</label>
      <input
        name="failed_attempts"
        type="number"
        value={form.failed_attempts}
        onChange={handleChange}
        style={inputStyle}
      />

      {/* Button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          padding: "12px 30px",
          background: loading ? "#94a3b8" : "#1e3a8a",
          color: "white",
          border: "none",
          borderRadius: 8,
          fontSize: 16,
          cursor: "pointer",
          width: "100%",
          fontWeight: "bold",
        }}
      >
        {loading ? "⏳ Analyzing..." : "🔍 Check Transaction"}
      </button>
    </div>
  );
}