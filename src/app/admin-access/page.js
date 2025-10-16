"use client";
import AdminAccessCard from "../../components/AdminAccessCard";

export default function AdminAccessPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f7f8fa",
      }}
    >
      <AdminAccessCard />
    </div>
  );
}
