import styles from "../../styles/AdminDashboard.module.css";

export default function StudentActivity({
  activeStudents,
  inactiveStudents,
  totalRegistered,
}) {
  return (
    <div className={styles.card}>
      <h3 className={styles.panelTitle}>Student Activity</h3>
      <div className={styles.panelContent}>
        <div className={styles.panelItem}>
          <span>Active Students</span>
          <span className={styles.panelItemValue}>{activeStudents}</span>
        </div>
        <div className={styles.panelItem}>
          <span>Inactive Students (2+ months)</span>
          <span className={styles.panelItemValue}>{inactiveStudents}</span>
        </div>
        <div className={styles.panelItem}>
          <span>Total Registered</span>
          <span className={styles.panelItemValue}>{totalRegistered}</span>
        </div>
      </div>
    </div>
  );
}
