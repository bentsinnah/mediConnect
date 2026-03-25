"use client";
import Link from "next/link";
import { useSearchParams, useParams } from "next/navigation";
import { CheckCircle2, Calendar, MapPin, ArrowRight } from "lucide-react";
import { useApi } from "@/lib/api";
import styles from "./confirmed.module.css";
import { Suspense } from "react";

function ConfirmationContent() {
  const { id } = useParams() as { id: string };
  const searchParams = useSearchParams();
  const { data: doctor, loading } = useApi<any>(`/doctors/${id}`);
  
  const date = searchParams.get('date') || "Today";
  const time = searchParams.get('time') || "scheduled time";

  if (loading) return <div style={{ padding: 60, textAlign: 'center' }}>Confirming appointment...</div>;
  if (!doctor) return (
    <div style={{ padding: 60, textAlign: 'center' }}>
      <p>Error finding doctor info, but your booking was successful!</p>
      <Link href="/patient/appointments" className="btn btn-primary" style={{ marginTop: 20 }}>View Appointments</Link>
    </div>
  );

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
            <img src={doctor.user?.avatar || "https://api.dicebear.com/7.x/personas/svg?seed=dr"} alt={doctor.user?.name} className={styles.avatar} />
            <div>
              <p className={styles.name}>{doctor.user?.name}</p>
              <p className={styles.specialty}>{doctor.specialty}</p>
            </div>
          </div>

          <div className={styles.details}>
            <div className={styles.detailRow}>
              <Calendar size={18} color="var(--blue-primary)" />
              <span>{date} at {time}</span>
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

export default function BookingConfirmedPage() {
  return (
    <Suspense fallback={<div style={{ padding: 60, textAlign: 'center' }}>Loading confirmation...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
