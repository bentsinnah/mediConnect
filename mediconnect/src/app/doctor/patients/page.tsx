"use client";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import Avatar from "@/components/Avatar";
import { useApi } from "@/lib/api";
import { useState } from "react";

export default function DoctorPatientsPage() {
  const { data: appointments, loading } = useApi<any[]>('/appointments');
  const [search, setSearch] = useState("");

  const patientsMap = new Map<string, any>();
  
  if (appointments) {
    appointments.forEach(apt => {
      // Use patientId from the formatted response
      const pid = apt.patientId;
      if (pid && !patientsMap.has(pid)) {
        patientsMap.set(pid, {
          id: pid,
          name: apt.patientName,
          avatar: apt.patientAvatar,
          email: apt.patientEmail,
          lastVisit: apt.date,
          visitCount: 1
        });
      } else if (pid && patientsMap.has(pid)) {
        const existing = patientsMap.get(pid);
        existing.visitCount += 1;
        // Keep the most recent date
        if (new Date(apt.date) > new Date(existing.lastVisit)) {
          existing.lastVisit = apt.date;
        }
      }
    });
  }

  const allPatients = Array.from(patientsMap.values());
  const uniquePatients = allPatients.filter(p => 
    !search || p.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <header className="section-header" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/doctor/dashboard" className="btn btn-outline" style={{ padding: 8, height: 40 }}>
            <ArrowLeft size={20} />
          </Link>
          <h1 style={{ fontSize: '1.3rem', fontWeight: 700 }}>My Patients</h1>
        </div>
        <span className="badge badge-green">{allPatients.length} total</span>
      </header>

      <div style={{ position: 'relative', marginBottom: 24 }}>
        <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input 
          type="text" 
          placeholder="Search patients by name..." 
          className="input-field"
          style={{ paddingLeft: 44, background: 'white' }}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      
      {loading ? (
        <div style={{ padding: 40, textAlign: 'center' }}>Loading patients...</div>
      ) : uniquePatients.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>
          {search ? 'No patients match your search.' : "You don't have any patients yet."}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {uniquePatients.map((p: any) => (
            <Link href={`/doctor/patients/${p.id}?name=${encodeURIComponent(p.name || '')}`} key={p.id} style={{ 
              background: 'white', 
              padding: 16, 
              borderRadius: 16, 
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              textDecoration: 'none'
            }}>
              <Avatar src={p.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${p.name}`} name={p.name} size={56} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>{p.name}</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--green-primary)', fontWeight: 600, background: 'var(--green-light)', padding: '2px 8px', borderRadius: 12 }}>
                    {p.visitCount} {p.visitCount === 1 ? 'visit' : 'visits'}
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 4 }}>Registered Patient</p>
                {p.lastVisit && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Last visit: {new Date(p.lastVisit).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
