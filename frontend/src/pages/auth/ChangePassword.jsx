import { useState } from "react";
import api from "../../services/api";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ChangePassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Get email & OTP from VerifyOtp page
  const email = location.state?.email;
  const otp = location.state?.otp;

  const submit = async () => {
    if (!password.trim() || !confirm.trim()) return toast.error("All fields are required");
    if (password !== confirm) return toast.error("Passwords do not match");

    setLoading(true);
    try {
      await api.post("/auth/change-password-reset", { email, otp, password });
      toast.success("Password updated successfully!");
      navigate("/signin");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark">
      <div className="auth">
        <h2>Change Password</h2>

        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <button onClick={submit} disabled={loading}>
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </div>
  );
}
