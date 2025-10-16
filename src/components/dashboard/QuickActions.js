import {
  FaChartLine,
  FaFileAlt,
  FaMoneyBillWave,
  FaUserPlus,
} from "react-icons/fa";
import styles from "../../styles/AdminDashboard.module.css";

export default function QuickActions({ onAction }) {
  const handleAction = (action) => {
    if (onAction) {
      onAction(action);
    }
  };

  return (
    <div className={styles.quickActionsContainer}>
      <h3 className={styles.quickActionsTitle}>Quick Actions</h3>
      <p className={styles.quickActionsSubtitle}>Common administrative tasks</p>

      <div className={styles.quickActionButtonGroup}>
        <button
          className={`${styles.quickActionButton} ${styles.blue}`}
          onClick={() => handleAction("Manage Students")}
        >
          <FaUserPlus />
          Manage Students
        </button>

        <button
          className={`${styles.quickActionButton} ${styles.green}`}
          onClick={() => handleAction("Add Payment")}
        >
          <FaMoneyBillWave />
          Add Payment
        </button>

        <button
          className={`${styles.quickActionButton} ${styles.orange}`}
          onClick={() => handleAction("Add Expense")}
        >
          <FaChartLine />
          Add Expense
        </button>

        <button
          className={`${styles.quickActionButton} ${styles.purple}`}
          onClick={() => handleAction("Generate Report")}
        >
          <FaFileAlt />
          Generate Report
        </button>
      </div>
    </div>
  );
}
