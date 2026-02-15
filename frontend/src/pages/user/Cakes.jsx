import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Cakes() {
  const [cakes, setCakes] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const cakesPerPage = 8;

  useEffect(() => {
    api.get("/cakes")
      .then((res) => {
        setCakes(res.data);
      })
      .catch(() => toast.error("Failed to load cakes"));
  }, []);

  // Filter + Sort
  const filteredCakes = useMemo(() => {
    let filtered = cakes.filter((cake) =>
      `${cake.name} ${cake.description} ${cake.price}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    if (sortOrder === "low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "high") {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [cakes, search, sortOrder]);

  // Pagination
  const indexOfLast = currentPage * cakesPerPage;
  const indexOfFirst = indexOfLast - cakesPerPage;
  const currentCakes = filteredCakes.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredCakes.length / cakesPerPage);

  return (
    <>
      <style>{`
        body {
          background: #0b0b0b;
          color: #fff;
          font-family: 'Poppins', sans-serif;
        }

        .container {
          padding: 60px 80px;
        }

        .hero {
          text-align: center;
          margin-bottom: 50px;
        }

        .hero h1 {
          font-size: 44px;
          margin-bottom: 10px;
        }

        .hero p {
          opacity: 0.6;
          font-size: 15px;
        }

        .filters {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 15px;
          margin-bottom: 40px;
        }

        .search {
          flex: 1;
          min-width: 250px;
          padding: 12px 18px;
          border-radius: 30px;
          border: none;
          outline: none;
        }

        .select {
          padding: 12px 18px;
          border-radius: 30px;
          border: none;
          cursor: pointer;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 25px;
        }

        @media (max-width: 1100px) {
          .grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 800px) {
          .grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 500px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }

        .cake-card {
          background: #111;
          border-radius: 20px;
          overflow: hidden;
          transition: 0.3s ease;
        }

        .cake-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 0 30px rgba(255,165,0,0.4);
        }

        .cake-card img {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }

        .cake-content {
          padding: 15px;
        }

        .cake-content h3 {
          font-size: 18px;
          margin-bottom: 5px;
        }

        .price {
          margin-bottom: 6px;
          font-weight: bold;
        }

        .rating {
          color: gold;
          margin-bottom: 10px;
        }

        .view-btn {
          padding: 8px 18px;
          background: orange;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
        }

        .pagination {
          margin-top: 40px;
          display: flex;
          justify-content: center;
          gap: 8px;
        }

        .page-btn {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          border: none;
          background: #1a1a1a;
          color: white;
          cursor: pointer;
        }

        .page-btn.active {
          background: orange;
          color: black;
        }
      `}</style>

      <div className="container">
        {/* HERO */}
        <div className="hero">
          <h1>Discover Our Signature Cakes 🎂</h1>
          <p>Freshly baked happiness for every celebration</p>
        </div>

        {/* SEARCH + SORT */}
        <div className="filters">
          <input
            type="text"
            placeholder="Search cakes..."
            className="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />

          <select
            className="select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="">Sort By Price</option>
            <option value="low">Low → High</option>
            <option value="high">High → Low</option>
          </select>
        </div>

        {/* GRID */}
        <div className="grid">
          {currentCakes.map((cake) => (
            <div key={cake._id} className="cake-card">
              <img
                src={`http://localhost:4000/${cake.image}`}
                alt={cake.name}
              />
              <div className="cake-content">
                <h3>{cake.name}</h3>
                <div className="price">₹{cake.price}</div>
                <div className="rating">⭐⭐⭐⭐☆</div>

                <button
                  className="view-btn"
                  onClick={() => {
                    navigate(`/user/cakes/${cake._id}`);
                  }}
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="pagination">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`page-btn ${currentPage === i + 1 ? "active" : ""}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
