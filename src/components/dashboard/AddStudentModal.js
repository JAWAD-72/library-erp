import { useState } from "react";

export default function AddStudentModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    emergency: "",
    address: "",
    registrationDate: new Date().toISOString().slice(0, 10),
    deposit: "", // Initial deposit input
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Basic validation for deposit to only allow numbers and decimals
    if (name === "deposit") {
      if (!/^\d*\.?\d*$/.test(value) && value !== "") {
        return; // Prevent invalid characters
      }
    }
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (
      !form.fullName.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.registrationDate.trim()
    ) {
      alert(
        "Please fill all required fields (Full Name, Email, Phone, Registration Date)."
      );
      return;
    }

    onAdd(form);

    setForm({
      fullName: "",
      email: "",
      phone: "",
      emergency: "",
      address: "",
      registrationDate: new Date().toISOString().slice(0, 10),
      deposit: "",
    });
  };

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
          minWidth: 500,
          maxWidth: 540,
          width: "100%",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
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

        <h2 style={{ fontSize: 24, marginBottom: 8, color: "#333" }}>
          Add New Student
        </h2>
        <div style={{ fontSize: 15, color: "#666", marginBottom: 18 }}>
          Register a new student in the library system
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 16,
          }}
        >
          {/* Full Name */}
          <div style={{ flex: "1 1 220px", position: "relative" }}>
            <label
              htmlFor="fullName"
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
              <span
                style={{
                  fontSize: 16,
                  verticalAlign: "middle",
                  marginRight: 5,
                }}
              >
                👤
              </span>{" "}
              Full Name *
            </label>
            <input
              id="fullName"
              name="fullName"
              placeholder="Enter full name"
              type="text"
              value={form.fullName}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                fontSize: 16,
                padding: "12px 15px",
                borderRadius: 8,
                border: "1px solid #ccc",
                boxSizing: "border-box",
                marginTop: 10,
              }}
            />
          </div>

          {/* Email Address */}
          <div style={{ flex: "1 1 220px", position: "relative" }}>
            <label
              htmlFor="email"
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
              <span
                style={{
                  fontSize: 16,
                  verticalAlign: "middle",
                  marginRight: 5,
                }}
              >
                📧
              </span>{" "}
              Email Address *
            </label>
            <input
              id="email"
              name="email"
              placeholder="Enter email address"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                fontSize: 16,
                padding: "12px 15px",
                borderRadius: 8,
                border: "1px solid #ccc",
                boxSizing: "border-box",
                marginTop: 10,
              }}
            />
          </div>

          {/* Phone Number */}
          <div style={{ flex: "1 1 220px", position: "relative" }}>
            <label
              htmlFor="phone"
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
              <span
                style={{
                  fontSize: 16,
                  verticalAlign: "middle",
                  marginRight: 5,
                }}
              >
                📞
              </span>{" "}
              Phone Number *
            </label>
            <input
              id="phone"
              name="phone"
              placeholder="10-digit phone number"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                fontSize: 16,
                padding: "12px 15px",
                borderRadius: 8,
                border: "1px solid #ccc",
                boxSizing: "border-box",
                marginTop: 10,
              }}
            />
          </div>

          {/* Emergency Contact */}
          <div style={{ flex: "1 1 220px", position: "relative" }}>
            <label
              htmlFor="emergency"
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
              <span
                style={{
                  fontSize: 16,
                  verticalAlign: "middle",
                  marginRight: 5,
                }}
              >
                🆘
              </span>{" "}
              Emergency Contact
            </label>
            <input
              id="emergency"
              name="emergency"
              placeholder="Emergency contact number"
              type="tel"
              value={form.emergency}
              onChange={handleChange}
              style={{
                width: "100%",
                fontSize: 16,
                padding: "12px 15px",
                borderRadius: 8,
                border: "1px solid #ccc",
                boxSizing: "border-box",
                marginTop: 10,
              }}
            />
          </div>

          {/* Address */}
          <div style={{ flex: "1 1 100%", position: "relative" }}>
            <label
              htmlFor="address"
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
              <span
                style={{
                  fontSize: 16,
                  verticalAlign: "middle",
                  marginRight: 5,
                }}
              >
                📍
              </span>{" "}
              Address
            </label>
            <input
              id="address"
              name="address"
              placeholder="Enter complete address"
              type="text"
              value={form.address}
              onChange={handleChange}
              style={{
                width: "100%",
                fontSize: 16,
                padding: "12px 15px",
                borderRadius: 8,
                border: "1px solid #ccc",
                boxSizing: "border-box",
                marginTop: 10,
              }}
            />
          </div>

          {/* Registration Date */}
          <div style={{ flex: "1 1 220px", position: "relative" }}>
            <label
              htmlFor="registrationDate"
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
              <span
                style={{
                  fontSize: 16,
                  verticalAlign: "middle",
                  marginRight: 5,
                }}
              >
                📅
              </span>{" "}
              Registration Date *
            </label>
            <input
              id="registrationDate"
              name="registrationDate"
              type="date"
              value={form.registrationDate}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                fontSize: 16,
                padding: "12px 15px",
                borderRadius: 8,
                border: "1px solid #ccc",
                boxSizing: "border-box",
                marginTop: 10,
              }}
            />
          </div>

          {/* Initial Deposit */}
          <div style={{ flex: "1 1 220px", position: "relative" }}>
            <label
              htmlFor="deposit"
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
              <span
                style={{
                  fontSize: 16,
                  verticalAlign: "middle",
                  marginRight: 5,
                }}
              >
                ₹
              </span>{" "}
              Initial Deposit (₹)
            </label>
            <input
              id="deposit"
              name="deposit"
              placeholder="Optional initial deposit"
              type="text"
              inputMode="decimal"
              value={form.deposit}
              onChange={handleChange}
              style={{
                width: "100%",
                fontSize: 16,
                padding: "12px 15px",
                borderRadius: 8,
                border: "1px solid #ccc",
                boxSizing: "border-box",
                marginTop: 10,
              }}
            />
          </div>
        </div>

        {/* Action Buttons */}
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
              padding: "10px 18px",
              borderRadius: 8,
              border: "1px solid #ccc",
              background: "#fff",
              fontSize: 16,
              cursor: "pointer",
              fontWeight: 500,
              color: "#555",
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{
              background: "#2563eb",
              color: "#fff",
              border: "none",
              padding: "10px 24px",
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Add Student
          </button>
        </div>
      </form>
    </div>
  );
}
