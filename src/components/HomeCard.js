import Link from "next/link";
import { BsFillGearFill } from "react-icons/bs";
import styles from "../styles/Home.module.css";

export default function HomeCard() {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.iconWrapper}>
        <BsFillGearFill size={48} color="#198754" />
      </div>
      <h2 className={styles.cardTitle}>Admin Panel</h2>
      <p className={styles.cardText}>
        Manage library accounts, expenses, and generate reports
      </p>
      <Link href="/admin-access" className={styles.accessButton}>
        Access Admin Panel
      </Link>
    </div>
  );
}
