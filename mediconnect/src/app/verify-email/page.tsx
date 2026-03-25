"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/shared/Logo";
import { Mail, ShieldCheck, RefreshCw, ArrowRight } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { useToast } from "@/components/Toast";
import styles from "./verify.module.css";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";
  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [verified, setVerified] = useState(false);
  const { toast } = useToast();

  const otpString = otp.join("");

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    // Auto-advance to next input
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      if (next) (next as HTMLInputElement).focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      if (prev) (prev as HTMLInputElement).focus();
    }
  };

  const handleVerify = async () => {
    if (otpString.length !== 6) return toast.error("Please enter all 6 digits.");
    if (!email) return toast.error("Email is required.");
    setLoading(true);
    try {
      await fetchApi("/auth/verify-email", {
        method: "POST",
        body: JSON.stringify({ email, otp: otpString }),
      });
      setVerified(true);
      toast.success("Email verified successfully! Welcome to MediConnect.");
    } catch (err: any) {
      toast.error(err.message || "Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return toast.error("Please enter your email address.");
    setResending(true);
    try {
      await fetchApi("/auth/resend-verification", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      toast.success("A new code has been sent to your email.");
    } catch (err: any) {
      toast.error(err.message || "Failed to resend. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <Logo size="md" />

        {verified ? (
          <div className={styles.successState}>
            <div className={styles.successIcon}>
              <ShieldCheck size={48} color="var(--green-primary)" />
            </div>
            <h1 className={styles.title}>Email Verified! 🎉</h1>
            <p className={styles.subtitle}>
              Your account is now fully activated. You can now log in and start using MediConnect.
            </p>
            <Link href="/login" className="btn btn-primary btn-lg" style={{ width: "100%", textAlign: "center" }}>
              Go to Login <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <>
            <div className={styles.iconWrap}>
              <Mail size={36} color="var(--blue-primary)" />
            </div>
            <h1 className={styles.title}>Check Your Email</h1>
            <p className={styles.subtitle}>
              We sent a 6-digit verification code to <strong>{email || "your email"}</strong>. Enter it below.
            </p>

            {!emailParam && (
              <input
                type="email"
                className="input-field"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ marginBottom: 16 }}
              />
            )}

            <div className={styles.otpRow}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  className={styles.otpInput}
                  autoFocus={i === 0}
                />
              ))}
            </div>

            <button
              onClick={handleVerify}
              disabled={loading || otpString.length !== 6}
              className="btn btn-primary btn-lg"
              style={{ width: "100%", marginBottom: 16 }}
            >
              {loading ? "Verifying..." : <><ShieldCheck size={18} style={{ marginRight: 8 }} /> Verify Email</>}
            </button>

            <button
              onClick={handleResend}
              disabled={resending}
              className="btn btn-outline"
              style={{ width: "100%", display: "flex", gap: 8, justifyContent: "center" }}
            >
              <RefreshCw size={16} className={resending ? "spin" : ""} />
              {resending ? "Sending..." : "Resend Code"}
            </button>

            <p className={styles.bottomText}>
              Already verified? <Link href="/login" className={styles.link}>Log In</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <main className="auth-page">
      <Suspense fallback={<div style={{ padding: 40, textAlign: "center" }}>Loading...</div>}>
        <VerifyEmailContent />
      </Suspense>
    </main>
  );
}
