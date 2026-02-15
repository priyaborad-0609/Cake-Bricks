import { useEffect, useState, useRef } from "react";
import api from "../../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const pendingToastShown = useRef(false);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);

        const [statsRes, ordersRes] = await Promise.all([
          api.get("/admin/dashboard"),
          api.get("/admin/orders"),
        ]);

        if (statsRes.data?.stats) {
          setStats(statsRes.data.stats);
        }

        if (Array.isArray(ordersRes.data?.orders)) {
          setOrders(ordersRes.data.orders.slice(0, 5));
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading)
    return (
      <div className="page-container center">
        <div className="loader"></div>
        <p>Loading dashboard...</p>
      </div>
    );

  if (!stats)
    return <div className="page-container">No data available</div>;

  const pendingOrders = orders.filter((o) => o.status === "Pending");

  if (pendingOrders.length > 0 && !pendingToastShown.current) {
    toast.info(`⚠️ You have ${pendingOrders.length} pending orders!`);
    pendingToastShown.current = true;
  }

  return (
    <div className="page-container">
      <ToastContainer />

      <h2 className="heading">📊 Admin Dashboard</h2>

      {/* STATS */}
      <div className="stats-container">
        <StatCard title="Users" value={stats.totalUsers} />
        <StatCard title="Orders" value={stats.totalOrders} />
        <StatCard title="Cakes" value={stats.totalCakes} />
        <StatCard
          title="Revenue"
          value={`₹${stats.totalRevenue}`}
          highlight
        />
      </div>

      {/* ALERT */}
      {pendingOrders.length > 0 && (
        <div className="alert">
          ⚠️ You have {pendingOrders.length} pending orders!
        </div>
      )}

      {/* RECENT ORDERS */}
      <div className="section">
        <h3>🧾 Recent Orders</h3>

        {orders.length === 0 ? (
          <p>No recent orders</p>
        ) : (
          <div className="orders-container">
            {orders.map((o) => (
              <div key={o._id} className="order-card">
                <div className="order-header">
                  <div>
                    <p className="user-name">{o.user?.name || "User"}</p>
                    <p className="user-email">{o.user?.email}</p>
                  </div>
                  <span className="date">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="order-details">
                  <span className={`status ${o.status.toLowerCase()}`}>
                    {o.status}
                  </span>

                  <span className="amount">
                    ₹{o.totalAmount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .page-container {
          padding: 40px;
          background: #f4f6fb;
          min-height: 100vh;
          font-family: 'Segoe UI', sans-serif;
        }

        .center {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .heading {
          font-size: 30px;
          margin-bottom: 30px;
          font-weight: 600;
        }

        /* ===== Stats ===== */
        .stats-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 25px;
          margin-bottom: 35px;
        }

        .stat-card {
          background: white;
          padding: 25px;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.05);
          transition: 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
        }

        .stat-card .title {
          font-size: 14px;
          color: #888;
          margin-bottom: 10px;
        }

        .stat-card .value {
          font-size: 28px;
          font-weight: 700;
        }

        .stat-card.highlight {
          background: linear-gradient(135deg, #4f46e5, #6366f1);
          color: white;
        }

        /* ===== Alert ===== */
        .alert {
          background: #fff3cd;
          padding: 14px 18px;
          border-radius: 10px;
          margin-bottom: 30px;
          font-weight: 500;
        }

        /* ===== Orders ===== */
        .section h3 {
          margin-bottom: 15px;
        }

        .orders-container {
          display: grid;
          gap: 15px;
        }

        .order-card {
          background: white;
          padding: 18px 20px;
          border-radius: 14px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.05);
          transition: 0.3s ease;
        }

        .order-card:hover {
          transform: translateY(-4px);
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .user-name {
          font-weight: 600;
        }

        .user-email {
          font-size: 13px;
          color: #777;
        }

        .date {
          font-size: 13px;
          color: #999;
        }

        .order-details {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .status {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
        }

        .status.pending {
          background: #fff3cd;
          color: #856404;
        }

        .status.completed {
          background: #d4edda;
          color: #155724;
        }

        .amount {
          font-weight: 600;
          font-size: 15px;
        }

        /* ===== Loader ===== */
        .loader {
          border: 4px solid #eee;
          border-top: 4px solid #4f46e5;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin-bottom: 10px;
        }

        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function StatCard({ title, value, highlight }) {
  return (
    <div className={`stat-card ${highlight ? "highlight" : ""}`}>
      <p className="title">{title}</p>
      <p className="value">{value}</p>
    </div>
  );
}
