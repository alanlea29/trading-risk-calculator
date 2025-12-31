import { useEffect, useRef } from "react";

export default function PremiumChart({ symbol = "OANDA:XAUUSD", theme = "dark" }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Prevent duplicate widgets on re-mount
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;

    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol,
      interval: "15",
      timezone: "Etc/UTC",
      theme,
      style: "1",
      locale: "en",
      enable_publishing: false,
      hide_top_toolbar: false,
      hide_side_toolbar: false,
      allow_symbol_change: true,
      details: true,
      calendar: true,
      support_host: "https://www.tradingview.com",
    });

    containerRef.current.appendChild(script);
  }, [symbol, theme]);

  return (
    <div className="tv-wrap">
      <div ref={containerRef} className="tradingview-widget-container" />
    </div>
  );
}
