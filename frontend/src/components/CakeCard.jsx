import { Link } from "react-router-dom";

export default function CakeCard({ cake, addToCart }) {
  return (
    <div className="card">
      <img src={`http://localhost:4000/${cake.image}`} />
      <h3>{cake.name}</h3>
      <p>₹{cake.price}</p>
      <button onClick={() => addToCart(cake)}>Add to Cart</button>
      <Link to={`/user/cakes/${cake._id}`}>View</Link>
    </div>
  );
}
