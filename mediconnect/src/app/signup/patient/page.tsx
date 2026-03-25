"use client";
import Link from "next/link";
import Logo from "@/components/shared/Logo";
import { User, Mail, Lock, Phone, ArrowRight, Eye, EyeOff } from "lucide-react";
import styles from "../../login/login.module.css";
import { useState } from "react";
import { fetchApi } from "@/lib/api";
import { useToast } from "@/components/Toast";

export default function PatientSignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match. Please ensure both match precisely.");
    }
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters long.");
    }
    if (phone.length < 9) {
      return toast.error("Please enter a valid phone number.");
    }
    if (!agreedTerms) {
      return toast.error("You must agree to the Terms of Service to proceed.");
    }

    setLoading(true);
    try {
      const res = await fetchApi('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role: 'PATIENT' })
      });
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      toast.success("Account created! Please check your email.");
      setTimeout(() => window.location.href = `/verify-email?email=${encodeURIComponent(email)}`, 1000);
    } catch (err: any) {
      toast.error(err.message || "Account creation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className={`${styles.container} glass-card`}>
        <div className={styles.header}>
          <Logo size="md" />
          <h1 className={styles.title}>Create an Account</h1>
          <p className={styles.subtitle}>Sign up to find and book doctors</p>
        </div>

        <form className={styles.form} onSubmit={handleSignup}>
          <div className="input-icon-wrap">
            <User size={18} className="icon-left" />
            <input type="text" className="input-field" placeholder="e.g. John Doe" required value={name} onChange={e => setName(e.target.value)} />
          </div>

          <div className="input-icon-wrap">
            <Mail size={18} className="icon-left" />
            <input type="email" className="input-field" placeholder="john.doe@example.com" required value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          <div className="input-icon-wrap">
            <Phone size={18} className="icon-left" />
            <input type="tel" className="input-field" placeholder="Phone (e.g. 08012345678)" required value={phone} onChange={e => setPhone(e.target.value)} />
          </div>

          <div className="input-icon-wrap" style={{ position: 'relative' }}>
            <Lock size={18} className="icon-left" />
            <input type={showPassword ? "text" : "password"} className="input-field" placeholder="Secure Password (min. 6 chars)" required value={password} onChange={e => setPassword(e.target.value)} />
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
              id="termsPatient" 
              checked={agreedTerms} 
              onChange={(e) => setAgreedTerms(e.target.checked)} 
              style={{ width: 16, height: 16, cursor: 'pointer' }}
            />
            <label htmlFor="termsPatient" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              I agree to the <Link href="#" className={styles.link}>Terms of Service</Link> and <Link href="#" className={styles.link}>Privacy Policy</Link>
            </label>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%', padding: '16px', marginTop: '8px' }}>
            {loading ? "Creating Account..." : <><span style={{ marginRight: 8 }}>Create Account</span> <ArrowRight size={18} /></>}
          </button>
        </form>

        <p className={styles.bottomText}>
          Already have an account? <Link href="/login?role=patient" className={styles.link}>Login</Link>
        </p>
      </div>
    </main>
  );
}
