import { useMemo } from "react";
import TradingViewEmbed from "./TradingViewEmbed";

export default function GoldNews() {
  const config = useMemo(() => {
    return JSON.stringify({
      feedMode: "all_symbols",
      colorTheme: "dark",
      isTransparent: false,
      displayMode: "adaptive",
      locale: "en"
    });
  }, []);

  return (
    <TradingViewEmbed
      scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-news.js"
      configJSON={config}
      height={520}
    />
  );
}
