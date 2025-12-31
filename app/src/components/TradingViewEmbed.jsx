import { useEffect, useRef } from "react";

export default function TradingViewEmbed({ scriptSrc, configJSON, height = 500 }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Reset the container each time
    el.innerHTML = `
      <div class="tradingview-widget-container" style="height: 100%; width: 100%;">
        <div class="tradingview-widget-container__widget" style="height: 100%; width: 100%;"></div>
      </div>
    `;

    const script = document.createElement("script");
    script.src = scriptSrc;
    script.async = true;
    script.innerHTML = configJSON;

    // Append the script inside the TradingView container
    const tvContainer = el.querySelector(".tradingview-widget-container");
    tvContainer.appendChild(script);

    return () => {
      if (el) el.innerHTML = "";
    };
  }, [scriptSrc, configJSON]);

  return (
    <div style={{ height, width: "100%" }}>
      <div ref={containerRef} style={{ height: "100%", width: "100%" }} />
    </div>
  );
}
