import React, { useState } from "react";
import { registerUser } from "../services/api";

function LoginPage({ onLogin }) {
  const [mode, setMode] = useState("login"); // 'login' | 'register'

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regError, setRegError] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [regSuccess, setRegSuccess] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      await onLogin(email, password);
    } catch (err) {
      setError("Invalid credentials or server error");
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      setRegLoading(true);
      setRegError("");
      setRegSuccess("");
      await registerUser(regName, regEmail, regPassword);
      setRegSuccess(
        "Registration successful. Ask admin to assign a role, then you can log in."
      );
      setRegName("");
      setRegEmail("");
      setRegPassword("");
    } catch (err) {
      setRegError("Registration failed (email might already be registered).");
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="landing-root">
      <div className="landing-inner" style={{ maxWidth: "480px" }}>
        <header className="landing-header">
          <div className="landing-logo">
            BCG<span>X</span>
          </div>
          <h1 className="landing-title">Price Optimization Tool</h1>
          <p className="landing-subtitle">
            Sign in or register to manage products and run pricing optimization.
          </p>
        </header>

        <div className="tab-switcher" style={{ display: "flex", marginBottom: "1rem" }}>
          <button
            type="button"
            className={`primary-chip-btn ${mode === "login" ? "" : "secondary-chip"}`}
            style={{ flex: 1, marginRight: "0.5rem" }}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            type="button"
            className={`primary-chip-btn ${mode === "register" ? "" : "secondary-chip"}`}
            style={{ flex: 1, marginLeft: "0.5rem" }}
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>

        {mode === "login" ? (
          <form onSubmit={handleLoginSubmit} className="login-form">
            <label>
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label>
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            {error && <p className="error">{error}</p>}
            <button
              type="submit"
              className="primary-btn"
              style={{ marginTop: "1rem" }}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="login-form">
            <label>
              <span>User Name</span>
              <input
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                required
              />
            </label>
            <label>
              <span>Email</span>
              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
              />
            </label>
            <label>
              <span>Password</span>
              <input
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
              />
            </label>
            <p
              style={{
                fontSize: "0.8rem",
                color: "#9ca3af",
                marginTop: "0.5rem",
              }}
            >
              Role will be assigned later by admin.
            </p>
            {regError && <p className="error">{regError}</p>}
            {regSuccess && <p className="info">{regSuccess}</p>}
            <button
              type="submit"
              className="primary-btn"
              style={{ marginTop: "1rem" }}
              disabled={regLoading}
            >
              {regLoading ? "Registering..." : "Register"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default LoginPage;

