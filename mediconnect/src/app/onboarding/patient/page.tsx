"use client";
import { useState } from "react";
import { ArrowRight, Activity, MapPin } from "lucide-react";
import Logo from "@/components/shared/Logo";
import { fetchApi } from "@/lib/api";
import styles from "../../login/login.module.css";

export default function PatientOnboardingPage() {
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [weight, setWeight] = useState("");
  
  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Update Profile Location & Blood Group
      if (address || bloodGroup) {
        await fetchApi('/profile', {
          method: 'PATCH',
          body: JSON.stringify({ address, bloodGroup })
        });
      }

      // 2. Submit initial Health Metric if provided
      if (weight) {
        await fetchApi('/health', {
          method: 'POST',
          body: JSON.stringify({
            type: "WEIGHT",
            value: parseFloat(weight)
          })
        });
      }

      // 3. Update local user data
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { 
        ...user, 
        patientProfile: { 
          ...user.patientProfile, 
          address, 
          bloodGroup, 
          weight 
        } 
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      window.location.href = "/patient/dashboard";
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const skipOnboarding = () => {
    window.location.href = "/patient/dashboard";
  };

  return (
    <main className="auth-page">
      <div className={`${styles.container} glass-card`} style={{ maxWidth: 500 }}>
        <div className={styles.header}>
          <Logo size="md" />
          <h1 className={styles.title}>Complete your Profile</h1>
          <p className={styles.subtitle}>Provide basic health details for better care</p>
        </div>

        <form className={styles.form} onSubmit={handleComplete}>
          <div className="input-icon-wrap" style={{ marginBottom: 16 }}>
            <MapPin size={18} className="icon-left" />
            <input 
              type="text" 
              className="input-field" 
              placeholder="City / Region (e.g. Lagos)" 
              value={address} 
              onChange={e => setAddress(e.target.value)} 
            />
          </div>

          <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Blood Group</label>
              <select 
                className="input-field" 
                value={bloodGroup} 
                onChange={e => setBloodGroup(e.target.value)}
                style={{ width: '100%' }}
              >
                 <option value="">Select...</option>
                 <option value="A+">A+</option>
                 <option value="A-">A-</option>
                 <option value="B+">B+</option>
                 <option value="B-">B-</option>
                 <option value="O+">O+</option>
                 <option value="O-">O-</option>
                 <option value="AB+">AB+</option>
                 <option value="AB-">AB-</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Current Weight (kg)</label>
              <div className="input-icon-wrap">
                <Activity size={18} className="icon-left" />
                <input 
                  type="number" 
                  className="input-field" 
                  placeholder="e.g 70" 
                  value={weight} 
                  onChange={e => setWeight(e.target.value)} 
                />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%', padding: '16px', marginBottom: 12 }}>
            {loading ? "Saving..." : <><span style={{ marginRight: 8 }}>Save & Continue</span> <ArrowRight size={18} /></>}
          </button>
          
          <button type="button" onClick={skipOnboarding} className="btn" style={{ width: '100%', background: 'transparent', color: 'var(--text-muted)', border: 'none' }}>
            Skip for now
          </button>
        </form>
      </div>
    </main>
  );
}
