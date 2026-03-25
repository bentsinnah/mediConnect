"use client";
import Link from "next/link";
import { ArrowLeft, MapPin, Star, Users } from "lucide-react";
import { useApi } from "@/lib/api";

export default function NearbyClinicsPage() {
  const { data: clinicsData, loading } = useApi<any[]>('/clinics');
  const clinics = clinicsData || [];

  return (
    <>
      <header className="section-header" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/patient/dashboard" className="btn btn-outline" style={{ padding: 8, height: 40 }}>
            <ArrowLeft size={20} />
          </Link>
          <h1 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Nearby Clinics</h1>
        </div>
      </header>
      
      <div className="empty-state" style={{ background: 'white', borderRadius: 16, border: '1px solid var(--border-color)', minHeight: 200, marginBottom: 24 }}>
        <MapPin size={48} color="var(--blue-primary)" style={{ opacity: 0.5 }} />
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: 16 }}>Find health centers</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: 280 }}>
          Discover partner clinics and book top specialists instantly.
        </p>
      </div>

      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>Partner Clinics nearby</h3>
      
      {loading ? (
        <div style={{ padding: 40, textAlign: 'center' }}>Loading clinics...</div>
      ) : clinics.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>No clinics found.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {clinics.map(clinic => (
            <Link 
              key={clinic.name} 
              href={`/patient/doctors?clinic=${encodeURIComponent(clinic.name)}`}
              style={{ 
                background: 'white', padding: 16, borderRadius: 16, border: '1px solid var(--border-color)',
                display: 'block', textDecoration: 'none', transition: 'all 0.2s'
              }}
              className="card"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <h4 style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{clinic.name}</h4>
                <span style={{ fontSize: '0.8rem', color: 'var(--blue-primary)', fontWeight: 600 }}>1.2km</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 12 }}>{clinic.clinicAddress || 'Address not provided'}</p>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Star size={14} fill="#F59E0B" color="#F59E0B" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>4.5</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)' }}>
                    <Users size={14} />
                    <span style={{ fontSize: '0.85rem' }}>{clinic._count?.user || 1} Doctors</span>
                  </div>
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--blue-primary)', fontWeight: 600 }}>See Specialists →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
