import { useState, useEffect } from "react";
import api from "../../services/api";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const submit = async () => {
    if (!otp.trim()) return toast.error("OTP is required");
    if (timeLeft <= 0) return toast.error("OTP expired, please request again");

    setLoading(true);
    try {
      await api.post("/auth/verify-otp-reset", { email, otp });
      toast.success("OTP verified successfully!");
      navigate("/change-password", { state: { email, otp } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark">
      <div className="auth">
        <h2>Verify OTP</h2>

        <p style={{ marginBottom: "10px" }}>
          OTP will expire in: <span style={{ fontWeight: "bold" }}>{formatTime(timeLeft)}</span>
        </p>

        <input
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button onClick={submit} disabled={loading || timeLeft <= 0}>
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
    </div>
  );
}
