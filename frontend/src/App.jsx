import React, { useEffect, useState } from "react";
import { getProducts, optimizeProduct, login } from "./services/api";
import LandingPage from "./components/LandingPage";
import CreateManagePage from "./components/CreateManagePage";
import PricingOptimizationPage from "./components/PricingOptimizationPage";
import LoginPage from "./components/LoginPage";

function App() {
  const [view, setView] = useState("home"); // 'home' | 'manage' | 'optimize'
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

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
    if (user) {
      // Loads products once after successful login.
      loadProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

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

  const handleLogin = async (email, password) => {
    const res = await login(email, password); // { user_id, user_name, email, user_role }
    setUser(res);
  };

  const canManage =
    user && (user.user_role === 1 || user.user_role === 2);

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (view === "home") {
    return <LandingPage onSelectView={setView} />;
  }

  if (view === "manage") {
    return (
      <CreateManagePage
        products={products}
        loading={loading}
        error={error}
        canManage={canManage}
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

