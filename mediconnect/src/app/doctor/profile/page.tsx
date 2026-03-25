"use client";
import Link from "next/link";
import { ArrowLeft, Edit3, Settings, Shield, HelpCircle, LogOut, ChevronRight } from "lucide-react";
import Avatar from "@/components/Avatar";
import { useApi } from "@/lib/api";
import styles from "../../patient/profile/profile.module.css"; 

export default function DoctorProfilePage() {
  const { data: user, loading } = useApi<any>('/profile');

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading profile...</div>;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = "/";
  };

  return (
    <>
      <header className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/doctor/dashboard" className={styles.backBtn}>
            <ArrowLeft size={20} />
          </Link>
          <h1 className={styles.title}>Doctor Profile</h1>
        </div>
      </header>

      <div className={`${styles.userCard} glass-card`} style={{ borderColor: 'var(--green-primary)' }}>
        <Avatar 
          src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} 
          name={user?.name} 
          size={84} 
          className={styles.avatar}
          style={{ border: '3px solid var(--green-light)' }} 
        />
        <h2 className={styles.name}>{user?.name}</h2>
        <p className={styles.email}>{user?.email}</p>
        <span className="badge badge-green" style={{ marginTop: 8 }}>{user?.doctorProfile?.specialty || 'Specialist'}</span>
      </div>

      <div className={styles.menuList}>
        <Link href="/doctor/profile/edit" className={styles.menuItem}>
          <div className={styles.menuIcon}><Edit3 size={18} /></div>
          <span className={styles.menuText}>Edit Profile Details</span>
          <ChevronRight size={20} color="var(--text-muted)" />
        </Link>
        <Link href="/doctor/settings" className={styles.menuItem}>
          <div className={styles.menuIcon}><Settings size={18} /></div>
          <span className={styles.menuText}>Clinic Settings & Availability</span>
          <ChevronRight size={20} color="var(--text-muted)" />
        </Link>
        <Link href="/doctor/settings/security" className={styles.menuItem}>
          <div className={styles.menuIcon}><Shield size={18} /></div>
          <span className={styles.menuText}>Security & Passwords</span>
          <ChevronRight size={20} color="var(--text-muted)" />
        </Link>
        <Link href="/doctor/settings/help" className={`${styles.menuItem} ${styles.noBorder}`}>
          <div className={styles.menuIcon}><HelpCircle size={18} /></div>
          <span className={styles.menuText}>Help & Support</span>
          <ChevronRight size={20} color="var(--text-muted)" />
        </Link>
      </div>

      <button className={styles.logoutBtn} onClick={handleLogout} style={{ background: '#FEE2E2', color: '#EF4444' }}>
        <LogOut size={18} /> Log Out
      </button>
    </>
  );
}
