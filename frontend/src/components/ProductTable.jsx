import React from "react";

function ProductTable({ products, selectedId, onSelect }) {
  return (
    <div className="table-wrapper">
      <table className="product-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Product Category</th>
            <th>Description</th>
            <th className="price-col">Cost Price</th>
            <th className="price-col">Selling Price</th>
            <th className="price-col">Optimized Price</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr
              key={p.product_id}
              className={p.product_id === selectedId ? "selected" : ""}
              onClick={() => onSelect(p)}
            >
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>{p.description}</td>
              <td className="price-col">${p.cost_price?.toFixed(2)}</td>
              <td className="price-col">${p.selling_price?.toFixed(2)}</td>
              <td className="price-col">
                {p.optimized_price != null
                  ? `$${p.optimized_price.toFixed(2)}`
                  : "-"}
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

export default ProductTable;


