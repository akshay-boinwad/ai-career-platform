import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      // FastAPI expects email and password as query parameters
      const params = new URLSearchParams({
        email: email,
        password: password,
      });

      const response = await fetch(
        `http://127.0.0.1:8000/api/auth/login?${params.toString()}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // Handle FastAPI validation errors safely
        if (Array.isArray(data.detail)) {
          const errors = data.detail
            .map((error) => error.msg)
            .join(", ");

          setMessage(errors);
        } else {
          setMessage(data.detail || "Login failed");
        }

        return;
      }

      // Save JWT token
      localStorage.setItem("access_token", data.access_token);

      // Save user information
      localStorage.setItem("user", JSON.stringify(data.user));

      setMessage("Login successful! 🚀");

      // Go to home page
      setTimeout(() => {
  navigate("/dashboard");
}, 500);
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Cannot connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">

        <div className="auth-logo">
          CareerAI 🚀
        </div>

        <h1>Welcome Back</h1>

        <p className="auth-subtitle">
          Login to continue your career journey.
        </p>

        <form className="auth-form" onSubmit={handleLogin}>

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {message && (
            <div
              className={
                message.includes("successful")
                  ? "auth-success"
                  : "auth-error"
              }
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <div className="auth-footer">
          Don't have an account?{" "}
          <Link to="/register">Create Account</Link>
        </div>

      </div>
    </div>
  );
}

export default Login;