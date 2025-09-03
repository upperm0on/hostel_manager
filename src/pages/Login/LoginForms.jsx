import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "../../assets/css/Login/SignUpForms.css";

function LoginForms() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  async function handleLogin(e) {
    e.preventDefault();
    const username = e.target.querySelector("#name").value;
    const password = e.target.querySelector("#password").value;

    try {
      const res = await fetch("http://localhost:8080/hq/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await res.json();

      if (data.token) {
        // Use AuthContext to login
        login(data.token, username);

        // Redirect to the page they were trying to access, or dashboard
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      } else {
        setError("Invalid login. Please try again.");
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="sign_up" onSubmit={handleLogin}>
      <h2 className="form-title">Jump Back In</h2>

      {error && <p className="error-message">{error}</p>}

      <div className="sign_up-item">
        <label htmlFor="name">
          <div className="label_container">
            <img src="/icons/person.svg" alt="person" />
          </div>
        </label>
        <input type="text" id="name" placeholder="Name" autoFocus required />
      </div>

      <div className="sign_up-item">
        <label htmlFor="password">
          <div className="label_container">
            <img src="/icons/password.svg" alt="password" />
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
          <img
            src={
              showPassword ? "/icons/opened_eye.svg" : "/icons/closed_eye.svg"
            }
            alt="toggle password visibility"
          />
        </div>
      </div>

      <button type="submit" className="form_submit">
        Submit
      </button>
      <p className="login_option">
        Don't have an account yet? <Link to="/signup">Sign-Up Here</Link>
      </p>
    </form>
  );
}

export default LoginForms;
