"use client";
import React, { useEffect, useState } from "react";
import BottomNav from "@/components/shared/BottomNav";
import VoiceButton from "@/components/shared/VoiceButton";

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.replace("/login?role=patient");
      return;
    }
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 40, height: 40, border: "3px solid var(--blue-primary)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
          <p style={{ color: "var(--text-secondary)" }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <main className="page-content page-fade-in">
        {children}
      </main>
      <VoiceButton />
      <BottomNav />
    </div>
  );
}
