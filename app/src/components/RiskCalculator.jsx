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

  const [lotCopied, setLotCopied] = useState(false);
  const [tpCopied, setTpCopied] = useState(false);

  const results = useMemo(() => {
    const e = Number(entry);
    const s = Number(stop);

    // While typing, entry/stop can be "" -> NaN. Avoid any calculations until valid.
    if (!isFinite(e) || !isFinite(s) || e === s) return null;

    const base = calculateRisk({
      balance: Number(balance),
      riskPercent: riskMode === "percent" ? Number(riskPercent) : 0,
      riskAmountOverride: riskMode === "cash" ? Number(riskCash) : null,
      entry: e,
      stop: s,
      valuePerPoint: SYMBOLS[symbol].valuePerPoint,
    });

    if (!base) return null;

    const rrNum = Number(rr);
    const riskDistance = Math.abs(e - s);
    const isLong = e > s;

    const takeProfit =
      isFinite(rrNum) && rrNum > 0
        ? Number(
            (isLong ? e + riskDistance * rrNum : e - riskDistance * rrNum).toFixed(2)
          )
        : null;

    return {
      ...base,
      takeProfit,
      direction: isLong ? "BUY (Long)" : "SELL (Short)",
    };
  }, [balance, riskPercent, riskCash, riskMode, entry, stop, rr, symbol]);

  const copyText = async (text, setter) => {
    try {
      await navigator.clipboard.writeText(String(text));
      setter(true);
      setTimeout(() => setter(false), 1500);
    } catch {
      // Fallback for environments where clipboard API is blocked
      window.prompt("Copy this value:", String(text));
    }
  };

  const copyLotSize = () => {
    if (!results?.lotSize) return;
    copyText(results.lotSize, setLotCopied);
  };

  const copyTakeProfit = () => {
    if (results?.takeProfit == null) return;
    copyText(results.takeProfit, setTpCopied);
  };

  // One-tap lot presets: compute required £ risk for the chosen lot
  const setPresetLot = (lot) => {
    const e = Number(entry);
    const s = Number(stop);
    if (!isFinite(e) || !isFinite(s) || e === s) return;

    const distance = Math.abs(e - s);
    const valuePerPoint = SYMBOLS[symbol].valuePerPoint;

    const cash = lot * distance * valuePerPoint;

    setRiskMode("cash");
    setRiskPercent("");
    setRiskCash(String(Number(cash.toFixed(2))));
  };

  return (
    <div className="container">
      <div className="title">Trading Risk Calculator</div>

      <div className="card">
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

      {results ? (
        <div className="results">
          <div className="muted">Direction: {results.direction}</div>

          {/* Lot size + copy */}
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
                  background: lotCopied ? "#16a34a" : "#fff",
                  color: lotCopied ? "#fff" : "#111827",
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                {lotCopied ? "Copied ✓" : "Copy"}
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

          {/* TP + copy */}
          <div>
            <div className="muted">Take Profit (from RR)</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="big">{results.takeProfit ?? "—"}</div>
              <button
                type="button"
                onClick={copyTakeProfit}
                disabled={results.takeProfit == null}
                style={{
                  padding: "6px 10px",
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  background: tpCopied ? "#16a34a" : "#fff",
                  color: tpCopied ? "#fff" : "#111827",
                  cursor: results.takeProfit == null ? "not-allowed" : "pointer",
                  fontSize: 14,
                  opacity: results.takeProfit == null ? 0.5 : 1,
                }}
              >
                {tpCopied ? "Copied ✓" : "Copy"}
              </button>
            </div>
          </div>

          {/* Lot presets */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[0.01, 0.02, 0.05, 0.1].map((lot) => (
              <button
                key={lot}
                type="button"
                onClick={() => setPresetLot(lot)}
                style={{
                  padding: "8px 12px",
                  borderRadius: 10,
                  border: "1px solid #e5e7eb",
                  background: "#fff",
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                Set {lot.toFixed(2)} lot
              </button>
            ))}
          </div>
          <div className="muted">
            Tap a lot preset to auto-fill the £ risk for your current entry/stop.
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
