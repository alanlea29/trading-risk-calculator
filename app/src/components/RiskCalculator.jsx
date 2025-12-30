import { useMemo, useState } from "react";
import { SYMBOLS } from "../constants/symbols";
import { calculateRisk } from "../utils/calculateRisk";
import "../App.css";

/* ===== SIMPLE PRO CONFIG ===== */
const PRO_CODE = "ALANPRO10"; // change this before selling

export default function RiskCalculator() {
  /* ---------- State ---------- */
  const [balance, setBalance] = useState("");
  const [riskPercent, setRiskPercent] = useState("");
  const [riskCash, setRiskCash] = useState("");
  const [riskMode, setRiskMode] = useState("percent"); // percent | cash
  const [entry, setEntry] = useState("");
  const [stop, setStop] = useState("");
  const [rr, setRr] = useState("2");
  const [symbol, setSymbol] = useState("XAUUSD");

  const [isPro, setIsPro] = useState(
    () => localStorage.getItem("isPro") === "true"
  );
  const [unlockCode, setUnlockCode] = useState("");
  const [unlockError, setUnlockError] = useState("");

  const [lotCopied, setLotCopied] = useState(false);
  const [tpCopied, setTpCopied] = useState(false);

  /* ---------- Calculations ---------- */
  const results = useMemo(() => {
    const e = Number(entry);
    const s = Number(stop);

    // Avoid crashes while typing
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
            (isLong
              ? e + riskDistance * rrNum
              : e - riskDistance * rrNum
            ).toFixed(2)
          )
        : null;

    return {
      ...base,
      takeProfit,
      direction: isLong ? "BUY (Long)" : "SELL (Short)",
    };
  }, [
    balance,
    riskPercent,
    riskCash,
    riskMode,
    entry,
    stop,
    rr,
    symbol,
  ]);

  /* ---------- Helpers ---------- */
  const copyText = async (text, setter) => {
    try {
      await navigator.clipboard.writeText(String(text));
      setter(true);
      setTimeout(() => setter(false), 1500);
    } catch {
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

  const handleUnlock = () => {
    setUnlockError("");
    if (unlockCode.trim().toUpperCase() === PRO_CODE) {
      localStorage.setItem("isPro", "true");
      setIsPro(true);
      setUnlockCode("");
    } else {
      setUnlockError("Invalid code. Check spelling and try again.");
    }
  };

  /* ---------- UI ---------- */
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
              padding: "10px",
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
              padding: "10px",
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

      {/* Unlock Pro */}
      {!isPro && (
        <div className="results">
          <div className="muted">
            <strong>Pro features:</strong> Copy buttons & lot presets
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <input
              className="input"
              placeholder="Enter Pro code"
              value={unlockCode}
              onChange={(e) => setUnlockCode(e.target.value)}
            />
            <button
              type="button"
              onClick={handleUnlock}
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #e5e7eb",
                background: "#111827",
                color: "#fff",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Unlock
            </button>
          </div>

          {unlockError && (
            <div className="muted" style={{ color: "#b91c1c" }}>
              {unlockError}
            </div>
          )}
        </div>
      )}

      {/* Results */}
      {results ? (
        <div className="results">
          <div className="muted">Direction: {results.direction}</div>

          <div>
            <div className="muted">Recommended Lot Size</div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div className="big">{results.lotSize}</div>
              {isPro ? (
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
                  }}
                >
                  {lotCopied ? "Copied ✓" : "Copy"}
                </button>
              ) : (
                <span className="muted">Pro</span>
              )}
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
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div className="big">{results.takeProfit ?? "—"}</div>
              {isPro && results.takeProfit != null && (
                <button
                  type="button"
                  onClick={copyTakeProfit}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                    background: tpCopied ? "#16a34a" : "#fff",
                    color: tpCopied ? "#fff" : "#111827",
                    cursor: "pointer",
                  }}
                >
                  {tpCopied ? "Copied ✓" : "Copy"}
                </button>
              )}
            </div>
          </div>

          {isPro && (
            <>
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
                    }}
                  >
                    Set {lot.toFixed(2)} lot
                  </button>
                ))}
              </div>
              <div className="muted">
                Tap a lot preset to auto-fill the £ risk.
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="muted">
          Enter balance, risk, entry and stop (entry ≠ stop)
        </div>
      )}
    </div>
  );
}
