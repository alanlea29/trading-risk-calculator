export function calculateRisk({
  balance,
  riskPercent,
  riskAmountOverride, // NEW: use this if provided
  entry,
  stop,
  valuePerPoint,
}) {
  if (!entry || !stop || entry === stop) return null;

  const distance = Math.abs(entry - stop);
  if (!distance || !valuePerPoint) return null;

  // Decide risk amount (£)
  let riskAmount = null;

  if (isFinite(riskAmountOverride) && riskAmountOverride > 0) {
    riskAmount = riskAmountOverride;
  } else if (isFinite(balance) && balance > 0 && isFinite(riskPercent) && riskPercent > 0) {
    riskAmount = (balance * riskPercent) / 100;
  } else {
    return null;
  }

  const lotSizeRaw = riskAmount / (distance * valuePerPoint);
  if (!isFinite(lotSizeRaw) || lotSizeRaw <= 0) return null;

  const lotSize = Math.max(0.01, Number(lotSizeRaw.toFixed(2)));

  return {
    lotSize,
    riskAmount: Number(riskAmount.toFixed(2)),
    distance: Number(distance.toFixed(2)),
  };
}
