import { useState } from "react";
import "./Auth.css";

const API_URL = "http://localhost:5000";

function Login({ onClose, onLogin, goToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Invalid email or password.");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      onLogin(data.user);
      onClose();
    } catch (err) {
      console.error(err);
      setError(
        "Unable to connect with server. Make sure backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-modal">
        <button className="auth-close" onClick={onClose}>
          ×
        </button>

        <div className="auth-logo">R</div>

        <div className="auth-heading">
          <h2>Welcome back</h2>
          <p>Login to continue your RideRent journey.</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="auth-field">
            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?

          <button type="button" onClick={goToRegister}>
            Register
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;