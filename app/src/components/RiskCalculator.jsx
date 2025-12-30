import { useMemo, useState } from "react";
import { SYMBOLS } from "../constants/symbols";
import { calculateRisk } from "../utils/calculateRisk";
import "../App.css";

export default function RiskCalculator() {
  const [balance, setBalance] = useState("");
  const [riskPercent, setRiskPercent] = useState("");
  const [entry, setEntry] = useState("");
  const [stop, setStop] = useState("");
  const [symbol, setSymbol] = useState("XAUUSD");
  const [rr, setRr] = useState("2");

  const results = useMemo(() => {
    const base = calculateRisk({
      balance: Number(balance),
      riskPercent: Number(riskPercent),
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

    return { ...base, takeProfit: Number(takeProfit.toFixed(2)) };
  }, [balance, riskPercent, entry, stop, symbol, rr]);

  return (
    <div className="container">
      <div className="title">Trading Risk Calculator</div>

      <div className="card">
        <input
          className="input"
          placeholder="Balance (£)"
          type="number"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
        />

        <input
          className="input"
          placeholder="Risk %"
          type="number"
          value={riskPercent}
          onChange={(e) => setRiskPercent(e.target.value)}
        />

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
          <div>
            <div className="muted">Recommended Lot Size</div>
            <div className="big">{results.lotSize}</div>
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
            <div>{results.takeProfit ?? "—"}</div>
          </div>
        </div>
      ) : (
        <div className="muted">Enter valid values to calculate</div>
      )}
    </div>
  );
}
