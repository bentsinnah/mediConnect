"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, MapPin, Bell, Activity, Stethoscope, ChevronDown, Hand } from "lucide-react";
import { useApi } from "@/lib/api";
import DoctorCard from "@/components/shared/DoctorCard";
import Avatar from "@/components/Avatar";
import styles from "./dashboard.module.css";

export default function PatientDashboard() {
  const { data: fetchDoctors, loading } = useApi<any[]>('/doctors');
  const { data: healthData, loading: healthLoading } = useApi<any>('/health');
  const featuredDoctors = fetchDoctors ? fetchDoctors.slice(0, 3) : [];
  const { data: userProfile } = useApi<any>('/profile');
  
  const latestHeartRate = healthData?.rawMetrics?.find((h: any) => h.type === 'HEART_RATE')?.value || "--";
  const latestWeight = healthData?.weight?.data?.length > 0 
    ? healthData.weight.data[healthData.weight.data.length - 1].value 
    : userProfile?.patientProfile?.weight || "--";
  
  const [location, setLocation] = useState("Lagos");
  const [isLocOpen, setIsLocOpen] = useState(false);
  const locations = ["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Kano"];

  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const rawUser = localStorage.getItem('user');
    if (rawUser) setUser(JSON.parse(rawUser));
  }, []);

  useEffect(() => {
    if (userProfile?.patientProfile?.address) {
      setLocation(userProfile.patientProfile.address);
    }
  }, [userProfile]);

  const { data: dbAppointments } = useApi<any[]>('/appointments');
  const upcomingAppt = (dbAppointments || []).find(a => a.status === 'upcoming');

  const displayName = userProfile?.name || user?.name || "Patient";

  return (
    <>
      <header className={styles.header}>
        <div className={styles.userInfo} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ position: 'relative' }}>
            <Avatar 
              src={userProfile?.avatar || user?.avatar || "https://images.unsplash.com/photo-1531123897727-8f129e1bf98c?w=100&q=80"} 
              name={displayName} 
              size={52} 
              className={styles.avatar}
              style={{ border: '2px solid var(--blue-primary)', padding: 2 }} 
            />
            <span style={{ position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, background: '#22C55E', border: '2px solid white', borderRadius: '50%' }}></span>
          </div>
          <div>
            <p className={styles.greeting}>Hello {displayName.split(' ')[0]}! <Hand size={18} className={styles.handIcon} style={{ display: 'inline-block', verticalAlign: 'middle', color: '#FCD34D' }} /></p>
            <h1 className={styles.name}>Find Your Doctor</h1>
          </div>
        </div>
        <div className={styles.actions}>
          <div className={styles.locationWrap} onClick={() => setIsLocOpen(!isLocOpen)} style={{ cursor: 'pointer', position: 'relative' }}>
            <MapPin size={16} className={styles.locIcon} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{location}</span>
            <ChevronDown size={14} style={{ opacity: 0.6 }} />
            
            {isLocOpen && (
              <div style={{ 
                position: 'absolute', top: '100%', right: 0, marginTop: 8, 
                background: 'white', borderRadius: 12, boxShadow: 'var(--shadow-lg)', 
                border: '1px solid var(--border-color)', zIndex: 100, minWidth: 140,
                overflow: 'hidden'
              }}>
                {locations.map(loc => (
                  <div 
                    key={loc} 
                    onClick={(e) => { e.stopPropagation(); setLocation(loc); setIsLocOpen(false); }}
                    style={{ 
                      padding: '12px 16px', fontSize: '0.85rem', fontWeight: 600, 
                      background: location === loc ? 'var(--blue-light)' : 'transparent',
                      color: location === loc ? 'var(--blue-primary)' : 'var(--text-primary)',
                      cursor: 'pointer', borderBottom: '1px solid var(--bg-page)'
                    }}
                  >
                    {loc}
                  </div>
                ))}
              </div>
            )}
          </div>
          <Link href="/patient/notifications" className={styles.bellBtn} style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, background: 'white', borderRadius: '50%', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
            <Bell size={20} />
            <span className="notif-dot" />
          </Link>
        </div>
      </header>

      <div className={styles.searchWrap}>
        <Search size={20} className={styles.searchIcon} />
        <input 
          type="text" 
          placeholder="Search Doctors" 
          className={styles.searchInput}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const val = (e.target as HTMLInputElement).value;
              window.location.href = `/patient/doctors?q=${encodeURIComponent(val)}`;
            }
          }}
        />
      </div>

      {upcomingAppt && (
        <div className={styles.section} style={{ marginTop: 24 }}>
          <div className="section-header">
            <h2 className="section-title">Upcoming Appointment</h2>
            <Link href="/patient/appointments" className="section-link">View all &gt;</Link>
          </div>
          <div className="card glass-card" style={{ padding: 16, display: 'flex', gap: 16, alignItems: 'center', background: 'linear-gradient(135deg, var(--blue-primary), #3B82F6)', color: 'white', border: 'none' }}>
            <div className={styles.iconCircle} style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
              <Activity size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 4 }}>{upcomingAppt.doctorName}</h3>
              <p style={{ fontSize: '0.8rem', opacity: 0.9 }}>{upcomingAppt.date} · {upcomingAppt.time}</p>
            </div>
            <Link href="/patient/appointments" className="btn btn-sm" style={{ background: 'white', color: 'var(--blue-primary)', fontWeight: 700 }}>
              Details
            </Link>
          </div>
        </div>
      )}

      <div className={styles.quickActions}>
        <Link href="/patient/doctors" className={styles.actionCard}>
          <div className={`${styles.iconCircle} ${styles.green}`}>
            <Stethoscope size={28} />
          </div>
          <span className={styles.actionText}>Find Doctor<br/>Now</span>
        </Link>
        
        <Link href="/patient/clinics" className={styles.actionCard}>
          <div className={`${styles.iconCircle} ${styles.orange}`}>
            <MapPin size={28} />
          </div>
          <span className={styles.actionText}>Nearby<br/>Clinics</span>
        </Link>

        <Link href="/patient/symptoms" className={styles.actionCard}>
          <div className={`${styles.iconCircle} ${styles.blue}`}>
            <Activity size={28} />
          </div>
          <span className={styles.actionText}>Check<br/>Symptoms</span>
        </Link>
      </div>

      <div className={styles.section}>
        <div className="section-header">
          <h2 className="section-title">Health Overview</h2>
          <Link href="/patient/health" className="section-link">Details &gt;</Link>
        </div>
        
        <div className={styles.statsGrid}>
          <div className={`${styles.healthCard} glass-card`}>
            <div className={styles.statHeader}>
              <Activity size={16} color="var(--blue-primary)" />
              <span>Heart Rate</span>
            </div>
            <div className={styles.statValue}>
              {healthLoading ? "..." : latestHeartRate} <span className={styles.statUnit}>bpm</span>
            </div>
          </div>
          
          <div className={`${styles.healthCard} glass-card`}>
            <div className={styles.statHeader}>
              <Activity size={16} color="var(--green-primary)" />
              <span>Current Weight</span>
            </div>
            <div className={styles.statValue}>
              {healthLoading ? "..." : latestWeight} <span className={styles.statUnit}>kg</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className="section-header">
          <h2 className="section-title">Available Doctor Near You</h2>
          <Link href="/patient/doctors" className="section-link">See all &gt;</Link>
        </div>
        
        <div className={styles.doctorList}>
          {loading ? (
            <p style={{ textAlign: 'center', padding: 20 }}>Loading doctors...</p>
          ) : featuredDoctors.length > 0 ? (
            featuredDoctors.map(doc => (
              <DoctorCard 
                key={doc.id} 
                doctor={doc} 
                nextSlot={doc.availableSlots?.today?.[0] ? `Today ${doc.availableSlots.today[0]}` : "Tomorrow"}
              />
            ))
          ) : (
            <p style={{ textAlign: 'center', padding: 20 }}>No doctors found.</p>
          )}
        </div>
      </div>
    </>
  );
}


