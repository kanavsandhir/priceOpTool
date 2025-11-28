import React, { useMemo, useState } from "react";
import ProductTable from "./ProductTable";
import ProductDetail from "./ProductDetail";

function PricingOptimizationPage({
  products,
  selected,
  loading,
  error,
  onBack,
  onSelectProduct,
  onOptimize
}) {
  const [withForecast, setWithForecast] = useState(true);
  const [searchDraft, setSearchDraft] = useState("");
  const [categoryDraft, setCategoryDraft] = useState("All");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = [
    "All",
    "Outdoor & Sports",
    "Electronics",
    "Apparel",
    "Home Automation",
    "Transportation",
    "Wearables"
  ];

  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Currently the "With Demand Forecast" toggle is visual only and does not
    // filter rows. All products are shown regardless of the toggle position.

    if (category !== "All") {
      list = list.filter(
        (p) => (p.category || "").toLowerCase() === category.toLowerCase()
      );
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((p) => (p.name || "").toLowerCase().includes(q));
    }

    return list;
  }, [products, category, search]);

  return (
    <div className="page-root">
      <header className="page-header">
        <div className="app-title-neon">Price Optimization Tool</div>
      </header>

      <div className="toolbar-container">
        <div className="toolbar-left">
          <button className="link-back" type="button" onClick={onBack}>
            « Back
          </button>
          <div className="toolbar-title">Pricing Optimization</div>
        </div>
        <div className="toolbar-right">
          <label className="toggle-wrapper">
            <span className="toggle-label">With Demand Forecast</span>
            <button
              type="button"
              className={`toggle-pill ${withForecast ? "on" : "off"}`}
              onClick={() => setWithForecast((v) => !v)}
            >
              <span className="toggle-thumb" />
            </button>
          </label>

          <div className="search-wrapper">
            <input
              className="search-input"
              type="text"
              placeholder="Search"
              value={searchDraft}
              onChange={(e) => setSearchDraft(e.target.value)}
            />
          </div>

          <select
            className="category-select"
            value={categoryDraft}
            onChange={(e) => setCategoryDraft(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === "All" ? "Category: All" : c}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="filter-btn"
            onClick={() => {
              setCategory(categoryDraft);
              setSearch(searchDraft);
            }}
          >
            Filter
          </button>
        </div>
      </div>

      <div className="page-content">
        <section className="left-panel full-width">
          {loading && <p className="info">Loading...</p>}
          {error && <p className="error">{error}</p>}
          <ProductTable
            products={filteredProducts}
            selectedId={selected?.product_id}
            onSelect={onSelectProduct}
            showForecast={withForecast}
          />
        </section>
      </div>
    </div>
  );
}

export default PricingOptimizationPage;


