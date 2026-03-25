"use client";
import Link from "next/link";
import Logo from "@/components/shared/Logo";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";
import styles from "../login/login.module.css";

export default function ForgotPasswordPage() {
  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Password reset instructions sent to your email.");
    window.location.href = "/login";
  };

  return (
    <main className="auth-page">
      <div className={styles.container}>
        <div className={styles.header}>
          <Logo size="md" />
          <h1 className={styles.title}>Forgot Password</h1>
          <p className={styles.subtitle}>Enter your email to receive reset instructions</p>
        </div>

        <form className={styles.form} onSubmit={handleReset}>
          <div className="input-icon-wrap">
            <Mail size={18} className="icon-left" />
            <input type="email" className="input-field" placeholder="Email Address" required />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', padding: '16px', marginTop: '8px' }}>
            Reset Password <ArrowRight size={18} />
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
