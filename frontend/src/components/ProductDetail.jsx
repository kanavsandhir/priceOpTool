import React from "react";

function ProductDetail({ product, onOptimize }) {
  return (
    <div className="detail-card">
      <h3>{product.name}</h3>
      <p className="muted">Category: {product.category || "N/A"}</p>
      {product.description && <p>{product.description}</p>}

      <div className="detail-grid">
        <div>
          <label>Cost Price</label>
          <div>${product.cost_price?.toFixed(2)}</div>
        </div>
        <div>
          <label>Selling Price</label>
          <div>${product.selling_price?.toFixed(2)}</div>
        </div>
        <div>
          <label>Stock Available</label>
          <div>{product.stock_available}</div>
        </div>
        <div>
          <label>Units Sold</label>
          <div>{product.units_sold}</div>
        </div>
        <div>
          <label>Customer Rating</label>
          <div>{product.customer_rating ?? "N/A"}</div>
        </div>
        <div>
          <label>Demand Forecast</label>
          <div>{product.demand_forecast ?? "N/A"}</div>
        </div>
        <div>
          <label>Optimized Price</label>
          <div>
            {product.optimized_price != null
              ? `$${product.optimized_price.toFixed(2)}`
              : "Not optimized yet"}
          </div>
        </div>
      </div>

      <button className="primary-btn" onClick={() => onOptimize(product)}>
        Optimize Price
      </button>
    </div>
  );
}

export default ProductDetail;


