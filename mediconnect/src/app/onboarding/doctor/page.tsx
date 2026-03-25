"use client";
import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import Logo from "@/components/shared/Logo";
import { fetchApi } from "@/lib/api";
import styles from "../../login/login.module.css";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function DoctorOnboardingPage() {
  const [loading, setLoading] = useState(false);
  const [baseFee, setBaseFee] = useState("15000");
  const [selectedDays, setSelectedDays] = useState<string[]>(["Monday", "Wednesday", "Friday"]);
  
  const toggleDay = (day: string) => {
    setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Update Profile Fee
      await fetchApi('/profile', {
        method: 'PATCH',
        body: JSON.stringify({ baseFee: parseFloat(baseFee) })
      });

      // 2. Set Default Slots for selected days
      const slots = selectedDays.map((day, i) => ({
        dayOfWeek: (DAYS.indexOf(day) + 1) % 7, // 0 = Sun, 1 = Mon
        startTime: "09:00",
        endTime: "17:00",
        isActive: true
      }));

      await fetchApi('/settings', {
        method: 'PATCH',
        body: JSON.stringify({ slots, isAvailable: true })
      });

      // 3. Update local user data
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { 
        ...user, 
        doctorProfile: { 
          ...user.doctorProfile, 
          fee: parseFloat(baseFee)
        } 
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      window.location.href = "/doctor/dashboard";
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className={`${styles.container} glass-card`} style={{ maxWidth: 600 }}>
        <div className={styles.header}>
          <Logo size="md" />
          <h1 className={styles.title}>Set up your Schedule</h1>
          <p className={styles.subtitle}>Let patients know when you are available</p>
        </div>

        <form className={styles.form} onSubmit={handleComplete}>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Base Consultation Fee (₦)</label>
            <input 
              type="number" 
              className="input-field" 
              value={baseFee} 
              onChange={e => setBaseFee(e.target.value)} 
              required
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: 32 }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Working Days</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 10 }}>
              {DAYS.map(day => {
                const isSelected = selectedDays.includes(day);
                return (
                  <div 
                    key={day}
                    onClick={() => toggleDay(day)}
                    style={{
                      padding: '12px',
                      borderRadius: '12px',
                      border: `1.5px solid ${isSelected ? 'var(--green-primary)' : 'var(--border-color)'}`,
                      background: isSelected ? 'var(--green-light)' : 'transparent',
                      color: isSelected ? 'var(--green-dark)' : 'var(--text-secondary)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s'
                    }}
                  >
                    {day}
                    {isSelected && <Check size={16} />}
                  </div>
                );
              })}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 12 }}>
              Default hours (9 AM - 5 PM) will be applied. You can fully customize specific times for each day in your Clinic Settings later.
            </p>
          </div>

          <button type="submit" disabled={loading} className="btn btn-green btn-lg" style={{ width: '100%', padding: '16px' }}>
            {loading ? "Saving..." : <><span style={{ marginRight: 8 }}>Complete Setup</span> <ArrowRight size={18} /></>}
          </button>
        </form>
      </div>
    </main>
  );
}
