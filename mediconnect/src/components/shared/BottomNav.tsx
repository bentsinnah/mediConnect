"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Calendar, Activity, User } from "lucide-react";
import styles from "./BottomNav.module.css";

const tabs = [
  { href: "/patient/dashboard", icon: Home, label: "Home" },
  { href: "/patient/doctors", icon: Search, label: "Doctors" },
  { href: "/patient/appointments", icon: Calendar, label: "Appts" },
  { href: "/patient/health", icon: Activity, label: "Health" },
  { href: "/patient/profile", icon: User, label: "Profile" },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className={styles.nav}>
      {tabs.map(({ href, icon: Icon, label }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link key={href} href={href} className={`${styles.tab} ${active ? styles.active : ""}`}>
            <Icon size={22} strokeWidth={active ? 2.2 : 1.8} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
