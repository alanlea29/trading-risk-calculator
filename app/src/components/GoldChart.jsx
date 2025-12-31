import { useMemo } from "react";
import TradingViewEmbed from "./TradingViewEmbed";

export default function GoldChart() {
  const config = useMemo(() => {
    return JSON.stringify({
      autosize: true,
      symbol: "OANDA:XAUUSD",
      interval: "60",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      hide_top_toolbar: false,
      hide_legend: false,
      allow_symbol_change: false
    });
  }, []);

  return (
    <TradingViewEmbed
      scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
      configJSON={config}
      height={520}
    />
  );
}
