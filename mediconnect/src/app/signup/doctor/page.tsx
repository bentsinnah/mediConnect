"use client";
import Link from "next/link";
import Logo from "@/components/shared/Logo";
import { User, Mail, Lock, Phone, ArrowRight, Building2, Stethoscope, Eye, EyeOff } from "lucide-react";
import styles from "../../login/login.module.css";
import { useState } from "react";
import { fetchApi } from "@/lib/api";
import { useToast } from "@/components/Toast";

export default function DoctorSignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [clinic, setClinic] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match. Please re-type your password.");
    }
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters long.");
    }
    if (!agreedTerms) {
      return toast.error("You must agree to the Terms of Service to create an account.");
    }

    setLoading(true);
    try {
      const res = await fetchApi('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role: 'DOCTOR', specialty, clinic })
      });
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      toast.success("Account successfully created! Redirecting...");
      setTimeout(() => window.location.href = "/onboarding/doctor", 1000);
    } catch (err: any) {
      toast.error(err.message || "Failed to create account. Please try again.");
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
          <div className="input-icon-wrap">
            <User size={18} className="icon-left" />
            <input type="text" className="input-field" placeholder="Dr. Sarah Johnson" required value={name} onChange={e => setName(e.target.value)} />
          </div>

          <div className="input-icon-wrap">
            <Mail size={18} className="icon-left" />
            <input type="email" className="input-field" placeholder="dr.sarah@hospital.com" required value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          <div className="input-icon-wrap">
            <Stethoscope size={18} className="icon-left" />
            <input type="text" className="input-field" placeholder="e.g. Cardiologist or General Surgeon" required value={specialty} onChange={e => setSpecialty(e.target.value)} />
          </div>

          <div className="input-icon-wrap">
            <Building2 size={18} className="icon-left" />
            <input type="text" className="input-field" placeholder="e.g. Lagos University Teaching Hospital" required value={clinic} onChange={e => setClinic(e.target.value)} />
          </div>

          <div className="input-icon-wrap" style={{ position: 'relative' }}>
            <Lock size={18} className="icon-left" />
            <input type={showPassword ? "text" : "password"} className="input-field" placeholder="Create a secure password (min. 6 chars)" required value={password} onChange={e => setPassword(e.target.value)} />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="input-icon-wrap" style={{ position: 'relative' }}>
            <Lock size={18} className="icon-left" />
            <input type={showConfirmPassword ? "text" : "password"} className="input-field" placeholder="Confirm your secure password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
            <button 
              type="button" 
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, marginBottom: 8 }}>
            <input 
              type="checkbox" 
              id="terms" 
              checked={agreedTerms} 
              onChange={(e) => setAgreedTerms(e.target.checked)} 
              style={{ width: 16, height: 16, cursor: 'pointer' }}
            />
            <label htmlFor="terms" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              I agree to the <Link href="#" className={styles.link}>Terms of Service</Link> and <Link href="#" className={styles.link}>Privacy Policy</Link>
            </label>
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
