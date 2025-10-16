import { useEffect, useState } from "react";

export default function AddPaymentModal({ open, onClose, onAdd }) {
  const [form, setForm] = useState({
    studentName: "",
    studentId: "",
    amount: "",
    paymentMethod: "Cash",
    description: "",
  });

  useEffect(() => {
    if (open && student) {
      // Use a microtask to defer state update
      Promise.resolve().then(() => {
        setForm((prev) => ({
          ...prev,
          name: student.name || "",
          email: student.email || "",
          phone: student.phone || "",
          emergency: student.emergency || "",
          paid: student.paid || "0.00",
          due: student.due || "0.00",
          status: student.status || "Active",
        }));
      });
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.studentName.trim() || !form.studentId.trim() || !form.amount) {
      alert("Please enter the Student Name, ID, and Amount.");
      return;
    }
    const amt = parseFloat(form.amount);
    if (isNaN(amt) || amt <= 0) {
      alert("Please enter a valid positive amount.");
      return;
    }

    onAdd({
      studentName: form.studentName.trim(),
      studentId: form.studentId.trim(),
      amount: amt,
      paymentMethod: form.paymentMethod,
      description: form.description.trim(),
    });

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
        <h2 style={{ fontSize: 24, marginBottom: 8 }}>Add New Payment</h2>
        <div style={{ fontSize: 15, color: "#666", marginBottom: 18 }}>
          Record a new payment from a student
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 5, fontWeight: 500 }}>
            Student Name *
          </label>
          <input
            name="studentName"
            type="text"
            placeholder="Enter student's full name"
            value={form.studentName}
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

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 5, fontWeight: 500 }}>
            Student ID *
          </label>
          <input
            name="studentId"
            type="text"
            placeholder="Enter student ID"
            value={form.studentId}
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

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 5, fontWeight: 500 }}>
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

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 5, fontWeight: 500 }}>
            Payment Method *
          </label>
          <select
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "8px 12px",
              border: "1px solid #ccc",
              borderRadius: 6,
              fontSize: 16,
            }}
          >
            <option value="Cash">Cash</option>
            <option value="Online">Online</option>
          </select>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", marginBottom: 5, fontWeight: 500 }}>
            Description (Optional)
          </label>
          <input
            name="description"
            type="text"
            placeholder="Payment description (optional)"
            value={form.description}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "8px 12px",
              border: "1px solid #ccc",
              borderRadius: 6,
              fontSize: 16,
            }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
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
              background: "#22c55e",
              color: "#fff",
              border: "none",
              padding: "8px 20px",
              borderRadius: 6,
              fontWeight: 500,
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            Add Payment
          </button>
        </div>
      </form>
    </div>
  );
}
