import { useEffect, useState } from "react";

export default function ProGate({ children, productId, fallback }) {
  const [status, setStatus] = useState("checking"); // checking | locked | unlocked
  const [licenseKey, setLicenseKey] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("pro_unlocked");
    if (saved === "true") setStatus("unlocked");
    else setStatus("locked");
  }, []);

  async function verify() {
    setError("");
    if (!licenseKey.trim()) {
      setError("Enter your Gumroad license key.");
      return;
    }

    try {
      setStatus("checking");
      const res = await fetch("/api/verify-license", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, licenseKey }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setStatus("locked");
        setError(data.message || "License verification failed.");
        return;
      }

      localStorage.setItem("pro_unlocked", "true");
      setStatus("unlocked");
    } catch {
      setStatus("locked");
      setError("Network error verifying license.");
    }
  }

  if (status === "unlocked") return children;

  return (
    <div className="progate">
      {fallback}

      <div className="progate-box">
        <div className="progate-title">Already bought Pro?</div>
        <div className="progate-sub">Paste your Gumroad license key to unlock.</div>

        <input
          className="progate-input"
          value={licenseKey}
          onChange={(e) => setLicenseKey(e.target.value)}
          placeholder="XXXX-XXXX-XXXX-XXXX"
        />

        <button className="btn btn-pro block" onClick={verify} disabled={status === "checking"}>
          {status === "checking" ? "Verifying…" : "Unlock Pro"}
        </button>

        {error ? <div className="progate-error">{error}</div> : null}
      </div>
    </div>
  );
}
