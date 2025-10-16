import { useCallback, useEffect, useState } from "react";
import {
  FaExclamationTriangle,
  FaRupeeSign,
  FaUsers,
  FaWallet,
} from "react-icons/fa";
import { supabase } from "../lib/supabaseClient";
import styles from "../styles/AdminDashboard.module.css";
import ExpensesSection from "./dashboard/ExpensesSection";
import FinancialOverview from "./dashboard/FinancialOverview";
import Header from "./dashboard/Header";
import InfoCard from "./dashboard/InfoCard";
import NavTabs from "./dashboard/NavTabs";
import PaymentsSection from "./dashboard/PaymentsSection";
import QuickActions from "./dashboard/QuickActions";
import ReportsSection from "./dashboard/ReportsSection";
import StudentActivity from "./dashboard/StudentActivity";
import StudentsSection from "./dashboard/StudentsSection";

export default function AdminDashboardLayout() {
  // State
  const [activeTab, setActiveTab] = useState("Overview");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [financialTrigger, setFinancialTrigger] = useState(0);
  const [students, setStudents] = useState([]);

  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    activeStudentsCount: 0,
    inactiveStudentsCount: 0,
    totalDues: 0,
    totalReceived: 0,
    totalIncome: 0,
    totalExpenses: 0,
    outstandingDues: 0,
  });

  // --- Fetch students ---
  const fetchStudents = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error("Failed to fetch students:", error.message);
        return;
      }

      const studentsData = data || [];
      setStudents(studentsData);

      const totalCount = studentsData.length;
      const activeCount = studentsData.filter(
        (s) => s.status === "Active"
      ).length;

      // Calculate total dues from students' due_amount
      const totalDues = studentsData.reduce(
        (sum, s) => sum + (parseFloat(s.due_amount) || 0),
        0
      );

      setDashboardData((prev) => ({
        ...prev,
        totalStudents: totalCount,
        activeStudentsCount: activeCount,
        inactiveStudentsCount: totalCount - activeCount,
        totalDues,
      }));
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  }, [user]);

  // --- Fetch financial data ---
  const fetchFinancialData = useCallback(async () => {
    if (!user) return;

    try {
      const [
        { data: paymentsData, error: paymentsError },
        { data: expensesData, error: expensesError },
      ] = await Promise.all([
        supabase.from("payments").select("amount").eq("user_id", user.id),
        supabase.from("expenses").select("amount").eq("user_id", user.id),
      ]);

      if (paymentsError) {
        console.error("Failed to fetch payments:", paymentsError.message);
      }
      if (expensesError) {
        console.error("Failed to fetch expenses:", expensesError.message);
      }

      const totalReceived = (paymentsData || []).reduce(
        (sum, p) => sum + parseFloat(p.amount || 0),
        0
      );
      const totalExpenses = (expensesData || []).reduce(
        (sum, e) => sum + parseFloat(e.amount || 0),
        0
      );

      setDashboardData((prev) => ({
        ...prev,
        totalReceived,
        totalIncome: totalReceived,
        totalExpenses,
      }));
    } catch (error) {
      console.error("Failed to fetch financial data:", error);
    }
  }, [user]);

  // --- Triggers for re-fetching financial data ---
  const triggerFinancialRefresh = () => setFinancialTrigger((prev) => prev + 1);

  // --- Initialization ---
  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();

        if (!currentUser) {
          setLoading(false);
          return;
        }

        setUser(currentUser);

        // Fetch both students and financial data concurrently
        await Promise.all([fetchStudents(), fetchFinancialData()]);

        setLoading(false);
      } catch (error) {
        console.error("Initialization error:", error);
        setLoading(false);
      }
    };

    initializeDashboard();
  }, [fetchStudents, fetchFinancialData, financialTrigger]);

  // --- Calculations ---
  const availableBalance =
    dashboardData.totalReceived - dashboardData.totalExpenses;
  const netBalance = dashboardData.totalIncome - dashboardData.totalExpenses;

  // --- Quick Action handler ---
  const handleQuickAction = (action) => {
    switch (action) {
      case "Manage Students":
        setActiveTab("Students");
        break;
      case "Add Payment":
        setActiveTab("Payments");
        break;
      case "Add Expense":
        setActiveTab("Expenses");
        break;
      case "Generate Report":
        setActiveTab("Reports");
        break;
      default:
        setActiveTab("Overview");
    }
  };

  // --- Callback handlers to pass to children ---
  const handleStudentAdded = async () => {
    await fetchStudents();
  };

  const handlePaymentAdded = () => {
    triggerFinancialRefresh();
  };

  const handleExpenseAdded = () => {
    triggerFinancialRefresh();
  };

  // --- Loading State ---
  if (loading) {
    return (
      <div
        className={styles.dashboardContainer}
        style={{
          justifyContent: "center",
          alignItems: "center",
          fontSize: "1.5rem",
          color: "#333",
          height: "100vh",
          display: "flex",
        }}
      >
        Loading Dashboard Data...
      </div>
    );
  }

  // --- Content Rendering ---
  const renderContent = () => {
    switch (activeTab) {
      case "Overview":
        return (
          <>
            <div className={styles.overviewGrid}>
              <InfoCard
                title="Total Students"
                value={dashboardData.totalStudents}
                subtitle={`${dashboardData.activeStudentsCount} active, ${dashboardData.inactiveStudentsCount} inactive`}
                icon={FaUsers}
                typeClass="totalStudents"
              />
              <InfoCard
                title="Total Dues"
                value={`₹${dashboardData.totalDues.toFixed(2)}`}
                subtitle="Outstanding amounts"
                icon={FaExclamationTriangle}
                typeClass="totalDues"
              />
              <InfoCard
                title="Total Received"
                value={`₹${dashboardData.totalReceived.toFixed(2)}`}
                subtitle="All payments collected"
                icon={FaRupeeSign}
                typeClass="totalReceived"
              />
              <InfoCard
                title="Available Balance"
                value={`₹${availableBalance.toFixed(2)}`}
                subtitle={`After ₹${dashboardData.totalExpenses.toFixed(
                  2
                )} expenses`}
                icon={FaWallet}
                typeClass="availableBalance"
              />
            </div>

            <div className={styles.summaryCardsGrid}>
              <FinancialOverview
                income={dashboardData.totalIncome.toFixed(2)}
                expenses={dashboardData.totalExpenses.toFixed(2)}
                dues={dashboardData.totalDues.toFixed(2)}
                balance={netBalance.toFixed(2)}
              />
              <StudentActivity
                activeStudents={dashboardData.activeStudentsCount}
                inactiveStudents={dashboardData.inactiveStudentsCount}
                totalRegistered={dashboardData.totalStudents}
              />
            </div>

            <QuickActions onAction={handleQuickAction} />
          </>
        );

      case "Students":
        return (
          <StudentsSection
            students={students}
            onAddStudent={handleStudentAdded}
          />
        );

      case "Payments":
        return (
          <PaymentsSection
            students={students}
            onPaymentAdded={handlePaymentAdded}
          />
        );

      case "Expenses":
        return <ExpensesSection onExpenseAdded={handleExpenseAdded} />;

      case "Reports":
        return <ReportsSection />;

      default:
        return null;
    }
  };

  return (
    <>
      <Header />
      <NavTabs activeTab={activeTab} onTabChange={setActiveTab} />
      {renderContent()}
    </>
  );
}
