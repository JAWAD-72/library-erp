import styles from "../../styles/AdminDashboard.module.css";

export default function FinancialOverview({ income, expenses, dues, balance }) {
  return (
    <div className={styles.card}>
      <h3 className={styles.panelTitle}>Financial Overview</h3>
      <div className={styles.panelContent}>
        <div className={`${styles.panelItem} ${styles.income}`}>
          <span>Total Income</span>
          <span className={styles.panelItemValue}>₹{income}</span>
        </div>
        <div className={`${styles.panelItem} ${styles.expenses}`}>
          <span>Total Expenses</span>
          <span className={styles.panelItemValue}>₹{expenses}</span>
        </div>
        <div className={`${styles.panelItem} ${styles.dues}`}>
          <span>Outstanding Dues</span>
          <span className={styles.panelItemValue}>₹{dues}</span>
        </div>
        <div className={`${styles.panelItem} ${styles.balance}`}>
          <span>Net Balance</span>
          <span className={styles.panelItemValue}>₹{balance}</span>
        </div>
      </div>
    </div>
  );
}
