import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import { CartContext } from "../../context/CartContext";
import { ToastContainer, toast } from "react-toastify";

export default function CakeDetails() {
  const { id } = useParams();
  const [cake, setCake] = useState(null);
  const [weight, setWeight] = useState("1kg");
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    api.get("/cakes").then((res) => {
      setCake(res.data.find((c) => c._id === id));
    });
  }, [id]);

  if (!cake) return null;

  // price calculation
  const calculatePrice = () => {
    if (weight === "500g") return cake.price / 2;
    if (weight === "2kg") return cake.price * 2;
    return cake.price;
  };

  const finalPrice = calculatePrice();

  const handleAddToCart = () => {
    addToCart({
      ...cake,
      price: finalPrice,
      selectedWeight: weight
    });

    toast.success("🎉 Cake added to cart!", {
      position: "top-right",
      autoClose: 2000,
      theme: "dark",
    });
  };

  return (
    <>
      <ToastContainer />

      <style>{`
        body { background: #0b0b0b; color: #fff; font-family: Poppins; }

        .details {
          max-width: 1100px;
          margin: 40px auto;
          padding: 0 20px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        .cake-img img {
          width: 100%;
          border-radius: 18px;
        }

        .cake-info h1 { font-size: 42px; }

        .price {
          font-size: 32px;
          font-weight: 700;
          margin: 20px 0;
        }

        .weight-select {
          margin: 20px 0;
        }

        .weight-select select {
          padding: 10px;
          border-radius: 8px;
          font-size: 16px;
        }

        .add-btn {
          padding: 16px 40px;
          width: 100%;
          background: orange;
          color: #000;
          border: none;
          border-radius: 40px;
          font-weight: 600;
          cursor: pointer;
        }

        @media(max-width:900px){
          .details { grid-template-columns: 1fr; }
        }
      `}</style>

      <section className="details">
        <div className="cake-img">
          <img
            src={`http://localhost:4000/${cake.image}`}
            alt={cake.name}
          />
        </div>

        <div className="cake-info">
          <h1>{cake.name}</h1>
          <p>{cake.description}</p>

          {/*  Weight Selector */}
          <div className="weight-select">
            <label>Select Weight: </label>
            <select
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            >
              <option value="500g">500g</option>
              <option value="1kg">1kg</option>
              <option value="2kg">2kg</option>
            </select>
          </div>

          <div className="price">₹{finalPrice}</div>

          <button className="add-btn" onClick={handleAddToCart}>
            Add to Cart 🛒
          </button>
        </div>
      </section>
    </>
  );
}

