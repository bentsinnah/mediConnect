"use client";
import Link from "next/link";
import { ArrowLeft, Search, SlidersHorizontal, Calendar as CalIcon, MapPin, Clock, CheckCircle, XCircle, ChevronRight } from "lucide-react";
import { useApi, fetchApi } from "@/lib/api";
import { useToast } from "@/components/Toast";
import Avatar from "@/components/Avatar";
import styles from "./appointments.module.css";
import { useState } from "react";

export default function DoctorAppointmentsPage() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [actioning, setActioning] = useState<string | null>(null);
  const { data: dbAppointments, loading, refetch } = useApi<any[]>('/appointments');

  const filteredAppts = (dbAppointments || []).filter(appt => {
    const matchesFilter = filter === "All" || appt.status.toLowerCase() === filter.toLowerCase() || (filter === "Today" && new Date(appt.date).toDateString() === new Date().toDateString());
    const matchesSearch = !search || appt.patientName?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const [declineModal, setDeclineModal] = useState<{id: string, name: string} | null>(null);
  const [declineReason, setDeclineReason] = useState("");
  const { toast } = useToast();

  const handleDeclineConfirm = async () => {
    if (!declineModal) return;
    const { id, name } = declineModal;

    setActioning(id);
    try {
      await fetchApi(`/appointments/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'declined', reason: declineReason || 'Schedule conflict' })
      });
      toast.success(`Successfully declined appointment with ${name}`);
      refetch();
    } catch (err: any) {
      toast.error("Failed to update: " + err.message);
    } finally {
      setActioning(null);
      setDeclineModal(null);
      setDeclineReason("");
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

  return (
    <>
      <header className={styles.header}>
        <Link href="/doctor/dashboard" className={styles.backBtn}>
          <ArrowLeft size={20} />
        </Link>
        <h1 className={styles.title}>Appointments</h1>
      </header>

      <div className={styles.searchRow}>
        <div className={styles.searchWrap}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search patients..." 
            className={styles.searchInput}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.chipsWrap}>
        <div className="scroll-x">
          {["All", "Today", "Upcoming", "Completed", "Cancelled"].map(status => (
            <button 
              key={status}
              onClick={() => setFilter(status)}
              className={`chip ${filter === status ? 'active green' : ''}`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.list}>
        {loading ? (
          <p style={{ textAlign: 'center', padding: 20 }}>Loading appointments...</p>
        ) : filteredAppts.length > 0 ? (
          filteredAppts.map(appt => (
            <div key={appt.id} className={styles.card}>
              <div className={styles.cardTop}>
                <Avatar src={appt.patientAvatar || "https://api.dicebear.com/7.x/personas/svg?seed=pat"} name={appt.patientName} size={48} className={styles.avatar} />
                <div className={styles.patientInfo}>
                  <p className={styles.name}>{appt.patientName}</p>
                  <div className={styles.metaRow}>
                    <span className={styles.type}>{appt.type === 'virtual' ? '🎥 Virtual' : '🏥 In-Person'}</span>
                    <span className={styles.duration}>· {appt.duration || "30m"}</span>
                  </div>
                </div>
                <span className={`badge ${statusBadge(appt.status)}`}>{appt.status}</span>
              </div>

              <div className={styles.detailsRow}>
                <div className={styles.detail}>
                  <CalIcon size={16} color="var(--green-primary)" />
                  <span>{new Date(appt.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <div className={styles.detail}>
                  <Clock size={16} color="var(--green-primary)" />
                  <span>{appt.time}</span>
                </div>
                <div className={styles.detail}>
                  <MapPin size={16} color="var(--green-primary)" />
                  <span>{appt.clinic}</span>
                </div>
              </div>

              {appt.status === 'upcoming' && (
                <div className={styles.actions}>
                  <Link href={`/doctor/appointments/${appt.id}/consult`} className="btn btn-green" style={{ flex: 1, padding: 12, textAlign: 'center' }}>
                    Start Consult
                  </Link>
                  <button 
                    className="btn btn-outline" 
                    style={{ flex: 1, padding: 12, color: '#EF4444', borderColor: '#FCA5A5' }}
                    disabled={actioning === appt.id}
                    onClick={() => setDeclineModal({ id: appt.id, name: appt.patientName })}
                  >
                    <XCircle size={16} /> Decline
                  </button>
                </div>
              )}
              {appt.status === 'completed' && appt.consultationId && (
                <Link href={`/doctor/appointments/${appt.id}/view`} className="btn btn-outline" style={{ width: '100%', padding: 12, marginTop: 8, textAlign: 'center' }}>
                  <ChevronRight size={16} /> View Consultation
                </Link>
              )}
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', padding: 20 }}>No appointments found.</p>
        )}
      </div>

      {declineModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="card glass-card" style={{ width: '90%', maxWidth: 400, padding: 24, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 12 }}>Decline Appointment</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
              Please provide a reason for declining the appointment request from {declineModal.name}.
            </p>
            <textarea
              className="input-field"
              placeholder="e.g. Schedule conflict, clinic closed..."
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              style={{ minHeight: 100, marginBottom: 16, width: '100%', resize: 'vertical' }}
              autoFocus
            />
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => { setDeclineModal(null); setDeclineReason(""); }}>Back</button>
              <button className="btn btn-primary" style={{ flex: 1, background: '#EF4444', borderColor: '#EF4444' }} onClick={handleDeclineConfirm} disabled={actioning !== null}>
                Submit Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
