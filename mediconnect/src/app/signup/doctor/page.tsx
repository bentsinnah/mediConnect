"use client";
import Link from "next/link";
import Logo from "@/components/shared/Logo";
import { User, Mail, Lock, Phone, ArrowRight, Building2, Stethoscope, Eye, EyeOff } from "lucide-react";
import styles from "../../login/login.module.css";
import { useState } from "react";
import { fetchApi } from "@/lib/api";

export default function DoctorSignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [clinic, setClinic] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetchApi('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role: 'DOCTOR', specialty, clinic })
      });
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      window.location.href = "/onboarding/doctor";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className={`${styles.container} glass-card`}>
        <div className={styles.header}>
          <Logo size="md" />
          <h1 className={styles.title}>Join as a Doctor</h1>
          <p className={styles.subtitle}>Register to manage patients and consultations</p>
        </div>

        <form className={styles.form} onSubmit={handleSignup}>
          {error && <div className="badge badge-red" style={{ marginBottom: 16, width: '100%' }}>{error}</div>}

          <div className="input-icon-wrap">
            <User size={18} className="icon-left" />
            <input type="text" className="input-field" placeholder="Full Name (with Title)" required value={name} onChange={e => setName(e.target.value)} />
          </div>

          <div className="input-icon-wrap">
            <Mail size={18} className="icon-left" />
            <input type="email" className="input-field" placeholder="Email Address" required value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          <div className="input-icon-wrap">
            <Stethoscope size={18} className="icon-left" />
            <input type="text" className="input-field" placeholder="Specialty (e.g. Cardiologist)" required value={specialty} onChange={e => setSpecialty(e.target.value)} />
          </div>

          <div className="input-icon-wrap">
            <Building2 size={18} className="icon-left" />
            <input type="text" className="input-field" placeholder="Clinic / Hospital Name" required value={clinic} onChange={e => setClinic(e.target.value)} />
          </div>

          <div className="input-icon-wrap" style={{ position: 'relative' }}>
            <Lock size={18} className="icon-left" />
            <input type={showPassword ? "text" : "password"} className="input-field" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button type="submit" disabled={loading} className="btn btn-green btn-lg" style={{ width: '100%', padding: '16px', marginTop: '8px' }}>
            {loading ? "Creating Account..." : <><span style={{ marginRight: 8 }}>Create Account</span> <ArrowRight size={18} /></>}
          </button>
        </form>

        <p className={styles.bottomText}>
          Already have an account? <Link href="/login?role=doctor" className={styles.link}>Login</Link>
        </p>
      </div>
    </main>
  );
}
