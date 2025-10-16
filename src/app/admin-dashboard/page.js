"use client";
import AdminDashboardLayout from "../../components/AdminDashboardLayout";
import styles from "../../styles/AdminDashboard.module.css";

export default function AdminDashboardPage() {
  return (
    <div className={styles.dashboardContainer}>
      <AdminDashboardLayout />
    </div>
  );
}
