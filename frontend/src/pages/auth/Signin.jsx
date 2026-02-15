import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async () => {
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/signin", { email, password });
      login(res.data.role);
      navigate(res.data.role === "ADMIN" ? "/admin" : "/user");
    } catch (err) {
      setError(err.response?.data?.message || "Signin failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="dark">
      <div className="auth">
        <h2>Sign In</h2>
        {error && <p className="error">{error}</p>}

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={submit} disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <p style={{ marginTop: "15px", textAlign: "center" }}>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
        <p style={{ textAlign: "center", marginTop: "5px" }}>
          <Link to="/forgot">Forgot password?</Link>
        </p>
      </div>
    </div>
  );
}
