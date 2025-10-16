import { Inter } from "next/font/google";
import { FaBook } from "react-icons/fa";

import HomeCard from "../components/HomeCard";

import styles from "../styles/Home.module.css";

const inter = Inter({ subsets: ["latin"] });

export default function HomePage() {
  return (
    <main className={`${styles.main} ${inter.className}`}>
      <h1 className={styles.title}>
        <FaBook size={40} color={styles.purple} />
        Library Account Management System
      </h1>
      <HomeCard />
      <footer
        style={{
          marginTop: "2rem",
          textAlign: "center",
          color: "#666",
          fontSize: "0.9rem",
        }}
      ></footer>
    </main>
  );
}
