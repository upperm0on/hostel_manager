import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Mail, Eye, EyeOff, Lock } from "lucide-react";
import { API_ENDPOINTS } from "../../config/api";
import "../../assets/css/Login/SignUpForms.css";

function LoginForms() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

    async function handleLogin(e) {
    e.preventDefault();
<<<<<<< HEAD
    const email = e.target.querySelector("#name").value;
=======
    const email = e.target.querySelector("#email").value;
>>>>>>> 2a3edf0 (email verification changes)
    const password = e.target.querySelector("#password").value;
    const username = email;

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(API_ENDPOINTS.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, is_manager: true }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Invalid email or password");
        } else if (res.status === 500) {
          throw new Error("Server error. Please try again later.");
        } else if (res.status === 404) {
          throw new Error("Login endpoint not found. Please check the URL.");
        } else {
          throw new Error(`Login failed (${res.status}). Please try again.`);
        }
      }

      const data = await res.json();

      if (data.token && data.status === "success") {
        await login(data);
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      } else {
        setError("Invalid login response. Please try again.");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="sign_up" onSubmit={handleLogin}>
      <h2 className="form-title">Jump Back In</h2>

      {error && <p className="error-message">{error}</p>}

      <div className="sign_up-item">
        <label htmlFor="email">
          <div className="label_container">
            <Mail size={20} />
          </div>
        </label>
        <input type="email" id="email" placeholder="Email Address" autoFocus required />
      </div>

      <div className="sign_up-item">
        <label htmlFor="password">
          <div className="label_container">
            <Lock size={20} />
          </div>
        </label>
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          placeholder="Password"
          required
        />
        <div
          className="show_hide"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </div>
      </div>

      <button 
        type="submit" 
        className="form_submit"
        disabled={isLoading}
      >
        {isLoading ? "Logging in..." : "Submit"}
      </button>
      <p className="login_option">
        Don't have an account yet? <Link to="/signup">Sign-Up Here</Link>
      </p>
    </form>
  );
}

export default LoginForms;
