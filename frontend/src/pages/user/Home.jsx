import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const cakes = [
  {
    name: "Red Velvet Cake",
    img: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Black Forest Cake",
    img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Coffee Mocha Cake",
    img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Vanilla Fruit Cake",
    img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Cream Pastry",
    img: "https://images.unsplash.com/photo-1559620192-032c4bc4674e?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Caramel Drip Cake",
    img: "https://images.unsplash.com/photo-1622467827417-bbe2237067a9?auto=format&fit=crop&w=800&q=80",
  },
];

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background: #0b0b0b;
          font-family: 'Poppins', sans-serif;
          color: #fff;
        }

        /* HERO */
        .hero {
          height: 90vh;
          background:
            linear-gradient(rgba(0,0,0,.65), rgba(0,0,0,.65)),
            url("https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=1400")
            center/cover no-repeat;
          display: flex;
          align-items: center;
          padding-left: 80px;
        }

        .hero h1 {
          font-size: 64px;
          margin-bottom: 10px;
        }

        .hero p {
          font-size: 18px;
          opacity: 0.85;
          margin-bottom: 25px;
          max-width: 450px;
        }

        .hero button {
          padding: 14px 38px;
          background: orange;
          border: none;
          border-radius: 30px;
          font-size: 16px;
          cursor: pointer;
          font-weight: 600;
        }

        /* BEST SELLERS */
        .scroll-section {
          padding: 70px 40px;
        }

        .scroll-section h2 {
          font-size: 34px;
          margin-bottom: 25px;
        }

        .scroll-wrapper {
          overflow: hidden;
        }

        .scroll-track {
          display: flex;
          gap: 20px;
          width: max-content;
          animation: scroll 30s linear infinite;
        }

        .scroll-wrapper:hover .scroll-track {
          animation-play-state: paused;
        }

        .cake-card {
          width: 260px;
          background: #111;
          border-radius: 18px;
          overflow: hidden;
          flex-shrink: 0;
          transition: transform 0.4s ease, box-shadow 0.4s ease;
        }

        .cake-card:hover {
          transform: scale(1.08);
          box-shadow: 0 0 25px rgba(255,165,0,0.45);
        }

        .cake-card img {
          width: 100%;
          height: 180px;
          object-fit: cover;
        }

        .cake-card h4 {
          padding: 12px;
          text-align: center;
        }

        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        /* WHY CHOOSE */
        .why {
          padding: 80px 40px;
          background: #111;
        }

        .why h2 {
          font-size: 34px;
          text-align: center;
          margin-bottom: 50px;
        }

        .why-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          max-width: 1100px;
          margin: auto;
        }

        .why-card {
          background: #0b0b0b;
          border-radius: 20px;
          padding: 30px;
          text-align: center;
          transition: 0.3s ease;
        }

        .why-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 0 20px rgba(255,165,0,0.3);
        }

        .why-card h3 {
          color: orange;
        }

        /* REVIEWS */
        .reviews {
          padding: 80px 40px;
          text-align: center;
        }

        .review-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          margin-top: 40px;
        }

        .review-card {
          background: #111;
          padding: 30px;
          border-radius: 20px;
        }

        .review-card h4 {
          margin-top: 15px;
          color: orange;
        }

        /* CTA */
        .cta {
          padding: 70px 40px;
          text-align: center;
          background:
            linear-gradient(rgba(0,0,0,.7), rgba(0,0,0,.7)),
            url("https://images.unsplash.com/photo-1557308536-ee471ef2c390?q=80&w=1400")
            center/cover no-repeat;
        }

        .cta h2 {
          font-size: 40px;
          margin-bottom: 15px;
        }

        .cta p {
          opacity: 0.85;
        }

        /* FOOTER */
        .footer {
          background: #111;
          padding: 60px 40px;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 40px;
          max-width: 1200px;
          margin: auto;
        }

        .footer h3 {
          color: orange;
          margin-bottom: 15px;
        }

        .footer p,
        .footer a {
          font-size: 14px;
          opacity: 0.8;
          color: #fff;
          text-decoration: none;
          display: block;
          margin-bottom: 8px;
        }

        .footer a:hover {
          color: orange;
        }

        .footer-bottom {
          text-align: center;
          margin-top: 40px;
          font-size: 14px;
          opacity: 0.6;
        }
      `}</style>

      {/* HERO */}
      <section className="hero">
        <div>
          <h1>Cakes Bricks</h1>
          <p>Premium handcrafted cakes baked fresh every day for your special moments.</p>
          <button onClick={() => navigate("/user/cakes")}>Order Now</button>
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="scroll-section">
        <h2>Best Sellers</h2>
        <div className="scroll-wrapper">
          <div className="scroll-track">
            {[...cakes, ...cakes].map((cake, i) => (
              <div className="cake-card" key={i}>
                <img src={cake.img} alt={cake.name} />
                <h4>{cake.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="why">
        <h2>Why Choose Cakes Bricks</h2>
        <div className="why-grid">
          <div className="why-card">
            <h3>Freshly Baked</h3>
            <p>Every cake is baked on order using premium ingredients and zero preservatives.</p>
          </div>
          <div className="why-card">
            <h3>On-Time Delivery</h3>
            <p>We respect your moments and ensure timely delivery without compromise.</p>
          </div>
          <div className="why-card">
            <h3>Trusted by 5,000+ Customers</h3>
            <p>Loved for taste, quality and consistent service across all orders.</p>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="reviews">
        <h2>What Our Customers Say</h2>
        <div className="review-grid">
          <div className="review-card">
            <p>"Absolutely delicious! Best chocolate cake I've ever had."</p>
            <h4>– Priya S.</h4>
          </div>
          <div className="review-card">
            <p>"Delivery was super fast and cake was fresh."</p>
            <h4>– Rahul M.</h4>
          </div>
          <div className="review-card">
            <p>"Highly recommend for birthdays and special occasions."</p>
            <h4>– Ananya K.</h4>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Make Every Celebration Sweeter</h2>
        <p>Order delicious cakes for birthdays, weddings & special occasions</p>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-grid">
          <div>
            <h3>Cakes Bricks</h3>
            <p>Premium handcrafted cakes baked fresh daily for your celebrations.</p>
          </div>

          <div>
            <h3>Quick Links</h3>
            <a href="#">Home</a>
            <a href="#">Cakes</a>
            <a href="#">Orders</a>
            <a href="#">Contact</a>
          </div>

          <div>
            <h3>Contact</h3>
            <p>Email: support@cakesbricks.com</p>
            <p>Phone: +91 98765 43210</p>
            <p>Mumbai, India</p>
          </div>

          <div>
            <h3>Follow Us</h3>
            <p>Instagram</p>
            <p>Facebook</p>
            <p>Twitter</p>
          </div>
        </div>

        <div className="footer-bottom">
          © 2026 Cakes Bricks. All Rights Reserved.
        </div>
      </footer>
    </>
  );
}
