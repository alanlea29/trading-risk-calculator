import { useMemo } from "react";
import TradingViewEmbed from "./TradingViewEmbed";

export default function EconCalendar() {
  const config = useMemo(() => {
    return JSON.stringify({
      width: "100%",
      height: 420,
      colorTheme: "dark",
      isTransparent: false,
      locale: "en"
    });
  }, []);

  return (
    <TradingViewEmbed
      scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-economic-calendar.js"
      configJSON={config}
      height={420}
    />
  );
}
