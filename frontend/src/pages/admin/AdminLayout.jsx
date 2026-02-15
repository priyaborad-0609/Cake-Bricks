import { Outlet, NavLink } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      {/* ================= SIDEBAR ================= */}
      <aside className="admin-sidebar">
        <div className="sidebar-top">
          <div className="sidebar-header">
            <div className="logo-box">🎂</div>
            <h2>Cake Bricks</h2>
          </div>

          <nav className="nav-links">
            <NavLink to="/admin" end>
              📊 Dashboard
            </NavLink>

            <NavLink to="/admin/cakes">
              🎂 Cakes
            </NavLink>

            <NavLink to="/admin/orders">
              📦 Orders
            </NavLink>

            <NavLink to="/admin/users">
              👥 Users
            </NavLink>
          </nav>
        </div>

        <div className="sidebar-footer">
          © 2026 Cake Bricks
        </div>
      </aside>

      {/* ================= MAIN AREA ================= */}
      <div className="admin-main">
        <header className="admin-header">
          <h1>Admin Dashboard</h1>

          <div className="profile">
            <div className="avatar">A</div>
            <span>Admin</span>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>

      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: "Inter", sans-serif;
          background: #f1f5f9;
        }

        .admin-layout {
          display: flex;
          min-height: 100vh;
        }

        /* ================= SIDEBAR ================= */

        .admin-sidebar {
          width: 260px;
          background: linear-gradient(180deg, #0f172a, #1e293b);
          color: #fff;
          padding: 35px 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: 6px 0 40px rgba(0,0,0,0.25);
        }

        .sidebar-top {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-box {
          width: 42px;
          height: 42px;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .sidebar-header h2 {
          font-size: 20px;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .nav-links {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .admin-sidebar a {
          text-decoration: none;
          color: #cbd5e1;
          padding: 12px 16px;
          border-radius: 10px;
          font-weight: 500;
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .admin-sidebar a:hover {
          background: rgba(255,255,255,0.08);
          transform: translateX(5px);
        }

        .admin-sidebar a.active {
          background: linear-gradient(90deg, #3b82f6, #2563eb);
          color: white;
          box-shadow: 0 6px 18px rgba(59,130,246,0.45);
        }

        .sidebar-footer {
          font-size: 12px;
          color: #64748b;
          text-align: center;
        }

        /* ================= MAIN ================= */

        .admin-main {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .admin-header {
          background: white;
          padding: 22px 35px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e2e8f0;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        }

        .admin-header h1 {
          font-size: 20px;
          font-weight: 600;
          color: #111827;
        }

        .profile {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }

        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
        }

        .admin-content {
          flex: 1;
          padding: 40px;
          overflow-y: auto;
        }

        /* ================= RESPONSIVE ================= */

        @media (max-width: 900px) {
          .admin-sidebar {
            width: 220px;
          }
        }

        @media (max-width: 768px) {
          .admin-layout {
            flex-direction: column;
          }

          .admin-sidebar {
            width: 100%;
            flex-direction: row;
            overflow-x: auto;
            padding: 15px;
          }

          .nav-links {
            flex-direction: row;
          }
        }
      `}</style>
    </div>
  );
}
