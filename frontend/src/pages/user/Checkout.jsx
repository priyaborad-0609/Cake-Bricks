import { useContext, useState } from "react";
import { CartContext } from "../../context/CartContext";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = total * 0.05;
  const finalTotal = total + tax;

  const placeOrder = async () => {
    if (!address.trim()) {
      toast.error("Please enter delivery address");
      return;
    }

    setLoading(true);

    try {
      await api.post("/orders", {
        items: cart,
        totalAmount: finalTotal,
        address,
      });

      toast.success("Order Placed Successfully!");

      setTimeout(() => {
        clearCart();
        navigate("/user/orders");
      }, 1500);

    } catch (err) {
      toast.error("Order failed. Try again.");
      setLoading(false);
    }
  };

  if (!loading && cart.length === 0) {
    return (
      <>
        <ToastContainer position="top-right" autoClose={2000} />
        <style>{styles}</style>
        <div className="empty-checkout">
          <h2>Your Cart is Empty 😕</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />

      <style>{styles}</style>

      <div className="checkout-page">
        <h2 className="checkout-title">Secure Checkout</h2>

        <div className="checkout-container">
          {/* LEFT SIDE */}
          <div className="checkout-form">
            <h3>Delivery Address</h3>

            <textarea
              placeholder="Enter full delivery address..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <button
              className="place-btn"
              onClick={placeOrder}
              disabled={loading}
            >
              {loading ? "Placing Order..." : "Place Order (Cash on Delivery)"}
            </button>
          </div>

          {/* RIGHT SIDE */}
          <div className="checkout-summary">
            <h3>Order Summary</h3>

            {cart.map((item) => (
              <div key={item._id} className="summary-item">
                <span>
                  {item.name}{" "}
                  {item.selectedWeight && `(${item.selectedWeight})`} × {item.qty}
                </span>
                <span>₹{item.price * item.qty}</span>
              </div>
            ))}

            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{total}</span>
            </div>

            <div className="summary-row">
              <span>Tax (5%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>

            <div className="summary-total">
              <span>Total</span>
              <span>₹{finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


/* ================= CSS ================= */

const styles = `
.checkout-page {
  max-width: 1100px;
  margin: 40px auto;
  padding: 0 20px;
  color: #ffffff;
}

.checkout-title {
  font-size: 30px;
  margin-bottom: 30px;
  color: black;
}

.checkout-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
}

/* LEFT */
.checkout-form {
  background: #111827;
  padding: 25px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.4);
}

.checkout-form h3 {
  margin-bottom: 20px;
}

.checkout-form textarea {
  width: 100%;
  height: 120px;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #334155;
  background: #0f172a;
  color: white;
  resize: none;
  margin-bottom: 20px;
}

.place-btn {
  width: 100%;
  padding: 14px;
  background: #22c55e;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}

.place-btn:hover {
  background: #16a34a;
}

.place-btn:disabled {
  background: gray;
  cursor: not-allowed;
}

/* RIGHT */
.checkout-summary {
  background: #111827;
  padding: 25px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.4);
}

.checkout-summary h3 {
  margin-bottom: 20px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  margin-bottom: 8px;
  opacity: 0.9;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  opacity: 0.8;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  font-size: 18px;
  border-top: 1px solid #334155;
  margin-top: 15px;
  padding-top: 10px;
}

/* EMPTY */
.empty-checkout {
  text-align: center;
  margin-top: 150px;
  color: #fff;
}

@media (max-width: 900px) {
  .checkout-container {
    grid-template-columns: 1fr;
  }
}
`;

