import RiskCalculator from "./components/RiskCalculator";
import "./App.css";

export default function App() {
  return (
    <div className="page">
      <header className="header">
        <div className="brand">
          <div className="logo">RC</div>
          <div>
            <div className="brandName">RiskCalc</div>
            <div className="brandTag">Position sizing made simple</div>
          </div>
        </div>

        <a className="headerLink" href="#calculator">
          Open Calculator
        </a>
      </header>

      <main className="main">
        <section className="hero">
          <h1 className="heroTitle">Trading Risk Calculator</h1>
          <p className="heroSub">
            Instantly calculate <strong>lot size</strong>, <strong>£ risk</strong>,{" "}
            <strong>RR take profit</strong> and copy values into MT4/MT5.
          </p>

          <div className="heroBadges">
            <span className="badge">No login</span>
            <span className="badge">Mobile friendly</span>
            <span className="badge">Fast</span>
          </div>

          <div className="heroCTA">
            <a className="btnPrimary" href="#calculator">
              Use the Calculator
            </a>

            <a
              className="btnSecondary"
              href="alanlea.gumroad.com/l/bkrsef"
              target="_blank"
              rel="noopener noreferrer"
            >
              Unlock Pro (£9.99)
             <a
              href="https://alanlea.gumroad.com/l/bkrsef"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-pro"
            >
              🔓 Unlock Pro
</a>


            </a>
            </div>


        </section>

        <section className="grid">
          <div className="card2">
            <div className="cardTitle">Risk by % or £</div>
            <div className="cardText">
              Choose risk percentage or type the exact £ amount you’re willing to
              lose. The calculator sizes the position automatically.
            </div>
          </div>

          <div className="card2">
            <div className="cardTitle">Copy values</div>
            <div className="cardText">
              One tap to copy lot size or take profit. Great on mobile while
              placing trades.
            </div>
          </div>

          <div className="card2">
            <div className="cardTitle">Lot presets</div>
            <div className="cardText">
              Tap common lots (0.01 / 0.02 / 0.05 / 0.10) to auto-fill the £ risk
              for your current stop distance.
            </div>
          </div>
        </section>

        <section id="calculator" className="calcWrap">
          <div className="calcHeader">
            <h2 className="calcTitle">Calculator</h2>
            <p className="calcSub">Enter your trade details — results update instantly.</p>
          </div>
          <RiskCalculator />
        </section>

        <section id="how" className="how">
          <h2 className="howTitle">How it works</h2>
          <ol className="howList">
            <li>Enter your balance and choose Risk % or Risk £.</li>
            <li>Enter Entry and Stop Loss. The distance is your risk in points.</li>
            <li>We calculate lot size so your max loss matches your chosen risk.</li>
            <li>Optional: set RR to display a suggested Take Profit.</li>
          </ol>

          <div className="disclaimer">
            <strong>Disclaimer:</strong> This tool is for educational purposes only. Trading
            involves risk. Always double-check your broker’s contract specs.
          </div>
        </section>
      </main>

      <footer className="footer">
        <div>© {new Date().getFullYear()} RiskCalc</div>
        <div className="footerLinks">
          <a href="#calculator">Calculator</a>
          <a href="#how">How it works</a>
          <a href="https://alanlea.gumroad.com/l/bkrsef"
             target="_blank"
             rel="noopener noreferrer"
>
  Unlock Pro
</a>

        </div>
      </footer>
    </div>
  );
}
