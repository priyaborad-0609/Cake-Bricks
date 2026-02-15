import { useEffect, useState, useMemo } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);

  const usersPerPage = 5;

  // Load Users
  const loadUsers = async () => {
    try {
      const res = await api.get("/admin/users");

      if (res.data?.success) {
        setUsers(res.data.users);
      } else {
        toast.error("Failed to fetch users");
      }
    } catch (err) {
      toast.error("Server error while loading users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Search Filter
  const filteredUsers = useMemo(() => {
    return users.filter((u) =>
      `${u.name} ${u.email} ${u.role}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [users, search]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  // Confirm Block/Unblock
  const confirmToggle = async () => {
    if (!selectedUser) return;

    try {
      const res = await api.put(
        `/admin/users/${selectedUser._id}/block`
      );

      if (res.data?.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === selectedUser._id
              ? { ...u, blocked: !u.blocked }
              : u
          )
        );

        toast.success(
          selectedUser.blocked
            ? "User Unblocked Successfully"
            : "User Blocked Successfully"
        );
      }
    } catch (err) {
      toast.error("Failed to update user");
    } finally {
      setSelectedUser(null);
    }
  };

  return (
    <div className="container">
      <div className="card">

        {/* Header */}
        <div className="header">
          <h2>👥 Users Management</h2>
          <input
            type="text"
            placeholder="Search by name, email, role..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {loading ? (
          <p className="loading">Loading users...</p>
        ) : (
          <>
            {/* Table */}
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  <AnimatePresence>
                    {paginatedUsers.map((user) => (
                      <motion.tr
                        key={user._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td className={user.blocked ? "blocked" : "active"}>
                          {user.blocked ? "Blocked" : "Active"}
                        </td>
                        <td>
                          {user.role !== "ADMIN" && (
                            <button
                              onClick={() => setSelectedUser(user)}
                              className={user.blocked ? "unblock" : "block"}
                            >
                              {user.blocked ? "Unblock" : "Block"}
                            </button>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={currentPage === i + 1 ? "active-page" : ""}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Confirm Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div className="modal-backdrop">
            <motion.div className="modal">
              <h3>Confirm Action</h3>
              <p>
                Are you sure you want to{" "}
                {selectedUser.blocked ? "unblock" : "block"}{" "}
                <strong>{selectedUser.name}</strong>?
              </p>
              <div className="modal-buttons">
                <button onClick={() => setSelectedUser(null)}>Cancel</button>
                <button onClick={confirmToggle}>Confirm</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS */}
      <style>{`
        .container {
          min-height: 100vh;
          padding: 32px;
          background: linear-gradient(to bottom right, #f0f0f0, #e0e0e0);
          font-family: Arial, sans-serif;
        }
        .card {
          max-width: 1000px;
          margin: auto;
          background: white;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .header h2 {
          font-size: 28px;
          font-weight: bold;
          color: #333;
        }
        .header input {
          padding: 8px 16px;
          border-radius: 8px;
          border: 1px solid #ccc;
          outline: none;
          font-size: 14px;
        }
        .header input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59,130,246,0.3);
        }
        .loading {
          text-align: center;
          font-size: 16px;
        }
        .table-wrapper {
          overflow-x: auto;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          padding: 12px 16px;
          text-align: left;
        }
        thead tr {
          background: #f3f3f3;
        }
        tbody tr {
          border-bottom: 1px solid #eee;
          transition: background 0.2s;
        }
        tbody tr:hover {
          background: #f9f9f9;
        }
        .active {
          color: green;
          font-weight: bold;
        }
        .blocked {
          color: red;
          font-weight: bold;
        }
        button.block {
          background: red;
          color: white;
          padding: 6px 12px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }
        button.block:hover {
          background: darkred;
        }
        button.unblock {
          background: green;
          color: white;
          padding: 6px 12px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }
        button.unblock:hover {
          background: darkgreen;
        }
        .pagination {
          display: flex;
          justify-content: center;
          margin-top: 24px;
          gap: 8px;
        }
        .pagination button {
          padding: 6px 12px;
          border-radius: 6px;
          border: 1px solid #ccc;
          background: #f0f0f0;
          cursor: pointer;
        }
        .pagination .active-page {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }
        /* Modal */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .modal {
          background: white;
          padding: 24px;
          border-radius: 16px;
          width: 400px;
          max-width: 90%;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          text-align: center;
        }
        .modal h3 {
          margin-bottom: 16px;
        }
        .modal p {
          margin-bottom: 24px;
        }
        .modal-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }
        .modal-buttons button {
          padding: 6px 12px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
        }
        .modal-buttons button:first-child {
          background: #ccc;
          color: #333;
        }
        .modal-buttons button:last-child {
          background: #3b82f6;
          color: white;
        }
      `}</style>
    </div>
  );
}
