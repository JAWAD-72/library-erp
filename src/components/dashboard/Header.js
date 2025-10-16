"use client";

import { useRouter } from "next/navigation";
import { FaSignOutAlt } from "react-icons/fa";
import styles from "../../styles/AdminDashboard.module.css";

export default function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // 1. Send request to the Server Route Handler
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        // 2. Perform aggressive client-side cleanup as a failsafe
        localStorage.clear();
        sessionStorage.clear();

        // 3. Navigate directly to the login page
        window.location.href = "/admin-access";
      } else {
        console.error("Server-side logout failed:", response.status);
        alert("Logout failed on the server. Please try again.");
      }
    } catch (e) {
      console.error("Network Error during logout:", e);

      window.location.href = "/admin-access";
    }
  };

  return (
    <header className={styles.header}>
      <h1 className={styles.headerTitle}>Admin Dashboard</h1>
      <button onClick={handleLogout} className={styles.logoutButton}>
        <FaSignOutAlt />
        Logout
      </button>
    </header>
  );
}
