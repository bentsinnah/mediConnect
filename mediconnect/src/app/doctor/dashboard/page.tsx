"use client";
import Link from "next/link";
import { Bell, Users, Wallet, Calendar, ArrowRight, User } from "lucide-react";
import { useApi } from "@/lib/api";
import { useState, useEffect } from "react";
import Avatar from "@/components/Avatar";
import styles from "./dashboard.module.css";

export default function DoctorDashboard() {
  const { data: dbAppointments, loading } = useApi<any[]>('/appointments');
  
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const rawUser = localStorage.getItem('user');
    if (rawUser) setUser(JSON.parse(rawUser));
  }, []);

  const todayAppts = (dbAppointments || []).filter(a => {
    const isToday = new Date(a.date).toDateString() === new Date().toDateString();
    return isToday || a.status === "upcoming"; // Fallback demo logic assuming upcoming are today
  });

  return (
    <>
      <header className={styles.header}>
        <div className={styles.userInfo}>
          <Avatar 
            src={user?.avatar || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80"} 
            name={user?.name || "Doctor"} 
            size={52} 
            className={styles.avatar} 
          />
          <div>
            <p className={styles.greeting}>Good Morning,</p>
            <h1 className={styles.name}>{user?.name ? (user.name.startsWith('Dr.') ? user.name : `Dr. ${user.name}`) : 'Doctor'}</h1>
          </div>
        </div>
        <Link href="/doctor/notifications" className={styles.bellBtn} style={{ color: 'inherit' }}>
          <Bell size={20} />
          <span className="notif-dot" style={{ background: 'var(--green-accent)' }} />
        </Link>
      </header>

      <div className={styles.statsGrid}>
        <div className={styles.statCard} style={{ background: 'var(--green-primary)', color: 'white', border: 'none' }}>
          <div className={styles.statTop}>
            <div className={styles.statIconWrap} style={{ background: 'rgba(255,255,255,0.2)' }}><Users size={20} color="white" /></div>
          </div>
          <p className={styles.statValue}>{todayAppts.length}</p>
          <p className={styles.statLabel} style={{ color: 'rgba(255,255,255,0.9)' }}>Today's Patients</p>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statTop}>
            <div className={styles.statIconWrap} style={{ background: 'var(--green-light)' }}><Wallet size={20} color="var(--green-dark)" /></div>
          </div>
          <p className={styles.statValue} style={{ color: 'var(--text-primary)' }}>₦{todayAppts.length * 15}k</p>
          <p className={styles.statLabel}>Est. Earnings</p>
        </div>
      </div>

      <div className={styles.section}>
        <div className="section-header">
          <h2 className="section-title">Today's Appointments</h2>
          <Link href="/doctor/appointments" className="section-link" style={{ color: 'var(--green-primary)' }}>See all &gt;</Link>
        </div>

        <div className={styles.list}>
          {loading ? (
            <p style={{ textAlign: 'center', padding: 20 }}>Loading appointments...</p>
          ) : todayAppts.length > 0 ? (
            todayAppts.map((appt, i) => (
              <div key={appt.id} className={styles.apptCard}>
                <div className={styles.apptTimeWrap}>
                  <span className={styles.apptTime}>{appt.time.replace("Today ", "")}</span>
                  <div className={styles.timeLine}></div>
                </div>
                <div className={`${styles.apptContent} ${i === 0 ? 'glass-card' : ''}`} style={i === 0 ? { border: '1.5px solid var(--green-primary)' } : {}}>
                  <div className={styles.patientInfo}>
                     <div style={{ position: 'relative' }}>
                      <Avatar src={appt.patientAvatar || "https://api.dicebear.com/7.x/personas/svg?seed=pat"} name={appt.patientName} size={48} className={styles.patientAvatar} />
                      {i === 0 && <span style={{ position: 'absolute', top: -4, right: -4, background: 'var(--green-primary)', color: 'white', fontSize: '0.6rem', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>LIVE</span>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p className={styles.patientName}>{appt.patientName}</p>
                      <p className={styles.apptType}>{appt.type || "General Checkup"} · {appt.duration || "30m"}</p>
                    </div>
                  </div>
                  {i === 0 ? (
                    <Link href={`/doctor/appointments/${appt.id}/consult`} className={`btn btn-green ${styles.startBtn}`}>
                      Start Consultation
                    </Link>
                  ) : (
                    <button className={`btn ${styles.waitBtn}`} disabled>Waiting</button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', padding: 20 }}>No scheduled appointments today.</p>
          )}
        </div>
      </div>
    </>
  );
}


