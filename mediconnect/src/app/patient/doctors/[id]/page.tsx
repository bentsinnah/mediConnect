"use client";
import React, { useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ArrowLeft, Star, MapPin, Wallet, Globe, Calendar as CalIcon } from "lucide-react";
import { useApi, fetchApi } from "@/lib/api";
import styles from "./detail.module.css";

export default function DoctorProfilePage() {
  const { id } = useParams() as { id: string };
  const { data: doctor, loading, error } = useApi<any>(`/doctors/${id}`);

  const [selectedDay, setSelectedDay] = useState<"today" | "tomorrow" | "dayAfter">("today");
  const [selectedTime, setSelectedTime] = useState("");

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading doctor profile...</div>;
  if (error || !doctor) return notFound();
  const handleBooking = async () => {
    if (!selectedTime) return;
    const payload = {
      doctorId: doctor.user.id,
      date: new Date(Date.now() + ({today:0, tomorrow:86400000, dayAfter:172800000}[selectedDay as string] || 0)).toISOString().split('T')[0],
      time: selectedTime,
      type: "virtual",
      clinic: doctor.clinic
    };
    console.log("Booking Payload:", payload);
    // Redirect to payment with all necessary data
    const query = new URLSearchParams({
      docId: doctor.user.id,
      amount: doctor.fee.toString(),
      date: payload.date,
      time: payload.time,
      clinic: doctor.clinic,
      type: "virtual"
    }).toString();
    
    window.location.href = `/patient/payment?${query}`;
  };

  return (
    <>
      <header className={styles.header}>
        <Link href="/patient/doctors" className={styles.backBtn}>
          <ArrowLeft size={20} />
        </Link>
        <h1 className={styles.title}>Doctor Profile</h1>
      </header>

      <div className={styles.topCard}>
        <div className={styles.docHeader}>
          <img src={doctor.user?.avatar || "https://api.dicebear.com/7.x/personas/svg?seed=dr"} alt={doctor.user?.name || "Doctor"} className={styles.avatar} />
          <div className={styles.docInfo}>
            <h2 className={styles.name}>{doctor.user?.name}</h2>
            <p className={styles.specialty}>{doctor.specialty}</p>
            <div className={styles.ratingRow}>
              <Star size={14} fill="#F59E0B" color="#F59E0B" />
              <span className={styles.ratingVal}>{doctor.rating}</span>
              <span className={styles.reviews}>({doctor.reviews})</span>
            </div>
          </div>
        </div>

        <div className={styles.statsRow}>
          <div className={styles.statBox}>
            <div className={`${styles.iconCirc} ${styles.blue}`}><MapPin size={18} /></div>
            <span>{doctor.distance}</span>
          </div>
          <div className={styles.statBox}>
            <div className={`${styles.iconCirc} ${styles.blue}`}><Wallet size={18} /></div>
            <span>₦{(doctor.fee || 0).toLocaleString()}</span>
          </div>
          <div className={styles.statBox}>
            <div className={`${styles.iconCirc} ${styles.blue}`}><Globe size={18} /></div>
            <span>{doctor.languages?.length || 0} Lang</span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>About</h3>
        <p className={styles.aboutText}>{doctor.about || 'No bio available for this doctor.'}</p>
      </div>

      <div className={styles.clinicCard}>
        <h4 className={styles.clinicName}>{doctor.clinic}</h4>
        <p className={styles.clinicDist}>
          <MapPin size={14} /> {doctor.distance || 'N/A'} away
        </p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CalIcon size={20} color="var(--blue-primary)" /> Available Times
        </h3>
        
        <div className={styles.tabsWrap}>
          <div className="scroll-x">
            <button 
              className={`time-slot ${selectedDay === 'today' ? 'selected' : ''}`}
              onClick={() => { setSelectedDay('today'); setSelectedTime(''); }}
              style={{ padding: '10px 24px', flex: 1 }}
            >
              Today
            </button>
            <button 
              className={`time-slot ${selectedDay === 'tomorrow' ? 'selected' : ''}`}
              onClick={() => { setSelectedDay('tomorrow'); setSelectedTime(''); }}
              style={{ padding: '10px 24px', flex: 1 }}
            >
              Tomorrow
            </button>
            <button 
              className={`time-slot ${selectedDay === 'dayAfter' ? 'selected' : ''}`}
              onClick={() => { setSelectedDay('dayAfter'); setSelectedTime(''); }}
              style={{ padding: '10px 24px', flex: 1 }}
            >
              Day After
            </button>
          </div>
        </div>

        <div className={styles.timeGrid}>
          {doctor.availabilitySlots?.filter((s: any) => {
            const todayDay = new Date().getDay();
            const dayMap: any = { 
              today: todayDay, 
              tomorrow: (todayDay + 1) % 7, 
              dayAfter: (todayDay + 2) % 7 
            };
            return s.dayOfWeek === dayMap[selectedDay];
          }).map((slot: any, i: number) => (
            <button 
              key={slot.id || i}
              className={`time-slot ${selectedTime === slot.startTime ? 'selected' : ''}`}
              onClick={() => setSelectedTime(slot.startTime)}
            >
              {slot.startTime}
            </button>
          ))}
          {(!doctor.availabilitySlots || doctor.availabilitySlots.filter((s: any) => {
             const todayDay = new Date().getDay();
             const dayMap: any = { today: todayDay, tomorrow: (todayDay + 1) % 7, dayAfter: (todayDay + 2) % 7 };
             return s.dayOfWeek === dayMap[selectedDay];
          }).length === 0) && (
            <p className={styles.noSlots}>No slots available for this day.</p>
          )}
        </div>
      </div>

      <div className={styles.footerWrap}>
        <button 
          className={`btn btn-lg ${selectedTime ? 'btn-primary' : ''}`}
          style={{ width: '100%', background: !selectedTime ? 'var(--blue-light)' : '', color: !selectedTime ? 'var(--blue-primary)' : '' }}
          onClick={handleBooking}
          disabled={!selectedTime}
        >
          {selectedTime ? `Book at ${selectedTime}` : "Select a time slot"}
        </button>
      </div>
    </>
  );
}
