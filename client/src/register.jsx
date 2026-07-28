import { useState } from "react";
import "./Auth.css";

const API_URL = "http://localhost:5000";

function Register({ onClose, goToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Registration failed.");
        return;
      }

      setSuccess("Account created successfully! Please login.");

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        goToLogin();
      }, 1200);
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
          <h2>Create account</h2>
          <p>Join RideRent and start your journey.</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        {success && (
          <div className="auth-success">{success}</div>
        )}

        <form onSubmit={handleRegister}>
          <div className="auth-field">
            <label>Full Name</label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label>Confirm Password</label>

            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?

          <button type="button" onClick={goToLogin}>
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;