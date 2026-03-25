import Link from "next/link";
import Logo from "@/components/shared/Logo";
import { User, Stethoscope } from "lucide-react";
import styles from "./onboarding.module.css";

export default function OnboardingPage() {
  return (
    <main className="auth-page">
      <div className={styles.container}>
        <Logo size="md" />
        
        <div className={styles.header}>
          <h1 className={styles.title}>Choose your role</h1>
          <p className={styles.subtitle}>How do you want to use MediConnect?</p>
        </div>

        <div className={styles.cards}>
          <Link href="/login?role=patient" className={`${styles.card} glass-card`}>
            <div className={`${styles.iconWrap} ${styles.blue}`}>
              <User size={32} />
            </div>
            <div>
              <h3 className={styles.cardTitle}>I'm a Patient</h3>
              <p className={styles.cardDesc}>Find doctors and book appointments</p>
            </div>
          </Link>

          <Link href="/login?role=doctor" className={`${styles.card} glass-card`}>
            <div className={`${styles.iconWrap} ${styles.green}`}>
              <Stethoscope size={32} />
            </div>
            <div>
              <h3 className={styles.cardTitle}>I'm a Doctor</h3>
              <p className={styles.cardDesc}>Manage patients and consultation</p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
