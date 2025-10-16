import styles from "../../styles/AdminDashboard.module.css";

export default function InfoCard({
  title,
  value,
  subtitle,
  icon: Icon,
  typeClass = "",
}) {
  return (
    <div className={`${styles.card} ${styles[typeClass]}`}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{title}</h3>
        {Icon && <Icon size={24} className={styles.cardIcon} />}
      </div>
      <p className={styles.cardValue}>{value}</p>
      <p className={styles.cardSubtitle}>{subtitle}</p>
    </div>
  );
}
