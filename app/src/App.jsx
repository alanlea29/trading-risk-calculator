import "./App.css";

import RiskCalculator from "./components/RiskCalculator";
import GoldChart from "./components/GoldChart";
import GoldNews from "./components/GoldNews";
import EconCalendar from "./components/EconCalendar";
import { Suspense, lazy } from "react";

const GoldChart = lazy(() => import("./components/GoldChart"));
const GoldNews = lazy(() => import("./components/GoldNews"));
const EconCalendar = lazy(() => import("./components/EconCalendar"));
// Optional premium:
const PremiumChart = lazy(() => import("./components/PremiumChart"));


export default function App() {
  const GUMROAD_PRODUCT_URL = "https://alanlea.gumroad.com/l/bkrsef"; // change if needed

  return (
    <div className="app">
      {/* Top bar */}
      <header className="header">
        <div className="header-inner">
          <div className="brand">
            <div className="brand-mark">AU</div>
            <div className="brand-text">
              <div className="brand-title">Gold Trading Hub</div>
              <div className="brand-subtitle">Risk tools for XAUUSD</div>
            </div>
          </div>

          <nav className="nav">
            <a className="nav-link" href="#calculator">
              Calculator
            </a>
            <a className="nav-link" href="#markets">
              Markets
            </a>
            <a className="nav-link" href="#how">
              How it works
            </a>

            <a
              className="btn btn-pro"
              href={GUMROAD_PRODUCT_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Unlock Pro
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <div className="badge">XAUUSD • Position sizing • Risk discipline</div>

            <h1 className="hero-title">
              Trade gold with a plan — <span className="accent">size every trade correctly</span>
            </h1>

            <p className="hero-lead">
              Calculate lot size, £ risk and position sizing in seconds. Built for gold traders who want
              consistency, not guesswork.
            </p>

            <div className="hero-actions">
              <a className="btn btn-primary" href="#calculator">
                Open Risk Calculator
              </a>

              <a
                className="btn btn-outline"
                href={GUMROAD_PRODUCT_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Unlock Pro
              </a>
            </div>

            <div className="hero-notes">
              <div className="note">
                <strong>Fast:</strong> Inputs → lot size instantly
              </div>
              <div className="note">
                <strong>Clean:</strong> No clutter, just decision-making
              </div>
              <div className="note">
                <strong>Pro:</strong> Extra tools + updates via Gumroad
              </div>
            </div>
          </div>

          {/* Pro card */}
          <aside className="hero-card">
            <div className="card">
              <div className="card-title">Pro Upgrade</div>
              <div className="card-subtitle">
                Remove friction from your routine and keep the hub improving.
              </div>

              <ul className="card-list">
                <li>Unlock Pro buttons + premium routing</li>
                <li>More tools, refinements & updates</li>
                <li>Support the build + future features</li>
              </ul>

              <a
                className="btn btn-pro block"
                href={GUMROAD_PRODUCT_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Unlock Pro
              </a>

              <div className="card-foot">One-time purchase on Gumroad</div>
            </div>
          </aside>
        </div>
      </section>

      {/* Main */}
      <main className="main">
        <div className="layout">
          {/* LEFT: Calculator */}
          <section id="calculator" className="panel panel-primary">
            <div className="panel-head">
              <div>
                <h2 className="panel-title">Risk Calculator</h2>
                <p className="panel-subtitle">
                  Enter your balance, risk %, and stop loss to calculate position size.
                </p>
              </div>

              <a
                className="btn btn-pro btn-sm"
                href={GUMROAD_PRODUCT_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Unlock Pro
              </a>
            </div>

            <div className="panel-body">
              <RiskCalculator />
            </div>
          </section>

          {/* RIGHT: Market widgets */}
          <aside id="markets" className="panel-stack">
            <section className="panel">
              <div className="panel-head compact">
                <h3 className="panel-title-sm">Gold Price Chart</h3>
                <span className="panel-chip">Live view</span>
              </div>
              <div className="panel-body">
                <GoldChart />
              </div>
            </section>

            <section className="panel">
              <div className="panel-head compact">
                <h3 className="panel-title-sm">Gold News</h3>
                <span className="panel-chip">Headlines</span>
              </div>
              <div className="panel-body">
                <GoldNews />
              </div>
            </section>

            <section className="panel">
              <div className="panel-head compact">
                <h3 className="panel-title-sm">Economic Calendar</h3>
                <span className="panel-chip">Macro</span>
              </div>
              <div className="panel-body">
                <EconCalendar />
              </div>
            </section>

            {/* Optional: Ad / sponsor slot (safe placeholder) */}
            <section className="panel ad-slot" aria-label="Sponsored">
              <div className="panel-head compact">
                <h3 className="panel-title-sm">Sponsored</h3>
                <span className="panel-chip">Ad</span>
              </div>
              <div className="panel-body">
                <div className="ad-placeholder">
                  <div className="ad-placeholder-title">Ad Space</div>
                  <div className="ad-placeholder-subtitle">
                    Programmatic ad slot goes here (keeps layout stable).
                  </div>
                </div>
              </div>
            </section>
          </aside>
        </div>

        {/* How it works */}
        <section id="how" className="how">
          <h2 className="how-title">How it works</h2>

          <div className="how-grid">
            <div className="how-card">
              <div className="how-step">1</div>
              <h3>Set risk</h3>
              <p>Choose a fixed % per trade so drawdowns stay controlled.</p>
            </div>

            <div className="how-card">
              <div className="how-step">2</div>
              <h3>Define stop loss</h3>
              <p>Stop loss distance drives position size — not emotion.</p>
            </div>

            <div className="how-card">
              <div className="how-step">3</div>
              <h3>Execute consistently</h3>
              <p>Same process every trade. Better decisions, less overtrading.</p>
            </div>
          </div>

          <div className="how-cta">
            <a className="btn btn-primary" href="#calculator">
              Use the Calculator
            </a>
            <a
              className="btn btn-outline"
              href={GUMROAD_PRODUCT_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Unlock Pro
            </a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-left">
            © {new Date().getFullYear()} Gold Trading Hub · Educational use only
          </div>

          <div className="footer-right">
            <a
              href={GUMROAD_PRODUCT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              Unlock Pro
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
