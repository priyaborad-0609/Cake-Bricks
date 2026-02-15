import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function Navbar() {
  const { cart } = useContext(CartContext);
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path ? "active-link" : "";

  return (
    <>
      <nav className="navbar">
        <div className="logo">Cakes Bricks</div>

        <div className="nav-links">
          <Link className={isActive("/user")} to="/user">
            Home
          </Link>

          <Link className={isActive("/user/cakes")} to="/user/cakes">
            Cakes
          </Link>

          <Link className={isActive("/user/orders")} to="/user/orders">
            My Orders
          </Link>

          <Link
            className={`cart-link ${isActive("/user/cart")}`}
            to="/user/cart"
          >
            Cart
            {cart.length > 0 && (
              <span className="cart-badge">{cart.length}</span>
            )}
          </Link>
        </div>
      </nav>

      <style>{`
        body {
          margin: 0;
          background: #FFF8F3;
          font-family: 'Poppins', sans-serif;
        }

        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 70px;
          background: #FFFFFF;
          border-bottom: 1px solid #FBCFE8;
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .logo {
          font-size: 28px;
          font-weight: 700;
          color: #BE185D;
          letter-spacing: 1px;
        }

        .nav-links {
          display: flex;
          gap: 40px;
          align-items: center;
        }

        .nav-links a {
          text-decoration: none;
          font-weight: 500;
          color: #1E293B;
          position: relative;
          padding-bottom: 5px;
          transition: 0.3s ease;
        }

        .nav-links a:hover {
          color: #DB2777;
        }

        .active-link {
          color: #BE185D;
          font-weight: 600;
        }

        .active-link::after {
          content: "";
          position: absolute;
          width: 100%;
          height: 2px;
          background: #BE185D;
          left: 0;
          bottom: -4px;
          border-radius: 10px;
        }

        .cart-link {
          position: relative;
        }

        .cart-badge {
          position: absolute;
          top: -10px;
          right: -15px;
          background: #F59E0B;
          color: white;
          font-size: 12px;
          padding: 4px 8px;
          border-radius: 50px;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .navbar {
            padding: 15px 25px;
          }

          .nav-links {
            gap: 20px;
          }

          .logo {
            font-size: 22px;
          }
        }
      `}</style>
    </>
  );
}
