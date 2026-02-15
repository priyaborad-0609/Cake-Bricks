import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/me");
      setOrders(res.data);
      setLoading(false);
    } catch (error) {
      console.error("FETCH ERROR:", error);
      setLoading(false);
    }
  };

  const cancelOrder = async (id) => {
    try {
      await api.put(`/orders/cancel/${id}`);

      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, status: "Cancelled" } : order
        )
      );
    } catch (error) {
      alert(error.response?.data?.message || "Error cancelling order");
    }
  };

  const removeOrder = (id) => {
    setOrders((prev) => prev.filter((order) => order._id !== id));
  };

  if (loading) {
    return <h2 style={{ textAlign: "center", color: "#fff" }}>Loading...</h2>;
  }

  if (!orders.length) {
    return <h2 style={{ textAlign: "center", color: "#fff" }}>No Orders</h2>;
  }

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", color: "#ffffff" }}>
      <h2 style={{color:"black"}}>My Orders</h2>

      {orders.map((order) => (
        <div
          key={order._id}
          className="order-card"
          style={{
            position: "relative",
            background: "#1f2937",
            padding: "20px 20px 20px 40px", 
            marginBottom: "20px",
            borderRadius: "10px",
            transition: "0.3s",
          }}
        >
          {/* Remove button left side, hidden by default */}
          <span
            className="remove-order"
            onClick={() => removeOrder(order._id)}
            title="Remove Order"
          >
            ⤫
          </span>

          <p><b>Order ID:</b> {order._id.slice(-6)}</p>

          {/* STATUS ROW */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              margin: "10px 0 15px 0",
            }}
          >
            <b>Status:</b>
            <span
              style={{
                padding: "4px 12px",
                borderRadius: "20px",
                fontSize: "13px",
                fontWeight: "600",
                background:
                  order.status === "Delivered"
                    ? "#16a34a"
                    : order.status === "Cancelled"
                    ? "#dc2626"
                    : order.status === "Shipped"
                    ? "#2563eb"
                    : "#f59e0b",
                color: "#fff",
              }}
            >
              {order.status}
            </span>
          </div>

          {/* ITEMS */}
          {order.items.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <img
                src={`http://localhost:4000/${item.cake?.image}`}
                alt={item.name}
                style={{
                  width: "70px",
                  height: "70px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginRight: "15px",
                }}
              />

              <div>
                <p>{item.name}</p>
                <p>Qty: {item.quantity}</p>
                <p>₹{item.price * item.quantity}</p>
              </div>
            </div>
          ))}

          <p><b>Total:</b> ₹{order.totalAmount}</p>
          <p><b>Address:</b> {order.address}</p>

          {/* CANCEL BUTTON */}
          {(order.status === "Pending" || order.status === "Processing") && (
            <div style={{ marginTop: "15px" }}>
              <button
                onClick={() => cancelOrder(order._id)}
                style={{
                  background: "#dc2626",
                  color: "#fff",
                  padding: "6px 14px",
                  border: "none",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "500",
                  display: "inline-block",
                  width: "auto",
                }}
              >
                Cancel Order
              </button>
            </div>
          )}
        </div>
      ))}

      {/* ===== CSS ===== */}
      <style>{`
        .order-card .remove-order {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 18px;
          font-weight: bold;
          color: #fff;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .order-card:hover .remove-order {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
