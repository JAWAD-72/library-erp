import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import AddStudentModal from "./AddStudentModal";
import EditStudentModal from "./EditStudentModal";

export default function StudentsSection({ onDataUpdated }) {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error("Auth error:", userError);
        setStudents([]);
        return;
      }

      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("user_id", user.id)
        .order("id", { ascending: true });

      if (error) {
        console.error("Fetch error:", error);
        setStudents([]);
      } else {
        setStudents(data || []);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Apply search + filter
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const result = students.filter((s) => {
      const match =
        s.full_name.toLowerCase().includes(term) ||
        s.email.toLowerCase().includes(term) ||
        (s.phone || "").includes(term);

      const isWithDues = s.balance < 0;
      const isActive = s.status === "Active";
      const isInactive = s.status === "Inactive";

      if (activeFilter === "All") return match;
      if (activeFilter === "Active") return match && isActive;
      if (activeFilter === "Inactive") return match && isInactive;
      if (activeFilter === "With Dues") return match && isWithDues;

      return true;
    });
    setFilteredStudents(result);
  }, [students, searchTerm, activeFilter]);

  const counts = {
    All: students.length,
    Active: students.filter((s) => s.status === "Active").length,
    Inactive: students.filter((s) => s.status === "Inactive").length,
    "With Dues": students.filter((s) => s.balance < 0).length,
  };

  // Add
  const handleAddStudent = async (studentData) => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      alert("User not authenticated");
      return;
    }
    const newRec = {
      user_id: user.id,
      full_name: studentData.fullName,
      email: studentData.email,
      phone: studentData.phone,
      emergency_contact: studentData.emergency,
      address: studentData.address || "",
      registration_date: studentData.registrationDate,
      initial_deposit: parseFloat(studentData.deposit) || 0,
      balance: parseFloat(studentData.deposit) || 0,
      due_amount: 0,
      status: "Active",
      last_visit: new Date().toISOString().slice(0, 10),
    };
    const { error } = await supabase.from("students").insert([newRec]);
    if (error) {
      alert("Add failed: " + error.message);
    } else {
      setAddModalOpen(false);
      await fetchStudents();
      if (onDataUpdated) onDataUpdated();
    }
  };

  // Update / Edit
  const handleUpdateStudent = async (id, updatedFields) => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      alert("User not authenticated");
      return;
    }

    const { error } = await supabase
      .from("students")
      .update(updatedFields)
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      alert("Update failed: " + error.message);
    } else {
      setEditModalOpen(false);
      setCurrentStudent(null);
      await fetchStudents();
      if (onDataUpdated) onDataUpdated();
    }
  };

  // Delete
  const handleDeleteStudent = async (id, name) => {
    if (!window.confirm(`Delete ${name}?`)) return;
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      alert("User not authenticated");
      return;
    }
    const { error } = await supabase
      .from("students")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) {
      alert("Delete failed: " + error.message);
    } else {
      await fetchStudents();
      if (onDataUpdated) onDataUpdated();
    }
  };

  const openEditModal = (student) => {
    setCurrentStudent(student);
    setEditModalOpen(true);
  };

  const tableHeaders = [
    "Student",
    "Contact",
    "Registration",
    "Last Visit",
    "Balance",
    "Status",
    "Actions",
  ];

  const renderTh = (h) => (
    <th
      style={{
        padding: "12px 10px",
        border: "1px solid #eee",
        textAlign: "left",
        fontSize: 14,
        fontWeight: 600,
      }}
    >
      {h}
    </th>
  );
  const renderTd = (c) => (
    <td style={{ padding: 10, border: "1px solid #eee", fontSize: 14 }}>{c}</td>
  );

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        padding: 24,
        marginTop: 32,
        width: "100%",
        maxWidth: 1100,
        marginInline: "auto",
        boxShadow: "0 2px 16px #0001",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <strong style={{ fontSize: 20 }}>Students Management</strong>
          <div style={{ fontSize: 14, color: "#666" }}>
            Manage all registered students and their account details
          </div>
        </div>
        <button
          onClick={() => setAddModalOpen(true)}
          style={{
            background: "#2563eb",
            color: "#fff",
            border: "none",
            padding: "8px 20px",
            borderRadius: 6,
            fontWeight: 500,
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          + Add Student
        </button>
      </div>

      {/* Search & Filter */}
      <div
        style={{
          marginTop: 20,
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <input
          type="text"
          placeholder="🔍 Search by name, email, phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flexGrow: 1,
            padding: "10px 15px",
            borderRadius: 8,
            border: "1px solid #ddd",
            fontSize: 14,
          }}
        />
        {["All", "Active", "Inactive", "With Dues"].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            style={{
              padding: "8px 15px",
              borderRadius: 8,
              border: "1px solid #ddd",
              background: activeFilter === filter ? "#333" : "#fff",
              color: activeFilter === filter ? "#fff" : "#333",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            {filter} ({counts[filter]})
          </button>
        ))}
      </div>

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
              {tableHeaders.map(renderTh)}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={tableHeaders.length}
                  style={{ padding: 20, textAlign: "center" }}
                >
                  Loading students...
                </td>
              </tr>
            ) : filteredStudents.length === 0 ? (
              <tr>
                <td
                  colSpan={tableHeaders.length}
                  style={{ padding: 20, textAlign: "center" }}
                >
                  No matching students found.
                </td>
              </tr>
            ) : (
              filteredStudents.map((s) => (
                <tr key={s.id}>
                  {renderTd(
                    <>
                      <strong>{s.full_name}</strong>
                      <div style={{ fontSize: 12, color: "#999" }}>
                        ID: {s.id}
                      </div>
                    </>
                  )}
                  {renderTd(
                    <>
                      {s.email}
                      <div style={{ fontSize: 12, color: "#666" }}>
                        {s.phone}
                      </div>
                    </>
                  )}
                  {renderTd(s.registration_date)}
                  {renderTd(s.last_visit || "N/A")}
                  {renderTd(
                    <span
                      style={{
                        padding: "2px 6px",
                        borderRadius: 4,
                        background: s.balance >= 0 ? "#e6ffe6" : "#ffe6e6",
                        color: s.balance >= 0 ? "#22c55e" : "#ef4444",
                        fontWeight: 500,
                        fontSize: 13,
                      }}
                    >
                      {s.balance >= 0
                        ? `Paid ₹${s.balance.toFixed(2)}`
                        : `Due ₹${Math.abs(s.balance).toFixed(2)}`}
                    </span>
                  )}
                  {renderTd(
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: 6,
                        background:
                          s.status === "Active" ? "#22c55e" : "#f59e0b",
                        color: "white",
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      {s.status}
                    </span>
                  )}
                  {renderTd(
                    <div style={{ display: "flex", gap: 10 }}>
                      <button
                        onClick={() => openEditModal(s)}
                        style={{
                          padding: "6px 10px",
                          cursor: "pointer",
                          background: "#2563eb",
                          color: "white",
                          borderRadius: 6,
                          border: "none",
                        }}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(s.id, s.full_name)}
                        style={{
                          padding: "6px 10px",
                          cursor: "pointer",
                          background: "#ef4444",
                          color: "white",
                          borderRadius: 6,
                          border: "none",
                        }}
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

      {addModalOpen && (
        <AddStudentModal
          onClose={() => setAddModalOpen(false)}
          onAdd={handleAddStudent}
        />
      )}
      {editModalOpen && currentStudent && (
        <EditStudentModal
          open={editModalOpen}
          student={currentStudent}
          onClose={() => setEditModalOpen(false)}
          onUpdate={handleUpdateStudent}
        />
      )}
    </div>
  );
}
