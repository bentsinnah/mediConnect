import Link from "next/link";
import { Star, MapPin, Clock } from "lucide-react";
import type { Doctor } from "@/lib/data/doctors";
import Avatar from "@/components/Avatar";
import styles from "./DoctorCard.module.css";

interface DoctorCardProps {
  doctor: Doctor;
  nextSlot?: string;
}

export default function DoctorCard({ doctor, nextSlot }: DoctorCardProps) {
  return (
    <Link href={`/patient/doctors/${doctor.id}`} className={styles.card}>
      <Avatar 
        src={doctor.avatar} 
        name={doctor.name} 
        size={60} 
        className={styles.avatar} 
      />
      <div className={styles.info}>
        <div className={styles.top}>
          <p className={styles.name}>{doctor.name}</p>
          <div className={styles.meta}>
            <span className={styles.rating}>
              <Star size={12} fill="#F59E0B" color="#F59E0B" />
              {doctor.rating}
            </span>
            <span className={styles.dist}>
              <MapPin size={11} />
              {doctor.distance}
            </span>
          </div>
        </div>
        <p className={styles.specialty}>{doctor.specialty}</p>
        {nextSlot && (
          <span className="badge badge-green" style={{ marginTop: 6 }}>
            <Clock size={11} />
            {nextSlot}
          </span>
        )}
      </div>
      <button
        className="btn btn-primary btn-sm"
        onClick={(e) => { e.preventDefault(); window.location.href = `/patient/doctors/${doctor.id}`; }}
      >
        Book
      </button>
    </Link>
  );
}
