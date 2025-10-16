import { useEffect, useState } from "react";

export default function AddExpenseModal({ open, onClose, onAdd }) {
  const [form, setForm] = useState({
    description: "",
    amount: "",
    category: "Utilities",
    notes: "",
  });
  useEffect(() => {
    if (open) {
      Promise.resolve().then(() => {
        setForm({
          description: "",
          amount: "",
          category: "Utilities",
          date: new Date().toISOString().split("T")[0],
        });
      });
    }
  }, [open]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.description.trim() || !form.amount || !form.category.trim()) {
      alert("Please fill in description, amount, and category.");
      return;
    }
    if (isNaN(parseFloat(form.amount)) || parseFloat(form.amount) <= 0) {
      alert("Please enter a valid amount (must be a positive number).");
      return;
    }

    onAdd(form);
    onClose();
  };

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 32,
          minWidth: 400,
          maxWidth: 480,
          width: "100%",
          boxShadow: "0 2px 16px #0002",
        }}
      >
        <h2 style={{ fontSize: 24, marginBottom: 8 }}>Add New Expense</h2>
        <div style={{ fontSize: 15, color: "#666", marginBottom: 18 }}>
          Record a new expense for the library
        </div>

        {/* --- Description Input --- */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 5, fontWeight: 500 }}>
            Description *
          </label>
          <input
            name="description"
            type="text"
            placeholder="Enter expense description"
            value={form.description}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "8px 12px",
              border: "1px solid #ccc",
              borderRadius: 6,
              fontSize: 16,
            }}
          />
        </div>

        {/* --- Amount and Category (Side-by-side) --- */}
        <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <label
              style={{ display: "block", marginBottom: 5, fontWeight: 500 }}
            >
              Amount (₹) *
            </label>
            <input
              name="amount"
              type="number"
              placeholder="Enter amount"
              value={form.amount}
              onChange={handleChange}
              required
              min="0.01"
              step="0.01"
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #ccc",
                borderRadius: 6,
                fontSize: 16,
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label
              style={{ display: "block", marginBottom: 5, fontWeight: 500 }}
            >
              Category *
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #ccc",
                borderRadius: 6,
                fontSize: 16,
                appearance: "none",
                background:
                  'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007BBF%22%20d%3D%22M287%2069.9a15.8%2015.8%200%200%200%20-22.9%200l-118%20118-118-118a15.8%2015.8%200%200%200%20-22.9%200%2015.8%2015.8%200%200%0a0%200%2022.9l129.4%20129.5c6.1%206.1%2015.8%206.1%2021.9%200L287%2092.8a15.8%2015.8%200%200%200%200-22.9z%22%2F%3E%3C%2Fsvg%3E") no-repeat right 8px center / 12px auto',
                backgroundSize: "12px",
              }}
            >
              <option value="Utilities">Utilities</option>
              <option value="Salaries">Salaries</option>
              <option value="Rent">Rent</option>
              <option value="Supplies">Supplies</option>
              <option value="Equipment & Furniture">
                Equipment & Furniture
              </option>
              <option value="Maintenance">Maintenance</option>
              <option value="Marketing">Marketing</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* --- Additional Notes Input --- */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", marginBottom: 5, fontWeight: 500 }}>
            Additional Notes (Optional)
          </label>
          <textarea
            name="notes"
            placeholder="Any additional details about this expense"
            value={form.notes}
            onChange={handleChange}
            rows="3"
            style={{
              width: "100%",
              padding: "8px 12px",
              border: "1px solid #ccc",
              borderRadius: 6,
              fontSize: 16,
              resize: "vertical",
            }}
          ></textarea>
        </div>

        {/* --- Buttons --- */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            marginTop: 8,
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "#e0e0e0",
              color: "#333",
              border: "none",
              padding: "8px 20px",
              borderRadius: 6,
              fontWeight: 500,
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{
              background: "#ef4444",
              color: "#fff",
              border: "none",
              padding: "8px 20px",
              borderRadius: 6,
              fontWeight: 500,
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            Add Expense
          </button>
        </div>
      </form>
    </div>
  );
}
