import { Plus } from "lucide-react";
import styles from "./Logo.module.css";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  dark?: boolean;
}

export default function Logo({ size = "md", dark = false }: LogoProps) {
  return (
    <div className={`${styles.logo} ${styles[size]}`}>
      <span className={styles.medi}>Medi</span>
      <span className={styles.connect}>C<span className={styles.cross}><Plus size={size === "lg" ? 28 : size === "md" ? 20 : 14} strokeWidth={4} /></span>nnect</span>
    </div>
  );
}
