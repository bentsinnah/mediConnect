"use client";
import React, { useEffect, useState } from "react";
import DoctorBottomNav from "@/components/shared/DoctorBottomNav";

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.replace("/login?role=doctor");
      return;
    }
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 40, height: 40, border: "3px solid var(--green-primary)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
          <p style={{ color: "var(--text-secondary)" }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper" style={{ background: "var(--bg-page)" }}>
      <main className="page-content page-fade-in">
        {children}
      </main>
      <DoctorBottomNav />
    </div>
  );
}
