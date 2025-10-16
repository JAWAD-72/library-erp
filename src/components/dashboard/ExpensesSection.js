import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import AddExpenseModal from "./AddExpenseModal";

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

export default function ExpensesSection({ onExpenseAdded }) {
  const [expenses, setExpenses] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    "All",
    "Utilities",
    "Salaries",
    "Rent",
    "Supplies",
    "Equipment & Furniture",
    "Maintenance",
    "Marketing",
    "Other",
  ];

  // Fetch only the current user's expenses
  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const {
        data: { user },
        error: getUserError,
      } = await supabase.auth.getUser();
      if (getUserError || !user) {
        console.error("Error getting user:", getUserError);
        setExpenses([]);
        setLoading(false);
        return;
      }

      let query = supabase
        .from("expenses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (filterCategory !== "All") {
        query = query.eq("category", filterCategory);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching expenses:", error);
        setExpenses([]);
      } else {
        setExpenses(data || []);
      }
    } catch (err) {
      console.error("Unexpected error in fetchExpenses:", err);
      setExpenses([]);
    }
    setLoading(false);
  }, [filterCategory]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  async function handleAddExpense(expenseData) {
    try {
      const {
        data: { user },
        error: getUserError,
      } = await supabase.auth.getUser();
      if (getUserError || !user) {
        console.error("Error getting user:", getUserError);
        alert("User not authenticated");
        return;
      }

      const { data, error } = await supabase
        .from("expenses")
        .insert([
          {
            user_id: user.id,
            description: expenseData.description,
            amount: parseFloat(expenseData.amount),
            category: expenseData.category,
            notes: expenseData.notes,
          },
        ])
        .select();

      if (error) {
        console.error("Error adding expense:", error);
        alert(`Failed to add expense! Error: ${error.message}`);
      } else if (data && data.length > 0) {
        setExpenses((prev) => [data[0], ...prev]);
        if (onExpenseAdded) onExpenseAdded(data[0]);
        alert("✅ Expense added successfully!");
      }
    } catch (err) {
      console.error("Unexpected error in handleAddExpense:", err);
    } finally {
      setModalOpen(false);
    }
  }

  async function handleDeleteExpense(id) {
    if (!id) {
      console.warn("No ID provided to delete");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this expense?")) {
      return;
    }
    try {
      const { error } = await supabase.from("expenses").delete().eq("id", id);

      if (error) {
        console.error("Error deleting expense:", error);
        alert("Failed to delete expense: " + error.message);
      } else {
        setExpenses((prev) => prev.filter((e) => e.id !== id));
        if (onExpenseAdded) onExpenseAdded();
        alert("🗑️ Expense deleted successfully!");
      }
    } catch (err) {
      console.error("Unexpected error in handleDeleteExpense:", err);
    }
  }

  const filteredExpenses = expenses.filter((expense) => {
    const searchLower = searchTerm.toLowerCase();
    const desc = expense.description?.toLowerCase() || "";
    const notes = expense.notes?.toLowerCase() || "";
    return (
      (desc.includes(searchLower) || notes.includes(searchLower)) &&
      (filterCategory === "All" || expense.category === filterCategory)
    );
  });

  const totalExpensesAmount = filteredExpenses.reduce(
    (sum, e) => sum + parseFloat(e.amount || 0),
    0
  );
  const thisMonthExpensesAmount = filteredExpenses
    .filter((e) => {
      const dt = new Date(e.created_at);
      const now = new Date();
      return (
        dt.getMonth() === now.getMonth() &&
        dt.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
  const totalTransactions = filteredExpenses.length;

  const tableHeaders = [
    "Description",
    "Amount",
    "Category",
    "Date",
    "Notes",
    "Actions",
  ];

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
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <div>
          <strong>Expenses Management</strong>
          <div style={{ fontSize: 14, color: "#666" }}>
            Track and manage your expenses
          </div>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          style={{
            background: "#ef4444",
            color: "#fff",
            border: "none",
            padding: "8px 20px",
            borderRadius: 6,
            fontWeight: 500,
            fontSize: 16,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          + Add Expense
        </button>
      </div>

      {/* Info / Stat Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 20,
          marginBottom: 30,
        }}
      >
        <div style={{ background: "#fee2e2", padding: 15, borderRadius: 8 }}>
          <h3 style={{ margin: "0 0 5px 0", color: "#dc2626" }}>
            Total Expenses
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: 24,
              fontWeight: "bold",
              color: "#dc2626",
            }}
          >
            ₹{totalExpensesAmount.toFixed(2)}
          </p>
        </div>
        <div style={{ background: "#fffbe7", padding: 15, borderRadius: 8 }}>
          <h3 style={{ margin: "0 0 5px 0", color: "#f59e0b" }}>This Month</h3>
          <p
            style={{
              margin: 0,
              fontSize: 24,
              fontWeight: "bold",
              color: "#f59e0b",
            }}
          >
            ₹{thisMonthExpensesAmount.toFixed(2)}
          </p>
        </div>
        <div style={{ background: "#e0f2fe", padding: 15, borderRadius: 8 }}>
          <h3 style={{ margin: "0 0 5px 0", color: "#3b82f6" }}>
            Total Transactions
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: 24,
              fontWeight: "bold",
              color: "#3b82f6",
            }}
          >
            {totalTransactions}
          </p>
        </div>
        <div style={{ background: "#ecfdf5", padding: 15, borderRadius: 8 }}>
          <h3 style={{ margin: "0 0 5px 0", color: "#10b981" }}>
            Average Expense
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: 24,
              fontWeight: "bold",
              color: "#10b981",
            }}
          >
            ₹
            {totalTransactions > 0
              ? (totalExpensesAmount / totalTransactions).toFixed(2)
              : "0.00"}
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 20,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Search expenses..."
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
        <div style={{ display: "flex", gap: 5 }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              style={{
                padding: "8px 15px",
                borderRadius: 6,
                border: `1px solid ${
                  filterCategory === cat ? "#dc2626" : "#ccc"
                }`,
                background: filterCategory === cat ? "#dc2626" : "#fff",
                color: filterCategory === cat ? "#fff" : "#333",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {cat} (
              {
                expenses.filter((e) => cat === "All" || e.category === cat)
                  .length
              }
              )
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto", marginTop: 20 }}>
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
                <td colSpan={tableHeaders.length}>Loading expenses...</td>
              </tr>
            ) : filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan={tableHeaders.length}>No expenses found</td>
              </tr>
            ) : (
              filteredExpenses.map((e) => (
                <tr key={e.id}>
                  {renderCell(e.description)}
                  {renderCell(`₹${parseFloat(e.amount).toFixed(2)}`)}
                  {renderCell(
                    <span
                      style={{
                        background: "#e0f2fe",
                        color: "#3b82f6",
                        borderRadius: 8,
                        padding: "2px 12px",
                        fontSize: 13,
                        fontWeight: 500,
                      }}
                    >
                      {e.category}
                    </span>
                  )}
                  {renderCell(new Date(e.created_at).toLocaleDateString())}
                  {renderCell(e.notes || "N/A")}
                  {renderCell(
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => handleDeleteExpense(e.id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#ef4444",
                          fontSize: 18,
                          cursor: "pointer",
                        }}
                        title="Delete Expense"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div
        style={{
          textAlign: "right",
          marginTop: 15,
          fontSize: 18,
          fontWeight: "bold",
          color: "#333",
        }}
      >
        Total Amount (Filtered): ₹{totalExpensesAmount.toFixed(2)}
      </div>

      <AddExpenseModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddExpense}
      />
    </div>
  );
}
