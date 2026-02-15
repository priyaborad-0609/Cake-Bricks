import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { Link } from "react-router-dom";

export default function Cart() {
  const { cart, updateQty, removeItem, clearCart } = useContext(CartContext);

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleRemove = (id) => {
    if (window.confirm("Are you sure you want to remove this item?")) {
      removeItem(id);
    }
  };

  if (cart.length === 0) {
    return (
      <>
        <style>{styles}</style>
        <div className="empty-cart">
          <h2>Your Cart is Empty 😢</h2>
          <p>Add some delicious cakes to get started!</p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="cart-page">
        <h2 className="cart-title">Your Cart</h2>

        <div className="cart-container">

          {/* Cart Items */}
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item._id} className="cart-card">
                <img
                  src={`http://localhost:4000/${item.image}`}
                  alt={item.name}
                  className="cart-img"
                />

                <div className="cart-info">
                  <h3>
                    {item.name} {item.selectedWeight && `(${item.selectedWeight})`}
                  </h3>

                  <p className="price">₹{item.price}</p>

                  <div className="qty-controls">
                    <button
                      onClick={() => updateQty(item._id, item.qty - 1)}
                      disabled={item.qty <= 1}
                    >
                      -
                    </button>

                    <span>{item.qty}</span>

                    <button
                      onClick={() => updateQty(item._id, item.qty + 1)}
                    >
                      +
                    </button>

                    <button
                      className="remove-btn"
                      onClick={() => handleRemove(item._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="item-total">
                  ₹{item.price * item.qty}
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="summary">
            <h3>Order Summary</h3>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{total}</span>
            </div>

            <div className="summary-row">
              <span>Tax (5%)</span>
              <span>₹{(total * 0.05).toFixed(2)}</span>
            </div>

            <div className="summary-row total">
              <span>Total</span>
              <span>₹{(total * 1.05).toFixed(2)}</span>
            </div>

            <Link to="/user/checkout" className="checkout-btn">
              Proceed to Checkout
            </Link>

            <button onClick={clearCart} className="clear-btn">
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

const styles = `
.cart-page {
  max-width: 1100px;
  margin: 40px auto;
  padding: 0 20px;
  font-family: 'Poppins', sans-serif;
}

.cart-title {
  font-size: 32px;
  margin-bottom: 30px;
}

.cart-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
}

.cart-card {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 20px;
  border-radius: 14px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.08);
  margin-bottom: 20px;
  transition: 0.3s;
}

.cart-card:hover {
  box-shadow: 0 12px 30px rgba(0,0,0,0.15);
}

.cart-img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 12px;
  margin-right: 20px;
}

.cart-info h3 {
  margin: 0;
  font-size: 20px;
}

.price {
  margin: 5px 0 10px;
  color: #555;
}

.qty-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.qty-controls button {
  padding: 6px 12px;
  border: 1px solid #ddd;
  background: #f7f7f7;
  cursor: pointer;
  border-radius: 6px;
}

.qty-controls span {
  padding: 6px 14px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.remove-btn {
  background: none;
  border: none;
  color: red;
  font-weight: 600;
  cursor: pointer;
  margin-left: 10px;
}

.item-total {
  margin-left: auto;
  font-weight: 600;
  font-size: 18px;
}

.summary {
  background: #fff;
  padding: 25px;
  border-radius: 14px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.08);
  height: fit-content;
}

.summary h3 {
  margin-bottom: 20px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.total {
  font-weight: 700;
  font-size: 18px;
  border-top: 1px solid #eee;
  padding-top: 10px;
}

.checkout-btn {
  display: block;
  text-align: center;
  background: #28a745;
  color: #fff;
  padding: 12px;
  border-radius: 8px;
  margin-top: 20px;
  text-decoration: none;
  font-weight: 600;
}

.clear-btn {
  width: 100%;
  margin-top: 10px;
  padding: 12px;
  background: #dc3545;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.empty-cart {
  text-align: center;
  margin-top: 100px;
}

.browse-btn {
  display: inline-block;
  margin-top: 20px;
  padding: 12px 25px;
  background: #ff4d6d;
  color: white;
  text-decoration: none;
  border-radius: 8px;
}
`;
