"use client";
import Link from "next/link";
import { ArrowLeft, Calendar, HeartPulse, MapPin, Stethoscope, Languages, Bell, LogOut, ChevronRight, Edit3, Shield, Plus } from "lucide-react";
import Avatar from "@/components/Avatar";
import styles from "./profile.module.css";
import { useEffect, useState } from "react";

export default function PatientProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) setUser(JSON.parse(u));
  }, []);
  return (
    <>
      <header className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/patient/dashboard" className={styles.backBtn}>
            <ArrowLeft size={20} />
          </Link>
          <h1 className={styles.title}>Profile</h1>
        </div>
      </header>

      <div className={styles.userCard}>
        <div className={styles.profileBgIcon}><Plus size={40} strokeWidth={3} /></div>
        <Avatar 
          src={user?.avatar || "https://api.dicebear.com/7.x/personas/svg?seed=pat"} 
          name={user?.name || "Patient"} 
          size={80} 
          className={styles.avatar} 
        />
        <h2 className={styles.name}>{user?.name || "Patient"}</h2>
        <p className={styles.email}>{user?.email || "patient@mediconnect.com"}</p>
      </div>

      <div className={styles.menuList}>
        <Link href="/patient/profile/edit" className={styles.menuItem}>
          <div className={styles.menuIcon}><Edit3 size={18} /></div>
          <span className={styles.menuText}>Edit Profile Details</span>
          <ChevronRight size={20} color="var(--text-muted)" />
        </Link>
        <Link href="/patient/appointments" className={styles.menuItem}>
          <div className={styles.menuIcon}><Calendar size={18} /></div>
          <span className={styles.menuText}>Consultation History</span>
          <ChevronRight size={20} color="var(--text-muted)" />
        </Link>
        <Link href="/patient/profile/medical-history" className={styles.menuItem}>
          <div className={styles.menuIcon}><Shield size={18} color="var(--blue-primary)" /></div>
          <span className={styles.menuText}>Medical History</span>
          <ChevronRight size={20} color="var(--text-muted)" />
        </Link>
        <Link href="/patient/health" className={styles.menuItem}>
          <div className={styles.menuIcon}><HeartPulse size={18} /></div>
          <span className={styles.menuText}>Health Dashboard</span>
          <ChevronRight size={20} color="var(--text-muted)" />
        </Link>
        <Link href="/patient/clinics" className={styles.menuItem}>
          <div className={styles.menuIcon}><MapPin size={18} /></div>
          <span className={styles.menuText}>Nearby Clinics</span>
          <ChevronRight size={20} color="var(--text-muted)" />
        </Link>
        <Link href="/signup/doctor" className={styles.menuItem}>
          <div className={styles.menuIcon}><Stethoscope size={18} /></div>
          <span className={styles.menuText}>Join as a Doctor</span>
          <ChevronRight size={20} color="var(--text-muted)" />
        </Link>
        
        <div className={styles.menuItem} onClick={() => alert('Feature coming soon: Language Settings')} style={{ cursor: 'pointer' }}>
          <div className={styles.menuIcon}><Languages size={18} /></div>
          <span className={styles.menuText}>Language</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>English</span>
            <ChevronRight size={20} color="var(--text-muted)" />
          </div>
        </div>
        
        <div className={`${styles.menuItem} ${styles.noBorder}`}>
          <div className={styles.menuIcon}><Bell size={18} /></div>
          <span className={styles.menuText}>Notification</span>
          <div className={styles.toggle}>
            <div className={styles.toggleKnob}></div>
          </div>
        </div>
      </div>

      <div className={styles.promoCard}>
        <div className={`${styles.menuIcon} ${styles.greenIcon}`}><Stethoscope size={24} /></div>
        <div className={styles.promoTextGroup}>
          <h4 className={styles.promoTitle}>Are you a doctor?</h4>
          <p className={styles.promoText}>Register to join our platform</p>
        </div>
        <Link href="/signup/doctor" className={styles.promoBtn}>Join <ArrowLeft size={16} className={styles.flipArrow} /></Link>
      </div>

      <button className={styles.logoutBtn} onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href = "/"; }}>
        <LogOut size={18} /> Log Out
      </button>
    </>
  );
}
