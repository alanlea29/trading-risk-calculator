export function calculateRisk({
  balance,
  riskPercent,
  entry,
  stop,
  valuePerPoint,
}) {
  if (!balance || !riskPercent || entry === stop) return null;

  const riskAmount = (balance * riskPercent) / 100;
  const distance = Math.abs(entry - stop);
  const lotSize = riskAmount / (distance * valuePerPoint);

  if (!isFinite(lotSize) || lotSize <= 0) return null;

  return {
    lotSize: Number(lotSize.toFixed(2)),
    riskAmount: Number(riskAmount.toFixed(2)),
    distance: Number(distance.toFixed(2)),
  };
}
