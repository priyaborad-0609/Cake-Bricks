import { useEffect, useState } from "react";
import api from "../../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= LOAD ORDERS =================
  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/admin/orders");

      if (res.data?.success && Array.isArray(res.data.orders)) {
        setOrders(res.data.orders);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to load orders";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // ================= UPDATE STATUS =================
  const updateStatus = async (orderId, status) => {
    try {
      const res = await api.put(`/admin/orders/${orderId}/status`, { status });

      if (res.data?.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status } : o))
        );

        toast.success(res.data.message || "Status updated successfully", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      console.error("Failed to update status", err);
      const msg =
        err.response?.data?.message ||
        "Failed to update status. Make sure the status is valid.";

      toast.error(msg, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // ================= REMOVE ORDER =================
  const removeOrder = (id) => {
    setOrders((prev) => prev.filter((order) => order._id !== id));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "#f0ad4e";
      case "Processing":
        return "#5bc0de";
      case "Shipped":
        return "#0275d8";
      case "Delivered":
        return "#5cb85c";
      case "Cancelled":
        return "#d9534f";
      default:
        return "#777";
    }
  };

  return (
    <div className="admin-page">
      <ToastContainer />

      <h2>📦 Orders Management</h2>

      {loading && <p>Loading orders...</p>}
      {error && <p className="text-red">{error}</p>}
      {!loading && orders.length === 0 && <p>No orders found</p>}

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order._id} className="order-card">

            {/* ❌ OUTSIDE REMOVE ICON */}
            <span
              className="remove-order"
              onClick={() => removeOrder(order._id)}
              title="Remove Order"
            >
              ⤫
            </span>

            {/* HEADER */}
            <div className="order-header">
              <div className="user-info">
                <p className="user-name">{order.user?.name || "Unknown User"}</p>
                <p className="user-email">{order.user?.email}</p>
              </div>

              <span className="order-date">
                {new Date(order.createdAt).toLocaleString()}
              </span>
            </div>

            {/* ORDER INFO */}
            <div className="order-info">
              <p>
                <b>Total:</b> ₹{order.totalAmount}
              </p>

              <p>
                <b>Status:</b>{" "}
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  style={{
                    backgroundColor: getStatusColor(order.status),
                    color: "#fff",
                    border: "none",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </p>
            </div>

            {/* ITEMS */}
            <div className="order-items">
              <p>🧁 Items:</p>
              <ul>
                {order.items?.map((item, idx) => (
                  <li key={idx}>
                    {item.cake?.name || "Cake"} × {item.quantity} — ₹{item.price}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* ================= STYLES ================= */}
      <style>{`
        .admin-page {
          padding: 30px;
          font-family: Arial, sans-serif;
          background-color: #f9f9f9;
          color: #333;
          min-height: 100vh;
        }

        h2 {
          margin-bottom: 20px;
        }

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .order-card {
          background-color: #fff;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 6px 15px rgba(0,0,0,0.08);
          transition: 0.3s;
          position: relative;
          overflow: visible;
        }

        .order-card:hover {
          transform: translateY(-4px);
        }

        /* OUTSIDE REMOVE ICON */
        .order-card .remove-order{
        position:absolute;
        left:-26px;
        top:50%;
        transform:translateY(-50%) scale(0.8);
        font-size:18px;
        font-weight:bold;
        color:#ff4d4f;
        cursor:pointer;
        opacity:0;
        transition:all .2s ease;
       }

        .order-card:hover .remove-order{
        opacity:1;
        transform:translateY(-50%) scale(1);
        }


        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .user-info p {
          margin: 0;
        }

        .user-name {
          font-weight: bold;
          font-size: 16px;
        }

        .user-email {
          font-size: 13px;
          color: #777;
        }

        .order-date {
          font-size: 12px;
          color: #999;
        }

        .order-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .order-items ul {
          margin: 0;
          padding-left: 18px;
        }

        .order-items li {
          margin-bottom: 5px;
          font-size: 14px;
        }

        .text-red {
          color: #d9534f;
        }
      `}</style>
    </div>
  );
}
