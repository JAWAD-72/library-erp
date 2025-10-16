import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import AddPaymentModal from "./AddPaymentModal";

const renderCell = (content, style = {}) => (
  <td
    style={{
      padding: 10,
      border: "1px solid #eee",
      textAlign: "left",
      ...style,
    }}
  >
    {content}
  </td>
);

// Summary card component
const SummaryCard = ({ title, value, bgColor, textColor }) => (
  <div style={{ background: bgColor, padding: 15, borderRadius: 8 }}>
    <h3 style={{ margin: "0 0 5px", color: textColor }}>{title}</h3>
    <p
      style={{ margin: 0, fontSize: 24, fontWeight: "bold", color: textColor }}
    >
      {value}
    </p>
  </div>
);

export default function PaymentsSection({ onPaymentAdded }) {
  const [payments, setPayments] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("payments")
        .select(
          "id, created_at, student_id, student_name, amount, payment_method, description, status"
        )
        .order("created_at", { ascending: false });

      if (filter !== "All") {
        query = query.eq("payment_method", filter);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching payments:", error);
        alert("Error fetching payments.");
      } else {
        setPayments(data || []);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Something went wrong fetching payments.");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleAddPayment = async (paymentData) => {
    try {
      const { data, error } = await supabase
        .from("payments")
        .insert([
          {
            student_id: paymentData.studentId,
            student_name: paymentData.studentName,
            amount: parseFloat(paymentData.amount),
            payment_method: paymentData.paymentMethod,
            description: paymentData.description,
            status: "Completed",
          },
        ])
        .select();

      if (error) {
        alert(`Failed to add payment: ${error.message}`);
      } else {
        const newPayment = data[0];
        setPayments((prev) => [newPayment, ...prev]);
        onPaymentAdded?.(newPayment);
        alert("✅ Payment added successfully!");
      }
    } catch (err) {
      console.error("Add payment error:", err);
    } finally {
      setModalOpen(false);
    }
  };

  const handleDeletePayment = async (paymentId) => {
    if (!paymentId || !window.confirm("Delete this payment?")) return;

    try {
      const { error } = await supabase
        .from("payments")
        .delete()
        .eq("id", paymentId);

      if (error) {
        alert("Failed to delete payment: " + error.message);
      } else {
        setPayments((prev) => prev.filter((p) => p.id !== paymentId));
        onPaymentAdded?.();
        alert("🗑️ Payment deleted successfully!");
      }
    } catch (err) {
      console.error("Delete payment error:", err);
    }
  };

  const filteredPayments = useMemo(() => {
    const term = searchTerm.toLowerCase();

    return payments.filter((p) => {
      const name = p.student_name?.toLowerCase() || "";
      const sid = p.student_id?.toLowerCase() || "";
      const desc = p.description?.toLowerCase() || "";
      const matchesSearch =
        name.includes(term) || sid.includes(term) || desc.includes(term);
      const matchesFilter = filter === "All" || p.payment_method === filter;
      return matchesSearch && matchesFilter;
    });
  }, [payments, searchTerm, filter]);

  const summary = useMemo(() => {
    const total = filteredPayments.reduce(
      (sum, p) => sum + parseFloat(p.amount || 0),
      0
    );
    const cash = filteredPayments
      .filter((p) => p.payment_method === "Cash")
      .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
    const online = filteredPayments
      .filter((p) => p.payment_method === "Online")
      .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
    return {
      total,
      cash,
      online,
      transactions: filteredPayments.length,
    };
  }, [filteredPayments]);

  const tableHeaders = [
    "Student",
    "Amount",
    "Method",
    "Date",
    "Description",
    "Status",
    "Actions",
  ];

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        padding: 24,
        marginTop: 32,
        maxWidth: 1100,
        margin: "0 auto",
        boxShadow: "0 2px 16px #0001",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <div>
          <strong>Payments Management</strong>
          <div style={{ fontSize: 14, color: "#666" }}>
            Track all payments received from students
          </div>
        </div>
        <button
          onClick={() => setModalOpen(true)}
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
          + Add Payment
        </button>
      </div>

      {/* Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 20,
          marginBottom: 30,
        }}
      >
        <SummaryCard
          title="Total Payments"
          value={`₹${summary.total.toFixed(2)}`}
          bgColor="#e6ffe6"
          textColor="#22c55e"
        />
        <SummaryCard
          title="Cash Payments"
          value={`₹${summary.cash.toFixed(2)}`}
          bgColor="#e0f2fe"
          textColor="#3b82f6"
        />
        <SummaryCard
          title="Online Payments"
          value={`₹${summary.online.toFixed(2)}`}
          bgColor="#fffbeb"
          textColor="#f59e0b"
        />
        <SummaryCard
          title="Total Transactions"
          value={summary.transactions}
          bgColor="#fce7f3"
          textColor="#ec4899"
        />
      </div>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          marginBottom: 20,
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Search by student name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flexGrow: 1,
            padding: "8px 12px",
            border: "1px solid #ccc",
            borderRadius: 6,
            minWidth: 200,
          }}
        />
        {["All", "Cash", "Online"].map((filt) => (
          <button
            key={filt}
            onClick={() => setFilter(filt)}
            style={{
              padding: "8px 15px",
              borderRadius: 6,
              border: `1px solid ${filter === filt ? "#2563eb" : "#ccc"}`,
              background: filter === filt ? "#2563eb" : "#fff",
              color: filter === filt ? "#fff" : "#333",
              cursor: "pointer",
            }}
          >
            {filt} (
            {filt === "All"
              ? payments.length
              : payments.filter((p) => p.payment_method === filt).length}
            )
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            minWidth: 900,
            borderCollapse: "collapse",
            background: "#fff",
          }}
        >
          <thead>
            <tr style={{ background: "#f7f8fa" }}>
              {tableHeaders.map((header) => (
                <th
                  key={header}
                  style={{
                    padding: 10,
                    border: "1px solid #eee",
                    textAlign: "left",
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={tableHeaders.length}
                  style={{ textAlign: "center", padding: 20 }}
                >
                  Loading payments...
                </td>
              </tr>
            ) : filteredPayments.length === 0 ? (
              <tr>
                <td
                  colSpan={tableHeaders.length}
                  style={{ textAlign: "center", padding: 20 }}
                >
                  No payments found
                </td>
              </tr>
            ) : (
              filteredPayments.map((p) => (
                <tr key={p.id}>
                  {renderCell(
                    <div style={{ fontWeight: 500 }}>
                      {p.student_name || "Unknown"}
                      <div style={{ fontSize: "0.8em", color: "#666" }}>
                        ID: {p.student_id || "N/A"}
                      </div>
                    </div>
                  )}
                  {renderCell(`₹${parseFloat(p.amount).toFixed(2)}`)}
                  {renderCell(p.payment_method)}
                  {renderCell(new Date(p.created_at).toLocaleString())}
                  {renderCell(p.description || "N/A")}
                  {renderCell(
                    <span
                      style={{
                        background: "#e6ffe6",
                        color: "#22c55e",
                        borderRadius: 8,
                        padding: "2px 12px",
                        fontSize: 13,
                        fontWeight: 500,
                      }}
                    >
                      {p.status}
                    </span>
                  )}
                  {renderCell(
                    <button
                      onClick={() => handleDeletePayment(p.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#ef4444",
                        fontSize: 18,
                        cursor: "pointer",
                      }}
                      title="Delete Payment"
                    >
                      🗑️
                    </button>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Total Summary */}
      <div
        style={{
          textAlign: "right",
          marginTop: 15,
          fontSize: 18,
          fontWeight: "bold",
          color: "#333",
        }}
      >
        Total Amount (Filtered): ₹{summary.total.toFixed(2)}
      </div>

      <AddPaymentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddPayment}
      />
    </div>
  );
}
