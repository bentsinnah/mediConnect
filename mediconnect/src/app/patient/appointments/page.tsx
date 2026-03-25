"use client";
import Link from "next/link";
import { Calendar as CalIcon, MapPin, ArrowLeft, ChevronLeft, ChevronRight, XCircle, Clock } from "lucide-react";
import { useApi, fetchApi } from "@/lib/api";
import { useToast } from "@/components/Toast";
import Avatar from "@/components/Avatar";
import styles from "./appointments.module.css";
import { useState } from "react";

export default function PatientAppointmentsPage() {
  const [filter, setFilter] = useState("All");
  const [actioning, setActioning] = useState<string | null>(null);
  const { data: dbAppointments, loading, refetch } = useApi<any[]>('/appointments');

  const filteredAppts = (dbAppointments || []).filter(appt => {
    if (filter === "All") return true;
    return appt.status.toLowerCase() === filter.toLowerCase();
  });

  const [cancelModal, setCancelModal] = useState<{id: string, name: string} | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const { toast } = useToast();

  const handleCancelConfirm = async () => {
    if (!cancelModal) return;
    const { id, name } = cancelModal;
    
    setActioning(id);
    try {
      await fetchApi(`/appointments/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'cancelled', reason: cancelReason || 'Cancelled by patient' })
      });
      toast.success(`Successfully cancelled appointment with ${name}`);
      refetch();
    } catch (err: any) {
      toast.error("Failed to cancel: " + err.message);
    } finally {
      setActioning(null);
      setCancelModal(null);
      setCancelReason("");
    }
  };

  const statusBadge = (status: string) => {
    const map: any = {
      upcoming: 'badge-blue',
      completed: 'badge-green',
      cancelled: 'badge-red',
      declined: 'badge-red'
    };
    return map[status] || 'badge-blue';
  };

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();
  const today = currentDate.getDate();
  const daysInMonth = new Date(currentYear, currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentDate.getMonth(), 1).getDay();
  const apptDates = new Set((dbAppointments || []).map((a: any) => new Date(a.date).getDate()));
  const mockCalendar = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <>
      <header className={styles.header}>
        <Link href="/patient/dashboard" className={styles.backBtn}>
          <ArrowLeft size={20} />
        </Link>
        <h1 className={styles.title}>My Appointments</h1>
      </header>

      <div className={styles.calCard}>
        <div className={styles.calHeader}>
          <button className={styles.iconBtn}><ChevronLeft size={20} /></button>
          <span className={styles.month}>{currentMonth} {currentYear}</span>
          <button className={styles.iconBtn}><ChevronRight size={20} /></button>
        </div>
        
        <div className={styles.weekDays}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className={styles.weekDay}>{d}</div>
          ))}
        </div>

        <div className={styles.daysGrid}>
          {Array(firstDayOfMonth).fill(null).map((_, i) => <div key={`empty-${i}`} />)}
          {mockCalendar.map(day => {
            const isToday = day === today;
            const hasAppt = apptDates.has(day);
            return (
              <div 
                key={day} 
                className={`${styles.day} ${isToday ? styles.today : ''} ${hasAppt ? styles.hasAppt : ''}`}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.section}>
        <div className="section-header" style={{ marginBottom: 16, flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
          <h2 className="section-title">My Appointments</h2>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {["All", "Upcoming", "Completed", "Cancelled"].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`chip ${filter === f ? 'active green' : ''}`}
                style={{ fontSize: '0.75rem', padding: '6px 14px' }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        
        <div className={styles.list}>
          {loading ? (
            <p style={{ textAlign: 'center', padding: 20 }}>Loading appointments...</p>
          ) : filteredAppts.length > 0 ? (
            filteredAppts.map(appt => (
              <div key={appt.id} className="card glass-card" style={{ padding: 16, marginBottom: 12, borderRadius: 16, border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <Avatar src={appt.doctorAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${appt.doctorName}`} name={appt.doctorName} size={48} style={{ borderRadius: 12 }} />
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>{appt.doctorName}</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{appt.type === 'virtual' ? '🎥 Virtual Consult' : '🏥 In-Person Consult'}</p>
                    </div>
                  </div>
                  <span className={`badge ${statusBadge(appt.status)}`}>{appt.status}</span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <CalIcon size={14} color="var(--blue-primary)" />
                    <span>{new Date(appt.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <Clock size={14} color="var(--blue-primary)" />
                    <span>{appt.time}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: 'var(--text-secondary)', width: '100%' }}>
                    <MapPin size={14} color="var(--blue-primary)" />
                    <span>{appt.clinic}</span>
                  </div>
                </div>

                {appt.status === "completed" && appt.diagnosis && (
                  <div style={{ background: 'var(--bg-page)', padding: 12, borderRadius: 8, fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: 16, borderLeft: '3px solid var(--green-primary)' }}>
                    <span style={{ fontWeight: 600 }}>Diagnosis:</span> {appt.diagnosis}
                  </div>
                )}

                <div style={{ display: 'flex', gap: 8 }}>
                  {appt.status === 'upcoming' && (
                    <button 
                      onClick={() => setCancelModal({ id: appt.id, name: appt.doctorName })}
                      disabled={actioning === appt.id}
                      className="btn btn-outline" 
                      style={{ flex: 1, padding: 10, color: '#EF4444', borderColor: '#FCA5A5', fontSize: '0.85rem' }}
                    >
                      {actioning === appt.id ? 'Cancelling...' : <><XCircle size={16} style={{ marginRight: 6 }} /> Cancel</>}
                    </button>
                  )}
                  {appt.status === 'completed' && appt.consultationId && (
                    <Link href={`/patient/appointments/${appt.consultationId}`} className="btn btn-primary" style={{ flex: 1, padding: 10, fontSize: '0.85rem', textAlign: 'center' }}>
                      View Results
                    </Link>
                  )}
                  {appt.status === 'completed' && !appt.consultationId && (
                    <Link href={`/patient/appointments/${appt.id}`} className="btn btn-outline" style={{ flex: 1, padding: 10, fontSize: '0.85rem', textAlign: 'center' }}>
                      View Details
                    </Link>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', padding: 20 }}>No appointments found.</p>
          )}
        </div>
      </div>
      
      <div style={{ marginTop: 24, marginBottom: 40 }}>
         <Link href="/patient/doctors" className="btn btn-primary btn-lg" style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
           + Book New Appointment
         </Link>
      </div>

      {cancelModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="card glass-card" style={{ width: '90%', maxWidth: 400, padding: 24, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 12 }}>Cancel Appointment</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
              Please provide a reason for cancelling your appointment with {cancelModal.name}.
            </p>
            <textarea
              className="input-field"
              placeholder="e.g. Schedule conflict, feeling better..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              style={{ minHeight: 100, marginBottom: 16, width: '100%', resize: 'vertical' }}
              autoFocus
            />
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => { setCancelModal(null); setCancelReason(""); }}>Back</button>
              <button className="btn btn-primary" style={{ flex: 1, background: '#EF4444', borderColor: '#EF4444' }} onClick={handleCancelConfirm} disabled={actioning !== null}>
                Submit Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
