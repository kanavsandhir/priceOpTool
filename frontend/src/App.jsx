import React, { useEffect, useState } from "react";
import { getProducts, optimizeProduct } from "./services/api";
import LandingPage from "./components/LandingPage";
import CreateManagePage from "./components/CreateManagePage";
import PricingOptimizationPage from "./components/PricingOptimizationPage";

function App() {
  const [view, setView] = useState("home"); // 'home' | 'manage' | 'optimize'
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getProducts();
      setProducts(data);
      if (!selected && data.length > 0) {
        setSelected(data[0]);
      }
    } catch (e) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load products once when the app mounts so both pages can use them.
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOptimize = async (product) => {
    try {
      setLoading(true);
      setError("");
      const res = await optimizeProduct(product.product_id);
      const updated = products.map((p) =>
        p.product_id === product.product_id
          ? { ...p, optimized_price: res.optimized_price }
          : p
      );
      setProducts(updated);
      setSelected((prev) =>
        prev && prev.product_id === product.product_id
          ? { ...prev, optimized_price: res.optimized_price }
          : prev
      );
    } catch (e) {
      setError("Failed to optimize price");
    } finally {
      setLoading(false);
    }
  };

  if (view === "home") {
    return <LandingPage onSelectView={setView} />;
  }

  if (view === "manage") {
    return (
      <CreateManagePage
        products={products}
        loading={loading}
        error={error}
        onBack={() => setView("home")}
        onSelectProduct={setSelected}
        onProductCreated={(p) => setProducts((prev) => [...prev, p])}
        onProductUpdated={(p) =>
          setProducts((prev) =>
            prev.map((prod) =>
              prod.product_id === p.product_id ? p : prod
            )
          )
        }
        onProductDeleted={(id) =>
          setProducts((prev) =>
            prev.filter((prod) => prod.product_id !== id)
          )
        }
      />
    );
  }

  return (
    <PricingOptimizationPage
      products={products}
      selected={selected}
      loading={loading}
      error={error}
      onBack={() => setView("home")}
      onSelectProduct={setSelected}
      onOptimize={handleOptimize}
    />
  );
}

export default App;

