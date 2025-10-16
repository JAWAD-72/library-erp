import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function ReportsSection() {
  const [userId, setUserId] = useState(null);
  const [reportMetrics, setReportMetrics] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netProfitLoss: 0,
    transactions: 0,
    cashPayments: 0,
    onlinePayments: 0,
    expensesByCategory: {},
  });
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  const handleExportCSV = () => {
    window.location.href = "/api/report";
  };

  const fetchRealMetrics = async (userId) => {
    setLoadingMetrics(true);

    const [
      { data: payments, error: pError },
      { data: expenses, error: eError },
    ] = await Promise.all([
      supabase
        .from("payments")
        .select("amount, payment_method")
        .eq("user_id", userId),
      supabase
        .from("expenses")
        .select("amount, category")
        .eq("user_id", userId),
    ]);

    if (pError || eError) {
      console.error("Failed to fetch report metrics:", pError || eError);
      setLoadingMetrics(false);
      return;
    }

    const totalIncome = payments.reduce(
      (sum, p) => sum + parseFloat(p.amount || 0),
      0
    );
    const totalExpenses = expenses.reduce(
      (sum, e) => sum + parseFloat(e.amount || 0),
      0
    );
    const netProfitLoss = totalIncome - totalExpenses;

    const cashPayments = payments
      .filter((p) => p.payment_method === "Cash")
      .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
    const onlinePayments = totalIncome - cashPayments;

    const expensesByCategory = expenses.reduce((acc, e) => {
      const cat = e.category || "Other";
      acc[cat] = (acc[cat] || 0) + parseFloat(e.amount || 0);
      return acc;
    }, {});

    setReportMetrics({
      totalIncome,
      totalExpenses,
      netProfitLoss,
      transactions: payments.length,
      cashPayments,
      onlinePayments,
      expensesByCategory,
    });

    setLoadingMetrics(false);
  };

  // Get current user ID on mount
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
        fetchRealMetrics(user.id);
      } else {
        console.warn("User not logged in");
        setLoadingMetrics(false);
      }
    };

    getUser();
  }, []);

  const expenseBreakdownArray = Object.entries(
    reportMetrics.expensesByCategory || {}
  ).map(([category, amount]) => ({ category, amount }));

  if (loadingMetrics) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        Loading Financial Analytics...
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        padding: 24,
        marginTop: 32,
        width: "100%",
        maxWidth: 1100,
        marginLeft: "auto",
        marginRight: "auto",
        boxShadow: "0 2px 16px #0001",
      }}
    >
      <h2 style={{ fontSize: 24, marginBottom: 5 }}>Reports & Analytics</h2>
      <p style={{ fontSize: 14, color: "#666", marginBottom: 20 }}>
        Generate detailed reports and analytics for your account
      </p>

      <div
        style={{
          display: "flex",
          gap: 15,
          alignItems: "center",
          paddingBottom: 25,
          borderBottom: "1px solid #eee",
        }}
      >
        <button
          onClick={handleExportCSV}
          style={{
            background: "#10b981",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          Export Full CSV Report
        </button>
      </div>

      {/* Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 20,
          marginTop: 30,
          paddingBottom: 20,
          borderBottom: "1px solid #eee",
        }}
      >
        <SummaryCard
          title="Total Income"
          value={reportMetrics.totalIncome}
          color="#10b981"
          background="#f0fff0"
        />
        <SummaryCard
          title="Total Expenses"
          value={reportMetrics.totalExpenses}
          color="#ef4444"
          background="#fef2f2"
        />
        <SummaryCard
          title="Net Profit/Loss"
          value={reportMetrics.netProfitLoss}
          color="#3b82f6"
          background="#e0f2fe"
        />
        <SummaryCard
          title="Transactions"
          value={reportMetrics.transactions}
          color="#4b5563"
          background="#f5f5f5"
        />
      </div>

      {/* Breakdown Grids */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 30,
          marginTop: 20,
        }}
      >
        {/* Payment Methods Breakdown */}
        <div style={{ padding: 15, border: "1px solid #eee", borderRadius: 8 }}>
          <h3 style={{ margin: "0 0 15px 0", fontSize: 18, fontWeight: 600 }}>
            Payment Methods Breakdown
          </h3>
          <BreakdownRow
            label="Cash Payments"
            value={reportMetrics.cashPayments}
            color="#10b981"
          />
          <BreakdownRow
            label="Online Payments"
            value={reportMetrics.onlinePayments}
            color="#3b82f6"
          />
        </div>

        {/* Expenses by Category */}
        <div style={{ padding: 15, border: "1px solid #eee", borderRadius: 8 }}>
          <h3 style={{ margin: "0 0 15px 0", fontSize: 18, fontWeight: 600 }}>
            Expenses by Category
          </h3>
          {expenseBreakdownArray.length === 0 ? (
            <div style={{ color: "#999", padding: "5px 0" }}>
              No expenses recorded.
            </div>
          ) : (
            expenseBreakdownArray.map(({ category, amount }, idx) => (
              <BreakdownRow
                key={category}
                label={category}
                value={amount}
                color="#ef4444"
                dotted={idx < expenseBreakdownArray.length - 1}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, color, background }) {
  return (
    <div style={{ padding: 15, borderRadius: 8, background }}>
      <h3 style={{ margin: 0, color, fontSize: 16 }}>{title}</h3>
      <p
        style={{ margin: "5px 0 0 0", fontSize: 24, fontWeight: "bold", color }}
      >
        {typeof value === "number" ? `₹${value.toFixed(2)}` : value}
      </p>
    </div>
  );
}

// Reusable Breakdown Row
function BreakdownRow({ label, value, color, dotted = true }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "5px 0",
        borderBottom: dotted ? "1px dotted #ccc" : "none",
      }}
    >
      <span>{label}</span>
      <span style={{ fontWeight: "bold", color }}>{`₹${value.toFixed(
        2
      )}`}</span>
    </div>
  );
}
