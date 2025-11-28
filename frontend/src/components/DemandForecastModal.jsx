import React, { useMemo } from "react";

function DemandForecastModal({ open, products, onClose }) {
  if (!open) return null;

  const chartData = useMemo(() => {
    if (!products || products.length === 0)
      return { pointsPrice: [], pointsDemand: [], maxPrice: 1 };

    const maxPrice = Math.max(...products.map((p) => p.selling_price || 0), 1);
    const rawDemand = products.map(
      (p) => p.demand_forecast ?? p.units_sold ?? 0
    );
    const maxDemand = Math.max(...rawDemand, 1);

    const width = 800;
    const height = 220;
    const padding = 20;
    const stepX =
      products.length > 1
        ? (width - padding * 2) / (products.length - 1)
        : 0;

    const scaleY = (value, max) =>
      height - padding - (value / max) * (height - padding * 2);

    const pointsPrice = products.map((p, idx) => ({
      x: padding + idx * stepX,
      y: scaleY(p.selling_price || 0, maxPrice),
    }));

    // scale demand into the same vertical range as price
    const pointsDemand = rawDemand.map((d, idx) => ({
      x: padding + idx * stepX,
      y: scaleY((d / maxDemand) * maxPrice, maxPrice),
    }));

    return { pointsPrice, pointsDemand, width, height, padding, maxPrice };
  }, [products]);

  const {
    pointsPrice,
    pointsDemand,
    width = 800,
    height = 220,
    maxPrice = 1,
  } = chartData;

  const linePath = (points) =>
    points
      .map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
      .join(" ");

  return (
    <div className="modal-backdrop">
      <div className="forecast-modal-card">
        <div className="modal-header">
          <h3>Demand Forecast</h3>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="forecast-chart-wrapper">
          <svg
            className="forecast-chart"
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
          >
            {/* Axes */}
            <line
              x1="40"
              y1={height - 30}
              x2={width - 20}
              y2={height - 30}
              stroke="#4b5563"
              strokeWidth="1"
            />
            <line
              x1="40"
              y1="20"
              x2="40"
              y2={height - 30}
              stroke="#4b5563"
              strokeWidth="1"
            />

            {/* Y-axis ticks and labels (normalized price range) */}
            {Array.from({ length: 5 }).map((_, idx) => {
              const value = (maxPrice / 4) * idx;
              const y =
                height - 30 - ((height - 50) * idx) / 4; // fits between top/bottom axes
              return (
                <g key={idx}>
                  <line
                    x1="37"
                    y1={y}
                    x2="40"
                    y2={y}
                    stroke="#4b5563"
                    strokeWidth="1"
                  />
                  <text
                    x="32"
                    y={y + 3}
                    textAnchor="end"
                    fontSize="9"
                    fill="#9ca3af"
                  >
                    {value.toFixed(0)}
                  </text>
                </g>
              );
            })}

            {/* Price line (neon green/blue) */}
            {pointsPrice.length > 1 && (
              <path
                d={linePath(pointsPrice)}
                fill="none"
                stroke="#22c55e"
                strokeWidth="2"
              />
            )}

            {/* Demand line (purple) */}
            {pointsDemand.length > 1 && (
              <path
                d={linePath(pointsDemand)}
                fill="none"
                stroke="#a855f7"
                strokeWidth="2"
              />
            )}

            {/* X-axis labels: Product 1, Product 2, ... */}
            {products.map((p, idx) => {
              const x =
                pointsPrice[idx]?.x ??
                (40 + ((width - 60) / Math.max(products.length, 1)) * idx);
              return (
                <text
                  key={p.product_id}
                  x={x}
                  y={height - 12}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#9ca3af"
                >
                  {`Product ${idx + 1}`}
                </text>
              );
            })}

            {/* Y-axis label */}
            <text
              x="14"
              y="9"
              textAnchor="start"
              fontSize="10"
              fill="#9ca3af"
            >
              Price
            </text>
          </svg>

          <div className="forecast-legend">
            <span className="legend-item">
              <span className="legend-swatch legend-price" />
              Selling Price
            </span>
            <span className="legend-item">
              <span className="legend-swatch legend-demand" />
              Forecasted Demand
            </span>
          </div>
        </div>

        <div className="forecast-table-wrapper">
          <table className="manage-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Product Category</th>
                <th className="manage-cp">Cost Price</th>
                <th>Selling Price</th>
                <th>Available Stock</th>
                <th>Units Sold</th>
                <th>Calculated Demand Forecast</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.product_id}>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td className="manage-cp">${p.cost_price?.toFixed(2)}</td>
                  <td>${p.selling_price?.toFixed(2)}</td>
                  <td>{p.stock_available}</td>
                  <td>{p.units_sold}</td>
                  <td className="forecast-highlight">
                    {p.demand_forecast ?? p.units_sold ?? 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DemandForecastModal;



