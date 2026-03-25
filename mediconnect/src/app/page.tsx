import Image from "next/image";
import Link from "next/link";
import Logo from "@/components/shared/Logo";
import styles from "./page.module.css";

export default function SplashPage() {
  return (
    <main className="auth-page">
      <div className={styles.container}>
        <div className={styles.top}>
          <Logo size="lg" />
        </div>

        <div className={styles.mainContent}>
          <div className={styles.content}>
            <h1 className={styles.title}>
              Get healthcare,<br />
              <span style={{ color: "var(--blue-primary)" }}>Faster and easier.</span>
            </h1>
            <p className={styles.subtitle}>
              Find nearby hospitals, check symptoms and book appointment in minutes.
            </p>

            <Link href="/onboarding" className="btn btn-primary btn-lg" style={{ width: 'max-content', padding: '18px 32px' }}>
              Get started
            </Link>
          </div>

          <div className={styles.imageWrap}>
            <Image
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1000&q=80"
              alt="MediConnect Interface"
              width={600}
              height={450}
              className={styles.image}
              priority
            />
          </div>
        </div>
      </div>
    </main>
  );
}
