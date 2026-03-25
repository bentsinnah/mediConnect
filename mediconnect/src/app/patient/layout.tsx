import React from "react";
import BottomNav from "@/components/shared/BottomNav";
import VoiceButton from "@/components/shared/VoiceButton";

export default function PatientLayout({ children }: { children: React.ReactNode }) {
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
