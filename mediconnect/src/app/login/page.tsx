"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Logo from "@/components/shared/Logo";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import styles from "./login.module.css";
import { Suspense, useState } from "react";
import { fetchApi } from "@/lib/api";
import { useToast } from "@/components/Toast";

function LoginForm() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "patient";
  const dashboardHref = role === "doctor" ? "/doctor/dashboard" : "/patient/dashboard";
  const signupHref = role === "doctor" ? "/signup/doctor" : "/signup/patient";

  const [email, setEmail] = useState(role === "doctor" ? "dr.ogundimu@mediconnect.ng" : "grace.james@mediconnect.ng");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      return toast.error("Please enter a valid email address.");
    }
    
    setLoading(true);
    try {
      const res = await fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      toast.success("Login successful! Welcome back.");
      setTimeout(() => window.location.href = dashboardHref, 1000);
    } catch (err: any) {
      toast.error(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Logo size="md" />
        <h1 className={styles.title}>Login to your account</h1>
        <p className={styles.subtitle}>Welcome back! Please enter your details.</p>
        <div style={{ marginTop: 12 }}>
          <span className={`badge ${role === 'doctor' ? 'badge-green' : 'badge-blue'}`}>
            Logging in as {role === 'doctor' ? 'Doctor' : 'Patient'}
          </span>
        </div>
      </div>

      <form className={styles.form} onSubmit={handleLogin}>
        <div className="input-icon-wrap">
          <Mail size={18} className="icon-left" />
          <input 
            type="email" 
            className="input-field" 
            placeholder={role === "doctor" ? "dr.sarah@hospital.com" : "john.doe@example.com"}
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-icon-wrap" style={{ position: 'relative' }}>
          <Lock size={18} className="icon-left" />
          <input 
            type={showPassword ? "text" : "password"} 
            className="input-field" 
            placeholder="Password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)}
            style={{ 
              position: 'absolute', 
              right: 14, 
              top: '50%', 
              transform: 'translateY(-50%)', 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex'
            }}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input 
              type="checkbox" 
              id="remember" 
              checked={rememberMe} 
              onChange={(e) => setRememberMe(e.target.checked)} 
              style={{ width: 16, height: 16, cursor: 'pointer' }}
            />
            <label htmlFor="remember" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              Remember me
            </label>
          </div>
          <div className={styles.forgot}>
            <Link href="/forgot-password" className={styles.link}>Forgot Password?</Link>
          </div>
        </div>

        <button type="submit" disabled={loading} className={`btn btn-lg ${role === "doctor" ? "btn-green" : "btn-primary"}`} style={{ width: '100%', padding: '16px' }}>
          {loading ? "Logging in..." : <><span style={{ marginRight: 8 }}>Login</span> <ArrowRight size={18} /></>}
        </button>
      </form>

      <div className={styles.divider}>
        <span className="divider">or continue with</span>
      </div>

      <div className={styles.social}>
        <button type="button" className={styles.socialBtn} onClick={() => window.location.href = dashboardHref}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        </button>
      </div>

      <p className={styles.bottomText}>
        Don't have an account? <Link href={signupHref} className={styles.link}>Sign Up</Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="auth-page">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
