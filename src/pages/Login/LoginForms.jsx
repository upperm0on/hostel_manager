import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { User, Eye, EyeOff, Lock } from "lucide-react";
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
    const username = e.target.querySelector("#name").value;
    const password = e.target.querySelector("#password").value;

    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:8080/hq/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Invalid username or password");
        } else if (res.status === 500) {
          throw new Error("Server error. Please try again later.");
        } else if (res.status === 404) {
          throw new Error("Login endpoint not found. Please check the URL.");
        } else {
          throw new Error(`Login failed (${res.status}). Please try again.`);
        }
      }

      const data = await res.json();

      if (data.token) {
        login(data.token, username);
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      } else {
        setError("Invalid login. Please try again.");
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
        <label htmlFor="name">
          <div className="label_container">
            <User size={20} />
          </div>
        </label>
        <input type="text" id="name" placeholder="Name" autoFocus required />
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
