import { useEffect, useState } from "react";

// Input Component
const Input = ({
  label,
  name,
  type = "text",
  required = false,
  form,
  handleChange,
  handleBlur,
}) => (
  <div style={{ flex: "1 1 45%", marginBottom: 15, position: "relative" }}>
    <label
      htmlFor={name}
      style={{
        position: "absolute",
        top: -10,
        left: 10,
        background: "white",
        padding: "0 5px",
        fontSize: 12,
        color: "#555",
      }}
    >
      {label} {required && "*"}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={form[name]}
      onChange={handleChange}
      onBlur={handleBlur}
      required={required}
      inputMode={["paid", "due"].includes(name) ? "text" : undefined}
      autoComplete="off"
      style={{
        width: "100%",
        padding: "12px 15px",
        borderRadius: 8,
        border: "1px solid #ccc",
        fontSize: 16,
        boxSizing: "border-box",
        marginTop: 10,
      }}
    />
  </div>
);

export default function EditStudentModal({ open, onClose, student, onUpdate }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    emergency: "",
    paid: "0.00",
    due: "0.00",
    status: "Active",
  });

  useEffect(() => {
    if (open && student) {
      // Defer setForm to next tick — avoids ESLint cascading render warning
      Promise.resolve().then(() => {
        setForm((prev) => {
          const balance = Number(student.balance) || 0;

          const newForm = {
            name: student.full_name || "",
            email: student.email || "",
            phone: student.phone || "",
            emergency: student.emergency_contact || "",
            paid: balance >= 0 ? balance.toFixed(2) : "0.00",
            due: balance < 0 ? Math.abs(balance).toFixed(2) : "0.00",
            status: student.status || "Active",
          };

          const isSame = JSON.stringify(prev) === JSON.stringify(newForm);
          return isSame ? prev : newForm;
        });
      });
    }
  }, [open, student]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (
      (name === "paid" || name === "due") &&
      !/^\d*\.?\d*$/.test(value) &&
      value !== ""
    ) {
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === "paid" || name === "due") {
      let num = parseFloat(value);
      if (isNaN(num) || num < 0) num = 0;
      setForm((prev) => ({ ...prev, [name]: num.toFixed(2) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      alert("Name and Email are required.");
      return;
    }

    const paid = parseFloat(form.paid) || 0;
    const due = parseFloat(form.due) || 0;
    const netBalance = paid - due;

    const updatedData = {
      full_name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      emergency_contact: form.emergency.trim(),
      balance: netBalance,
      due_amount: due,
      status: form.status,
    };

    await onUpdate(student.id, updatedData);
  };

  if (!open || !student) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 32,
          maxWidth: 600,
          width: "90%",
          boxShadow: "0 2px 16px #0002",
          position: "relative",
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: "absolute",
            top: 15,
            right: 15,
            background: "none",
            border: "none",
            fontSize: 24,
            cursor: "pointer",
            color: "#888",
          }}
        >
          &times;
        </button>

        <h2 style={{ fontSize: 24, marginBottom: 5, color: "#333" }}>
          Edit Student
        </h2>
        <p style={{ fontSize: 14, color: "#666", marginBottom: 20 }}>
          Update student information and account details
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: "10px 0",
          }}
        >
          <Input
            label="Name"
            name="name"
            required
            form={form}
            handleChange={handleChange}
            handleBlur={handleBlur}
          />
          <Input
            label="Email"
            name="email"
            required
            type="email"
            form={form}
            handleChange={handleChange}
            handleBlur={handleBlur}
          />
          <Input
            label="Phone"
            name="phone"
            form={form}
            handleChange={handleChange}
            handleBlur={handleBlur}
          />
          <Input
            label="Emergency Contact"
            name="emergency"
            form={form}
            handleChange={handleChange}
            handleBlur={handleBlur}
          />
          <Input
            label="Paid Amount (₹)"
            name="paid"
            form={form}
            handleChange={handleChange}
            handleBlur={handleBlur}
          />
          <Input
            label="Due Amount (₹)"
            name="due"
            form={form}
            handleChange={handleChange}
            handleBlur={handleBlur}
          />

          {/* Status Dropdown */}
          <div
            style={{ flex: "1 1 45%", marginBottom: 15, position: "relative" }}
          >
            <label
              htmlFor="status"
              style={{
                position: "absolute",
                top: -10,
                left: 10,
                background: "white",
                padding: "0 5px",
                fontSize: 12,
                color: "#555",
              }}
            >
              Status *
            </label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              style={{
                width: "100%",
                padding: "12px 15px",
                borderRadius: 8,
                border: "1px solid #ccc",
                fontSize: 16,
                boxSizing: "border-box",
                marginTop: 10,
              }}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div style={{ flex: "1 1 45%", marginBottom: 15 }}></div>
        </div>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            marginTop: 20,
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "#e0e0e0",
              color: "#333",
              border: "none",
              padding: "10px 20px",
              borderRadius: 8,
              fontWeight: 500,
              cursor: "pointer",
              fontSize: 16,
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
              padding: "10px 24px",
              borderRadius: 8,
              fontWeight: 500,
              cursor: "pointer",
              fontSize: 16,
            }}
          >
            Update Student
          </button>
        </div>
      </form>
    </div>
  );
}
