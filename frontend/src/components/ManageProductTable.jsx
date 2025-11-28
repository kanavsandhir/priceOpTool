import React, { useEffect, useState } from "react";

function ManageProductTable({
  products,
  onSelectionChange,
  onView,
  onEdit,
  onDelete,
  showForecast,
  canManage,
}) {
  const [checked, setChecked] = useState(() => new Set());

  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(Array.from(checked));
    }
  }, [checked, onSelectionChange]);

  const toggleAll = (e) => {
    if (e.target.checked) {
      const all = new Set(products.map((p) => p.product_id));
      setChecked(all);
    } else {
      setChecked(new Set());
    }
  };

  const toggleOne = (id) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="table-wrapper">
      <table className="manage-table">
        <thead>
          <tr>
            <th className="select-col">
              <input type="checkbox" onChange={toggleAll} />
            </th>
            <th>Product Name</th>
            <th>Product Category</th>
            <th className="manage-cp">Cost Price</th>
            <th>Selling Price</th>
            <th>Description</th>
            <th>Available Stock</th>
            <th>Units Sold</th>
            {showForecast && <th>Demand Forecast</th>}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.product_id}>
              <td className="select-col">
                <input
                  type="checkbox"
                  checked={checked.has(p.product_id)}
                  onChange={() => toggleOne(p.product_id)}
                />
              </td>
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td className="manage-cp">${p.cost_price?.toFixed(2)}</td>
              <td>${p.selling_price?.toFixed(2)}</td>
              <td>{p.description}</td>
              <td>{p.stock_available}</td>
              <td>{p.units_sold}</td>
              {showForecast && (
                <td>{p.demand_forecast ?? p.units_sold ?? 0}</td>
              )}
              <td className="action-col">
                <button
                  type="button"
                  className="link-quiet"
                  onClick={() => onView?.(p)}
                >
                  View
                </button>
                <span className="action-sep">|</span>
                <button
                  type="button"
                  className={`link-quiet ${!canManage ? "link-quiet-disabled" : ""}`}
                  disabled={!canManage}
                  onClick={() => {
                    if (!canManage) return;
                    onEdit?.(p);
                  }}
                >
                  Edit
                </button>
                <span className="action-sep">|</span>
                <button
                  type="button"
                  className={`link-quiet ${!canManage ? "link-quiet-disabled" : ""}`}
                  disabled={!canManage}
                  onClick={() => {
                    if (!canManage) return;
                    onDelete?.(p);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {products.length === 0 && (
        <p className="info">No products found. Did you ingest the CSV?</p>
      )}
    </div>
  );
}

export default ManageProductTable;


