import { useState } from "react";
import styles from "../../styles/AdminDashboard.module.css";

export default function NavTabs({ onTabChange }) {
  const [activeTab, setActiveTab] = useState("Overview");

  const handleClick = (tabName) => {
    setActiveTab(tabName);
    if (onTabChange) {
      onTabChange(tabName);
    }
  };

  return (
    <nav className={styles.navTabs}>
      <button
        className={`${styles.navTab} ${
          activeTab === "Overview" ? styles.active : ""
        }`}
        onClick={() => handleClick("Overview")}
      >
        Overview
      </button>
      <button
        className={`${styles.navTab} ${
          activeTab === "Students" ? styles.active : ""
        }`}
        onClick={() => handleClick("Students")}
      >
        Students
      </button>
      <button
        className={`${styles.navTab} ${
          activeTab === "Payments" ? styles.active : ""
        }`}
        onClick={() => handleClick("Payments")}
      >
        Payments
      </button>
      <button
        className={`${styles.navTab} ${
          activeTab === "Expenses" ? styles.active : ""
        }`}
        onClick={() => handleClick("Expenses")}
      >
        Expenses
      </button>
      <button
        className={`${styles.navTab} ${
          activeTab === "Reports" ? styles.active : ""
        }`}
        onClick={() => handleClick("Reports")}
      >
        Reports
      </button>
    </nav>
  );
}
