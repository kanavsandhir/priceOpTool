import React, { useMemo, useState } from "react";
import ManageProductTable from "./ManageProductTable";
import AddProductModal from "./AddProductModal";
import DemandForecastModal from "./DemandForecastModal";
import { createProduct, updateProduct, deleteProduct } from "../services/api";

function CreateManagePage({
  products,
  loading,
  error,
  canManage,
  onBack,
  onLogout,
  onSelectProduct,
  onProductCreated,
  onProductUpdated,
  onProductDeleted
}) {
  const [withForecast, setWithForecast] = useState(true);
  const [searchDraft, setSearchDraft] = useState("");
  const [categoryDraft, setCategoryDraft] = useState("All");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedIds, setSelectedIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [activeProduct, setActiveProduct] = useState(null);
  const [showForecast, setShowForecast] = useState(false);

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

    // "With Demand Forecast" toggle is currently cosmetic only; it does not
    // filter rows. All products are shown on this page.

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

  const hasSelection = selectedIds.length > 0;

  return (
    <div className="page-root">
      <header className="page-header">
        <div className="app-title-neon">Price Optimization Tool</div>
        <button
          type="button"
          className="logout-icon-btn"
          onClick={onLogout}
        >
          Logout
        </button>
      </header>

      <div className="toolbar-container">
        <div className="toolbar-left">
          <button className="link-back" type="button" onClick={onBack}>
            « Back
          </button>
          <div className="toolbar-title">Create and Manage Product</div>
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
              onChange={(e) => {
                const value = e.target.value;
                setSearchDraft(value);
                // Search should work standalone without pressing Filter
                setSearch(value);
              }}
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
              // Dropdown filter should apply only when Filter is pressed
              setCategory(categoryDraft);
            }}
          >
            Filter
          </button>

          <span className="toolbar-divider" />

          <button
            type="button"
            className={`primary-chip-btn ${!canManage ? "chip-disabled" : ""}`}
            disabled={!canManage}
            onClick={() => {
              if (!canManage) return;
              setModalMode("create");
              setActiveProduct(null);
              setShowModal(true);
            }}
          >
            + Add New Products
          </button>
          <button
            type="button"
            className={`primary-chip-btn secondary-chip ${
              hasSelection ? "" : "chip-disabled"
            }`}
            disabled={!hasSelection}
            onClick={() => setShowForecast(true)}
          >
            Demand Forecast
          </button>
        </div>
      </div>

      <div className="page-content">
        {loading && <p className="info">Loading...</p>}
        {error && <p className="error">{error}</p>}
        <section
          className="left-panel full-width"
          onClick={() => onSelectProduct(null)}
        >
          <ManageProductTable
            products={filteredProducts}
            showForecast={withForecast}
            canManage={canManage}
            onSelectionChange={setSelectedIds}
            onView={(p) => {
              setModalMode("view");
              setActiveProduct(p);
              setShowModal(true);
            }}
            onEdit={(p) => {
              setModalMode("edit");
              setActiveProduct(p);
              setShowModal(true);
            }}
            onDelete={async (p) => {
              if (!window.confirm("Are you sure you want to delete this product?")) {
                return;
              }
              try {
                setSaving(true);
                await deleteProduct(p.product_id);
                onProductDeleted?.(p.product_id);
              } catch (e) {
                // eslint-disable-next-line no-console
                console.error("Failed to delete product", e);
              } finally {
                setSaving(false);
              }
            }}
          />
        </section>
      </div>

      <AddProductModal
        open={showModal}
        mode={modalMode}
        product={activeProduct}
        categories={categories}
        onClose={() => setShowModal(false)}
        saving={saving}
        onSubmit={async (payload) => {
          try {
            setSaving(true);
            if (modalMode === "create") {
              const created = await createProduct(payload);
              onProductCreated?.(created);
            } else if (modalMode === "edit" && activeProduct) {
              const updated = await updateProduct(activeProduct.product_id, payload);
              onProductUpdated?.(updated);
            }
            setShowModal(false);
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error("Failed to create product", e);
          } finally {
            setSaving(false);
          }
        }}
      />

      <DemandForecastModal
        open={showForecast}
        products={products.filter((p) => selectedIds.includes(p.product_id))}
        onClose={() => setShowForecast(false)}
      />
    </div>
  );
}

export default CreateManagePage;

