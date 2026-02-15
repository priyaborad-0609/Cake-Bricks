import { useEffect, useState } from "react";
import api from "../../services/api";

const CATEGORIES = ["Birthday", "Wedding", "Anniversary", "Custom"];

export default function AdminCakes() {
  const [cakes, setCakes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    egg: false,
    description: "",
    image: null,
  });

  const loadCakes = async () => {
    try {
      const res = await api.get("/cakes");
      setCakes(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load cakes");
    }
  };

  useEffect(() => {
    loadCakes();
  }, []);

  const submit = async () => {
    try {
      setError("");
      setSuccess("");
      setLoading(true);

      if (!form.name || !form.price || !form.category || !form.description) {
        setError("Please fill all required fields");
        setLoading(false);
        return;
      }

      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== null) fd.append(k, v);
      });

      if (editingId) {
        await api.put(`/cakes/${editingId}`, fd);
        setSuccess("🎂 Cake updated successfully");
      } else {
        if (!form.image) {
          setError("Cake image is required");
          setLoading(false);
          return;
        }
        await api.post("/cakes", fd);
        setSuccess("🎂 Cake added successfully");
      }

      setEditingId(null);
      setForm({
        name: "",
        price: "",
        stock: "",
        category: "",
        egg: false,
        description: "",
        image: null,
      });

      loadCakes();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const editCake = (cake) => {
    setForm({
      name: cake.name,
      price: cake.price,
      stock: cake.stock,
      category: cake.category,
      egg: cake.egg,
      description: cake.description,
      image: null,
    });
    setEditingId(cake._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteCake = async (id) => {
    if (!window.confirm("Delete this cake?")) return;

    try {
      await api.delete(`/cakes/${id}`);
      setSuccess("Cake deleted successfully");
      loadCakes();
    } catch (err) {
      setError("Delete failed");
    }
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>🎂 Cake Management</h2>

      {error && <div style={styles.error}>{error}</div>}
      {success && <div style={styles.success}>{success}</div>}

      {/* FORM */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>
          {editingId ? "✏️ Edit Cake" : "➕ Add New Cake"}
        </h3>

        <div style={styles.formGrid}>
          <input
            style={styles.input}
            placeholder="Cake Name *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            style={styles.input}
            type="number"
            placeholder="Price ₹ *"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <input
            style={styles.input}
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />
          <select
            style={styles.input}
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="">Select Category *</option>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <textarea
            style={{ ...styles.input, gridColumn: "1 / -1" }}
            rows="3"
            placeholder="Description *"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <label style={styles.checkbox}>
            <input
              type="checkbox"
              checked={form.egg}
              onChange={(e) => setForm({ ...form, egg: e.target.checked })}
            />
            Eggless
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
          />
        </div>

        <button style={styles.button} onClick={submit} disabled={loading}>
          {loading
            ? editingId
              ? "Updating..."
              : "Adding..."
            : editingId
            ? "Update Cake"
            : "Add Cake"}
        </button>
      </div>

      {/* LIST */}
      <h3 style={styles.subtitle}>📋 All Cakes</h3>

      <div style={styles.list}>
        {cakes.map((c) => (
          <div key={c._id} style={styles.row}>
            <div style={styles.leftSection}>
              <img
                src={`http://localhost:4000/${c.image}`}
                alt={c.name}
                style={styles.image}
              />
              <div>
                <div style={styles.name}>{c.name}</div>
                <div style={styles.meta}>
                  ₹{c.price} • Stock: {c.stock} • {c.category}
                </div>
              </div>
            </div>

            <div style={styles.actions}>
              <button
                style={styles.editBtn}
                onClick={() => editCake(c)}
              >
                Edit
              </button>
              <button
                style={styles.deleteBtn}
                onClick={() => deleteCake(c._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* STYLES */
const styles = {
  page: {
    background: "#f7f8fa",
    minHeight: "100vh",
    padding: "32px",
    fontFamily: "Segoe UI, sans-serif",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "24px",
  },
  subtitle: {
    fontSize: "20px",
    margin: "32px 0 16px",
  },
  card: {
    background: "#ffffff",
    borderRadius: "14px",
    padding: "24px",
    boxShadow: "0 12px 28px rgba(0,0,0,0.08)",
  },
  cardTitle: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "16px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    marginBottom: "16px",
  },
  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    width: "100%",
  },
  checkbox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  button: {
    marginTop: "16px",
    background: "#3b82f6",
    color: "#fff",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#ffffff",
    padding: "16px 20px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
  },
  leftSection: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
  },
  image: {
    width: "90px",
    height: "90px",
    objectFit: "cover",
    borderRadius: "10px",
  },
  name: {
    fontWeight: "600",
    fontSize: "16px",
  },
  meta: {
    fontSize: "14px",
    color: "#6b7280",
    marginTop: "4px",
  },
  actions: {
    display: "flex",
    gap: "10px",
  },
  editBtn: {
    background: "#f59e0b",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  deleteBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "14px",
  },
  success: {
    background: "#dcfce7",
    color: "#166534",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "14px",
  },
};
