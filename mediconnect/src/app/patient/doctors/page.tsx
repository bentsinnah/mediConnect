"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, ArrowLeft, SlidersHorizontal, MapPin } from "lucide-react";
import { useApi } from "@/lib/api";
import DoctorCard from "@/components/shared/DoctorCard";
import styles from "./doctors.module.css";

function DoctorListContent() {
  const { data: dbDoctors, loading } = useApi<any[]>('/doctors');
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || "";
  const clinicParam = searchParams.get('clinic') || "";
  const [search, setSearch] = useState(query);
  const [activeSpecialty, setActiveSpecialty] = useState("All");

  useEffect(() => {
    if (query) setSearch(query);
  }, [query]);

  const specialties = ["All", "General Practitioner", "Dermatologist", "Gynaecologist", "Paediatrician", "Cardiologist", "ENT Specialist"];

  const filteredDoctors = (dbDoctors || []).filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase()) || doc.specialty.toLowerCase().includes(search.toLowerCase());
    const matchesSpecialty = activeSpecialty === "All" || doc.specialty === activeSpecialty;
    const matchesClinic = !clinicParam || doc.clinic === clinicParam;
    return matchesSearch && matchesSpecialty && matchesClinic;
  });

  return (
    <>
      <header className={styles.header}>
        <Link href="/patient/dashboard" className={styles.backBtn}>
          <ArrowLeft size={20} />
        </Link>
        <h1 className={styles.title}>Find a Doctor</h1>
      </header>

      <div className={styles.searchRow}>
        <div className={styles.searchWrap}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search by name or specialty..." 
            className={styles.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className={styles.filterBtn}>
          <SlidersHorizontal size={20} />
        </button>
      </div>

      <div className={styles.chipsWrap}>
        <div className="scroll-x">
          {specialties.map(spec => (
            <button 
              key={spec}
              className={`chip ${activeSpecialty === spec ? 'active' : ''}`}
              onClick={() => setActiveSpecialty(spec)}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.resultsHead}>
        <span className={styles.count}>{filteredDoctors.length} doctors found</span>
        {clinicParam && (
          <div className="badge badge-blue" style={{ marginLeft: 8, padding: '6px 12px' }}>
            <MapPin size={12} style={{ marginRight: 4 }} />
            Clinic: {clinicParam}
            <Link href="/patient/doctors" style={{ marginLeft: 8, opacity: 0.6, fontSize: '1rem', lineHeight: 0 }}>×</Link>
          </div>
        )}
      </div>

      <div className={styles.list}>
        {loading ? (
          <p style={{ textAlign: 'center', padding: 20 }}>Loading doctors...</p>
        ) : filteredDoctors.length > 0 ? (
          filteredDoctors.map(doc => (
            <DoctorCard 
              key={doc.id} 
              doctor={doc} 
              nextSlot={doc.availableSlots?.today?.[0] ? `Today ${doc.availableSlots.today[0]}` : "Tomorrow"}
            />
          ))
        ) : (
          <div className="empty-state">
            <Search size={48} className="icon" />
            <h3>No doctors found</h3>
            <p>Try adjusting your filters or search term</p>
          </div>
        )}
      </div>
    </>
  );
}

export default function FindDoctorPage() {
  return (
    <Suspense fallback={<p style={{ padding: 40, textAlign: 'center' }}>Loading doctors...</p>}>
      <DoctorListContent />
    </Suspense>
  );
}
