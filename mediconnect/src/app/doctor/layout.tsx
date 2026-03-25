import React from "react";
import DoctorBottomNav from "@/components/shared/DoctorBottomNav";

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-wrapper" style={{ background: "var(--bg-page)" }}>
      <main className="page-content page-fade-in">
        {children}
      </main>
      <DoctorBottomNav />
    </div>
  );
}
