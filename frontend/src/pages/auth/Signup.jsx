import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    // Frontend validation
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError("All fields are required");
      return;
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email");
      return;
    }

    try {
      setLoading(true);

      // Axios POST request
      await api.post("/auth/signup", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      setLoading(false);

      // Navigate to OTP verification page
      navigate("/verify-otp", { state: { email: form.email } });
    } catch (err) {
      setLoading(false);
      setError(
        err.response?.data?.message || "Signup failed. Please try again."
      );
    }
  };

  return (
    <div className="dark">
      <div className="auth">
        <h2>Sign Up</h2>
        {error && <p className="error">{error}</p>}

        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button onClick={submit} disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        <p style={{ marginTop: "15px", textAlign: "center" }}>
          Already have an account? <Link to="/signin">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
