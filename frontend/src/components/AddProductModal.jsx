import React, { useEffect, useState } from "react";

function AddProductModal({
  open,
  mode = "create", // 'create' | 'view' | 'edit'
  product,
  categories,
  onClose,
  onSubmit,
  saving
}) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    cost_price: "",
    selling_price: "",
    description: "",
    stock_available: "",
    units_sold: ""
  });

  useEffect(() => {
    if (!open) return;

    if ((mode === "view" || mode === "edit") && product) {
      setForm({
        name: product.name || "",
        category: product.category || "",
        cost_price:
          product.cost_price !== undefined && product.cost_price !== null
            ? String(product.cost_price)
            : "",
        selling_price:
          product.selling_price !== undefined && product.selling_price !== null
            ? String(product.selling_price)
            : "",
        description: product.description || "",
        stock_available:
          product.stock_available !== undefined &&
          product.stock_available !== null
            ? String(product.stock_available)
            : "",
        units_sold:
          product.units_sold !== undefined && product.units_sold !== null
            ? String(product.units_sold)
            : ""
      });
    } else {
      setForm({
        name: "",
        category: "",
        cost_price: "",
        selling_price: "",
        description: "",
        stock_available: "",
        units_sold: ""
      });
    }
  }, [open, mode, product]);

  if (!open) return null;

  const isReadOnly = mode === "view";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.category) {
      return;
    }
    const payload = {
      name: form.name,
      category: form.category,
      cost_price: Number(form.cost_price || 0),
      selling_price: Number(form.selling_price || 0),
      description: form.description || "",
      stock_available: Number(form.stock_available || 0),
      units_sold: Number(form.units_sold || 0),
      // optional fields
      customer_rating: null,
      demand_forecast: null,
      optimized_price: null
    };
    onSubmit?.(payload);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <h3>
            {mode === "create"
              ? "Add New Products"
              : mode === "edit"
              ? "Edit Product"
              : "View Product"}
          </h3>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="modal-grid">
              <label>
                <span>Product Name</span>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter Product Name"
                  required
                  disabled={isReadOnly}
                />
              </label>
              <label>
                <span>Product Category</span>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  disabled={isReadOnly}
                >
                  <option value="">Select Category</option>
                  {categories
                    .filter((c) => c !== "All")
                    .map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                </select>
              </label>
            </div>

            <div className="modal-grid">
              <label>
                <span>Cost Price</span>
                <input
                  name="cost_price"
                  value={form.cost_price}
                  onChange={handleChange}
                  placeholder="0.00"
                  type="number"
                  step="0.01"
                  disabled={isReadOnly}
                />
              </label>
              <label>
                <span>Selling Price</span>
                <input
                  name="selling_price"
                  value={form.selling_price}
                  onChange={handleChange}
                  placeholder="0.00"
                  type="number"
                  step="0.01"
                  disabled={isReadOnly}
                />
              </label>
            </div>

            <label className="modal-full">
              <span>Description</span>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Enter Description"
                disabled={isReadOnly}
              />
            </label>

            <div className="modal-grid">
              <label>
                <span>Available Stock</span>
                <input
                  name="stock_available"
                  value={form.stock_available}
                  onChange={handleChange}
                  type="number"
                  placeholder="0"
                  disabled={isReadOnly}
                />
              </label>
              <label>
                <span>Units Sold</span>
                <input
                  name="units_sold"
                  value={form.units_sold}
                  onChange={handleChange}
                  type="number"
                  placeholder="0"
                  disabled={isReadOnly}
                />
              </label>
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={onClose}
            >
              Cancel
            </button>
            {mode !== "view" && (
              <button
                type="submit"
                className="primary-btn primary-btn-small"
                disabled={saving}
              >
                {saving
                  ? mode === "create"
                    ? "Adding..."
                    : "Saving..."
                  : mode === "create"
                  ? "Add"
                  : "Save"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProductModal;


