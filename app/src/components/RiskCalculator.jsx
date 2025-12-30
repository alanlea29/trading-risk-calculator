import { useMemo, useState } from "react";
import { SYMBOLS } from "../constants/symbols";
import { calculateRisk } from "../utils/calculateRisk";
import "../App.css";

export default function RiskCalculator() {
  const [balance, setBalance] = useState("");
  const [riskPercent, setRiskPercent] = useState("");
  const [riskCash, setRiskCash] = useState("");
  const [riskMode, setRiskMode] = useState("percent"); // percent | cash
  const [entry, setEntry] = useState("");
  const [stop, setStop] = useState("");
  const [rr, setRr] = useState("2");
  const [symbol, setSymbol] = useState("XAUUSD");
  const [copied, setCopied] = useState(false);

  const copyLotSize = async () => {
  if (!results?.lotSize) return;

  try {
    await navigator.clipboard.writeText(String(results.lotSize));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  } catch {
    alert("Copy failed");
  }
};


  const results = useMemo(() => {
    const base = calculateRisk({
      balance: Number(balance),
      riskPercent: riskMode === "percent" ? Number(riskPercent) : 0,
      riskAmountOverride: riskMode === "cash" ? Number(riskCash) : null,
      entry: Number(entry),
      stop: Number(stop),
      valuePerPoint: SYMBOLS[symbol].valuePerPoint,
    });

    if (!base) return null;

    const e = Number(entry);
    const s = Number(stop);
    const rrNum = Number(rr);

    if (!isFinite(rrNum) || rrNum <= 0) {
      return { ...base, takeProfit: null };
    }

    const riskDistance = Math.abs(e - s);
    const isLong = e > s;

    const takeProfit = isLong
      ? e + riskDistance * rrNum
      : e - riskDistance * rrNum;

    return {
      ...base,
      takeProfit: Number(takeProfit.toFixed(2)),
      direction: isLong ? "BUY (Long)" : "SELL (Short)",
    };
  }, [balance, riskPercent, riskCash, riskMode, entry, stop, rr, symbol]);

  return (
    <div className="container">
      <div className="title">Trading Risk Calculator</div>

      <div className="card">
        {/* Balance */}
        <input
          className="input"
          placeholder="Account Balance (£)"
          type="number"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
        />

        {/* Risk mode toggle */}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            onClick={() => {
              setRiskMode("percent");
              setRiskCash("");
            }}
            style={{
              flex: 1,
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid #e5e7eb",
              background: riskMode === "percent" ? "#111827" : "#fff",
              color: riskMode === "percent" ? "#fff" : "#111827",
              cursor: "pointer",
            }}
          >
            Risk %
          </button>

          <button
            type="button"
            onClick={() => {
              setRiskMode("cash");
              setRiskPercent("");
            }}
            style={{
              flex: 1,
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid #e5e7eb",
              background: riskMode === "cash" ? "#111827" : "#fff",
              color: riskMode === "cash" ? "#fff" : "#111827",
              cursor: "pointer",
            }}
          >
            Risk £
          </button>
        </div>

        {/* Risk inputs */}
        {riskMode === "percent" ? (
          <>
            <input
              className="input"
              placeholder="Risk %"
              type="number"
              value={riskPercent}
              onChange={(e) => setRiskPercent(e.target.value)}
            />

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[0.25, 0.5, 1, 2].map((val) => {
                const active = Number(riskPercent) === val;
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setRiskPercent(String(val))}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 10,
                      border: "1px solid #e5e7eb",
                      background: active ? "#111827" : "#fff",
                      color: active ? "#fff" : "#111827",
                      cursor: "pointer",
                      fontSize: 14,
                    }}
                  >
                    {val}%
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <input
            className="input"
            placeholder="Risk Amount (£)"
            type="number"
            value={riskCash}
            onChange={(e) => setRiskCash(e.target.value)}
          />
        )}

        {/* Symbol */}
        <select
          className="input"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        >
          {Object.entries(SYMBOLS).map(([key, val]) => (
            <option key={key} value={key}>
              {val.label}
            </option>
          ))}
        </select>

        {/* Entry / Stop / RR */}
        <input
          className="input"
          placeholder="Entry Price"
          type="number"
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
        />

        <input
          className="input"
          placeholder="Stop Loss Price"
          type="number"
          value={stop}
          onChange={(e) => setStop(e.target.value)}
        />

        <input
          className="input"
          placeholder="Risk : Reward (e.g. 2)"
          type="number"
          value={rr}
          onChange={(e) => setRr(e.target.value)}
        />
      </div>

      {/* Results */}
      {results ? (
        <div className="results">
          <div className="muted">Direction: {results.direction}</div>

          <div>
  <div className="muted">Recommended Lot Size</div>

  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <div className="big">{results.lotSize}</div>

    <button
      type="button"
      onClick={copyLotSize}
      style={{
        padding: "6px 10px",
        borderRadius: 8,
        border: "1px solid #e5e7eb",
        background: copied ? "#16a34a" : "#fff",
        color: copied ? "#fff" : "#111827",
        cursor: "pointer",
        fontSize: 14,
      }}
    >
      {copied ? "Copied ✓" : "Copy"}
    </button>
  </div>
</div>


          <div>
            <div className="muted">Total £ Risk</div>
            <div>£{results.riskAmount}</div>
          </div>

          <div>
            <div className="muted">Pips / Points</div>
            <div>{results.distance}</div>
          </div>

          <div>
            <div className="muted">Take Profit (from RR)</div>
            <div className="big">{results.takeProfit ?? "—"}</div>
          </div>
        </div>
      ) : (
        <div className="muted">
          Enter balance, risk, entry and stop (entry ≠ stop)
        </div>
      )}
    </div>
  );
}
