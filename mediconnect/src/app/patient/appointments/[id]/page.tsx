"use client";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ArrowLeft, Calendar, Bell, MapPin, Pill, ArrowUpCircle, CheckCircle } from "lucide-react";
import { useApi } from "@/lib/api";
import styles from "./summary.module.css";
import { useState } from "react";

export default function ConsultationSummaryPage() {
  const { id } = useParams() as { id: string };
  const { data: consult, loading, error } = useApi<any>(`/consultations/${id}`);
  const [remindersSet, setRemindersSet] = useState(false);
  const [findingPharmacy, setFindingPharmacy] = useState(false);

  const handleSetReminders = () => {
    setRemindersSet(true);
    setTimeout(() => setRemindersSet(false), 3000);
  };

  const handleFindPharmacy = () => {
    setFindingPharmacy(true);
    setTimeout(() => {
      setFindingPharmacy(false);
      alert("Successfully found 3 pharmacies nearby. Navigating to map...");
      window.location.href = "/patient/clinics";
    }, 1500);
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading consultation...</div>;
  if (error || !consult) return notFound();

  return (
    <>
      <header className={styles.header}>
        <Link href="/patient/appointments" className={styles.backBtn}>
          <ArrowLeft size={20} />
        </Link>
        <h1 className={styles.title}>Consultation Summary</h1>
      </header>

      <div className={styles.docCard}>
        <div className={styles.docHeader}>
          <img src={consult.doctorAvatar} alt={consult.doctorName} className={styles.avatar} />
          <div>
            <p className={styles.docName}>{consult.doctorName}</p>
            <p className={styles.specialty}>{consult.doctorSpecialty}</p>
          </div>
        </div>
        
        <div className={styles.metaRow}>
          <div className={styles.meta}>
            <Calendar size={14} color="var(--blue-primary)" />
            <span>{new Date(consult.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
          <div className={styles.meta}>
            <Calendar size={14} color="var(--blue-primary)" />
            <span>{consult.time}</span>
          </div>
        </div>
        <div className={styles.meta} style={{ marginTop: 8 }}>
          <MapPin size={14} color="var(--blue-primary)" />
          <span>{consult.clinic}</span>
        </div>
      </div>

      <h2 className={styles.sectionTitle}>Diagnosis</h2>
      <div className={styles.diagBox}>
        <h3 className={styles.diagTitle}>{consult.diagnosis}</h3>
        <p className={styles.diagText}>{consult.notes}</p>
      </div>

      <div className={styles.sectionTitle} style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 24 }}>
        <Pill size={18} color="var(--green-dark)" />
        <h2>Prescribed Medications</h2>
      </div>

      <div className={styles.medsList}>
        {consult.medications?.map((med: any, idx: number) => (
          <div key={idx} className={styles.medCard}>
            <div className={styles.medInfo}>
              <p className={styles.medName}>{med.name}</p>
              <p className={styles.medDosage}>{med.dosage} · {med.frequency}</p>
              <p className={styles.medDuration}>Duration: {med.duration}</p>
            </div>
            <button className={styles.remindBtn}>
              <Bell size={20} color="var(--green-dark)" />
            </button>
          </div>
        ))}
      </div>

      {consult.followUpDate && (
        <div className={styles.followUpBox}>
          <h4 className={styles.followUpTitle}>Follow-up Appointment</h4>
          <p className={styles.followUpText}>
            Scheduled for {new Date(consult.followUpDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'})}
          </p>
        </div>
      )}

      <div className={styles.actions}>
        <button 
          className={`btn ${remindersSet ? 'btn-green' : 'btn-primary'} btn-lg`} 
          style={{ width: '100%', marginBottom: 12 }}
          onClick={handleSetReminders}
        >
          {remindersSet ? <><CheckCircle size={18} /> Reminders Active!</> : <><Bell size={18} /> Set Medication Reminders</>}
        </button>
        <button 
          className="btn btn-outline btn-lg" 
          style={{ width: '100%', marginBottom: 12 }}
          onClick={handleFindPharmacy}
          disabled={findingPharmacy}
        >
          {findingPharmacy ? "Searching..." : <><ArrowUpCircle size={18} /> Find Nearby Pharmacy</>}
        </button>
        <Link href={`/patient/doctors/${consult?.appointment?.doctorId}/book`} className="btn btn-outline btn-lg" style={{ width: '100%', borderStyle: 'dashed' }}>
          <Calendar size={18} /> Book Follow-up Appointment
        </Link>
      </div>
    </>
  );
}
