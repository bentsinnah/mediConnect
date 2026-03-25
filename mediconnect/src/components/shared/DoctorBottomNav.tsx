"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, User, TrendingUp, Stethoscope } from "lucide-react";
import styles from "./DoctorBottomNav.module.css";

const tabs = [
  { href: "/doctor/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/doctor/appointments", icon: Calendar, label: "Appts" },
  { href: "/doctor/patients", icon: Stethoscope, label: "Patients" },
  { href: "/doctor/earnings", icon: TrendingUp, label: "Earnings" },
  { href: "/doctor/profile", icon: User, label: "Profile" },
];

export default function DoctorBottomNav() {
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
