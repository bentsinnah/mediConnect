"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle2, Calendar, MapPin, ArrowRight } from "lucide-react";
import { getDoctorById } from "@/lib/data/doctors";
import styles from "./confirmed.module.css";

export default function BookingConfirmedPage() {
  const { id } = useParams() as { id: string };
  const doctor = getDoctorById(id);

  if (!doctor) return null;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.iconWrap}>
          <CheckCircle2 size={80} color="var(--green-accent)" strokeWidth={1.5} />
        </div>
        
        <h1 className={styles.title}>Booking Confirmed!</h1>
        <p className={styles.subtitle}>Your appointment has been successfully scheduled.</p>

        <div className={styles.card}>
          <div className={styles.docInfo}>
            <img src={doctor.avatar} alt={doctor.name} className={styles.avatar} />
            <div>
              <p className={styles.name}>{doctor.name}</p>
              <p className={styles.specialty}>{doctor.specialty}</p>
            </div>
          </div>

          <div className={styles.details}>
            <div className={styles.detailRow}>
              <Calendar size={18} color="var(--blue-primary)" />
              <span>Tomorrow at {doctor.availableSlots.tomorrow[0] || "10:00 AM"}</span>
            </div>
            <div className={styles.detailRow}>
              <MapPin size={18} color="var(--blue-primary)" />
              <span>{doctor.clinic}</span>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <Link href="/patient/appointments" className="btn btn-primary btn-lg" style={{ width: '100%', marginBottom: 12 }}>
            View Appointments
          </Link>
          <Link href="/patient/dashboard" className="btn btn-outline btn-lg" style={{ width: '100%' }}>
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
