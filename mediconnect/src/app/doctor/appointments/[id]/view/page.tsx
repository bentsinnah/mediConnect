"use client";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, MapPin, FileText, Pill, Stethoscope } from "lucide-react";
import { useApi } from "@/lib/api";
import { useParams } from "next/navigation";
import Avatar from "@/components/Avatar";

export default function DoctorConsultationViewPage() {
  const { id } = useParams() as { id: string };
  // Fetch consultation by appointment ID
  const { data: consultation, loading } = useApi<any>(`/consultations/${id}`);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
        <p style={{ color: "var(--text-secondary)" }}>Loading...</p>
      </div>
    );
  }

  if (!consultation) {
    return (
      <div style={{ padding: 32, textAlign: "center" }}>
        <p style={{ color: "var(--text-secondary)", marginBottom: 16 }}>No consultation record found for this appointment.</p>
        <Link href="/doctor/appointments" className="btn btn-primary">Back to Appointments</Link>
      </div>
    );
  }

  return (
    <>
      <header style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", borderBottom: "1px solid var(--border-color)", background: "white", position: "sticky", top: 0, zIndex: 10 }}>
        <Link href="/doctor/appointments" style={{ color: "var(--text-primary)" }}>
          <ArrowLeft size={20} />
        </Link>
        <h1 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Past Consultation</h1>
        <span className="badge badge-green" style={{ marginLeft: "auto" }}>Completed</span>
      </header>

      <div style={{ padding: "20px 20px 100px" }}>
        {/* Patient Info */}
        <div className="card glass-card" style={{ padding: 20, marginBottom: 16, display: "flex", gap: 16, alignItems: "center" }}>
          <Avatar src={""} name={consultation.patientName} size={56} style={{ borderRadius: 16 }} />
          <div>
            <h2 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 2 }}>{consultation.patientName}</h2>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Patient</p>
          </div>
        </div>

        {/* Date / Time / Clinic */}
        <div className="card glass-card" style={{ padding: 16, marginBottom: 16 }}>
          <h3 style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>Appointment Details</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.875rem", color: "var(--text-secondary)" }}>
              <Calendar size={14} color="var(--green-primary)" />
              <span>{consultation.date ? new Date(consultation.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "—"}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.875rem", color: "var(--text-secondary)" }}>
              <Clock size={14} color="var(--green-primary)" />
              <span>{consultation.time || "—"}</span>
            </div>
            {consultation.clinic && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                <MapPin size={14} color="var(--green-primary)" />
                <span>{consultation.clinic}</span>
              </div>
            )}
          </div>
        </div>

        {/* Diagnosis */}
        <div className="card glass-card" style={{ padding: 20, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <Stethoscope size={20} color="var(--green-primary)" />
            <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>Diagnosis</h3>
          </div>
          <p style={{ fontSize: "0.95rem", color: "var(--text-primary)", fontWeight: 600, background: "var(--green-light)", padding: "12px 16px", borderRadius: 8, borderLeft: "3px solid var(--green-primary)" }}>
            {consultation.diagnosis}
          </p>
        </div>

        {/* Notes */}
        {consultation.notes && (
          <div className="card glass-card" style={{ padding: 20, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <FileText size={20} color="var(--blue-primary)" />
              <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>Clinical Notes</h3>
            </div>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{consultation.notes}</p>
          </div>
        )}

        {/* Prescriptions */}
        {consultation.medications && consultation.medications.length > 0 && (
          <div className="card glass-card" style={{ padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <Pill size={20} color="var(--blue-primary)" />
              <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>Prescriptions Issued</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {consultation.medications.map((med: any, i: number) => (
                <div key={i} style={{ background: "var(--bg-page)", borderRadius: 10, padding: "12px 16px", borderLeft: "3px solid var(--blue-primary)" }}>
                  <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)", marginBottom: 4 }}>{med.name || med.medicationName}</p>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                    {med.dosage} · {med.frequency} · {med.duration}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
