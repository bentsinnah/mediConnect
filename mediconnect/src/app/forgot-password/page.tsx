"use client";
import Link from "next/link";
import { useState } from "react";
import Logo from "@/components/shared/Logo";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";
import styles from "../login/login.module.css";
import { fetchApi } from "@/lib/api";
import { useToast } from "@/components/Toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email.");
    
    setLoading(true);
    try {
      await fetchApi("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email })
      });
      toast.success("Password reset instructions sent to your email.");
      setTimeout(() => window.location.href = "/login", 2000);
    } catch (err: any) {
      toast.error(err.message || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className={`${styles.container} glass-card`}>
        <div className={styles.header}>
          <Logo size="md" />
          <h1 className={styles.title}>Forgot Password</h1>
          <p className={styles.subtitle}>Enter your email to receive reset instructions</p>
        </div>

        <form className={styles.form} onSubmit={handleReset}>
          <div className="input-icon-wrap">
            <Mail size={18} className="icon-left" />
            <input 
              type="email" 
              className="input-field" 
              placeholder="Email Address" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%', padding: '16px', marginTop: '8px' }}>
            {loading ? "Sending..." : <>Reset Password <ArrowRight size={18} /></>}
          </button>
        </form>

        <p className={styles.bottomText}>
          <Link href="/login" className={styles.link} style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>
            <ArrowLeft size={16} /> Back to Login
          </Link>
        </p>
      </div>
    </main>
  );
}
