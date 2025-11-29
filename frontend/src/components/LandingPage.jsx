import React from "react";

function LandingPage({ onSelectView, onLogout }) {
  return (
    <div className="landing-root">
      <div className="landing-inner">
        <header className="landing-header">
          <button
            type="button"
            className="logout-icon-btn"
            onClick={onLogout}
          >
            Logout
          </button>
          <div className="landing-logo">
            BCG<span>X</span>
          </div>
          <h1 className="landing-title">Price Optimization Tool</h1>
          <p className="landing-subtitle">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </header>

        <div className="landing-cards">
          <button
            className="landing-card"
            type="button"
            onClick={() => onSelectView("manage")}
          >
            <div className="landing-card-icon">⬛</div>
            <div className="landing-card-body">
              <h2>Create and Manage Product</h2>
              <p>
                Learn about and manage your product catalog, update pricing, and
                maintain clean product data for downstream optimization.
              </p>
            </div>
            <div className="landing-card-arrow">→</div>
          </button>

          <button
            className="landing-card"
            type="button"
            onClick={() => onSelectView("optimize")}
          >
            <div className="landing-card-icon">📈</div>
            <div className="landing-card-body">
              <h2>Pricing Optimization</h2>
              <p>
                Run pricing scenarios, generate optimized prices, and understand the
                impact on revenue and margins using demand forecasts.
              </p>
            </div>
            <div className="landing-card-arrow">→</div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;


