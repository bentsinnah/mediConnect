"use client";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { ArrowLeft, Activity, HeartPulse, Thermometer, Weight, Save, Droplet, Moon, ChevronRight, FileText } from "lucide-react";
import Avatar from "@/components/Avatar";
import styles from "./vitals.module.css";
import { useState } from "react";
import { useApi, fetchApi } from "@/lib/api";
import { useToast } from "@/components/Toast";

export default function DoctorUpdateVitalsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const name = searchParams.get("name") || "Patient";
  
  const [loading, setLoading] = useState(false);
  const [bpSys, setBpSys] = useState("120");
  const [bpDia, setBpDia] = useState("80");
  const [temp, setTemp] = useState("37.0");
  const [weight, setWeight] = useState("70");
  const [water, setWater] = useState("8");
  const [sleep, setSleep] = useState("7");
  const { toast } = useToast();

  const { data: fetchConsults } = useApi<any[]>('/consultations');
  const pastConsults = (fetchConsults || []).filter(c => c.appointment.patient.id === id);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const metrics = [
        { type: "BP_SYSTOLIC", value: parseFloat(bpSys), patientId: id },
        { type: "BP_DIASTOLIC", value: parseFloat(bpDia), patientId: id },
        { type: "TEMPERATURE", value: parseFloat(temp), patientId: id },
        { type: "WEIGHT", value: parseFloat(weight), patientId: id },
        { type: "WATER", value: parseFloat(water), patientId: id },
        { type: "SLEEP", value: parseFloat(sleep), patientId: id },
      ];
      
      for (const m of metrics) {
        await fetchApi('/health', {
          method: 'POST',
          body: JSON.stringify(m)
        });
      }
      
      toast.success("Patient full health profile successfully updated in DB.");
      setTimeout(() => window.location.href = "/doctor/patients", 1500);
    } catch (err: any) {
      toast.error("Failed to save: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/doctor/patients" className={styles.backBtn}>
            <ArrowLeft size={20} />
          </Link>
          <h1 className={styles.title}>Update Health Profile</h1>
        </div>
      </header>

      <div className={`${styles.patientBanner} glass-card`}>
        <Avatar src={`https://api.dicebear.com/7.x/initials/svg?seed=${name}`} name={name} size={60} className={styles.avatar} />
        <div>
          <p className={styles.label}>Patient Profile</p>
          <p className={styles.patientName}>{name}</p>
          <p className={styles.label} style={{ marginTop: 2 }}>ID: {id.slice(-6).toUpperCase()}</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <form onSubmit={handleUpdate} className={styles.formContainer} style={{ flex: '1 1 500px' }}>
          <div className={styles.sectionHeader}>
            <Activity size={20} color="var(--green-primary)" />
            <h2>Log Today's Health Data</h2>
          </div>

          <div className={styles.grid}>
            <div className="card glass-card" style={{ padding: 20 }}>
              <div className={styles.inputHeader}>
                <HeartPulse size={18} color="var(--blue-primary)" />
                <label>Blood Pressure</label>
              </div>
              <div className={styles.inputGroup}>
                <input type="number" className="input-field" placeholder="120" value={bpSys} onChange={e=>setBpSys(e.target.value)} required />
                <span className={styles.divider}>/</span>
                <input type="number" className="input-field" placeholder="80" value={bpDia} onChange={e=>setBpDia(e.target.value)} required />
                <span className={styles.unit}>mmHg</span>
              </div>
            </div>

            <div className="card glass-card" style={{ padding: 20 }}>
              <div className={styles.inputHeader}>
                <Thermometer size={18} color="var(--orange)" />
                <label>Body Temp</label>
              </div>
              <div className={styles.inputGroup}>
                <input type="number" step="0.1" className="input-field" placeholder="36.5" value={temp} onChange={e=>setTemp(e.target.value)} required />
                <span className={styles.unit}>°C</span>
              </div>
            </div>

            <div className="card glass-card" style={{ padding: 20 }}>
              <div className={styles.inputHeader}>
                <Weight size={18} color="var(--purple)" />
                <label>Body Weight</label>
              </div>
              <div className={styles.inputGroup}>
                <input type="number" step="0.5" className="input-field" placeholder="65" value={weight} onChange={e=>setWeight(e.target.value)} required />
                <span className={styles.unit}>kg</span>
              </div>
            </div>

            <div className="card glass-card" style={{ padding: 20 }}>
              <div className={styles.inputHeader}>
                <Droplet size={18} color="var(--blue-primary)" />
                <label>Water Intake</label>
              </div>
              <div className={styles.inputGroup}>
                <input type="number" step="1" className="input-field" placeholder="8" value={water} onChange={e=>setWater(e.target.value)} required />
                <span className={styles.unit}>glasses</span>
              </div>
            </div>

            <div className="card glass-card" style={{ padding: 20 }}>
              <div className={styles.inputHeader}>
                <Moon size={18} color="var(--purple)" />
                <label>Sleep</label>
              </div>
              <div className={styles.inputGroup}>
                <input type="number" step="1" className="input-field" placeholder="7" value={sleep} onChange={e=>setSleep(e.target.value)} required />
                <span className={styles.unit}>hrs</span>
              </div>
            </div>
          </div>

          <div className="card glass-card" style={{ padding: 20, marginTop: 12 }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>
              Primary Diagnosis / Condition
            </label>
            <input 
              type="text"
              className="input-field" 
              placeholder="e.g. Hypertension (Stage 1), Type 2 Diabetes"
              defaultValue="Hypertension - Managed"
            />
          </div>

          <div className="card glass-card" style={{ padding: 20, marginTop: 12 }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>
              Medical Advice & Prescription
            </label>
            <textarea 
              className="input-field" 
              placeholder="Enter prescription or lifestyle advice..."
              style={{ minHeight: 120, resize: 'vertical' }}
              defaultValue="Continue Lisinopril 10mg daily. Reduce sodium intake."
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-green btn-lg" 
            style={{ width: '100%', marginTop: 16 }}
            disabled={loading}
          >
            {loading ? "Saving..." : <><Save size={18} /> Sync to Patient Health Repo</>}
          </button>
        </form>

        <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: 16, marginTop: 24 }}>
          <div className={styles.sectionHeader}>
            <FileText size={20} color="var(--text-primary)" />
            <h2>Patient Consultation History</h2>
          </div>
          
          {pastConsults.length > 0 ? (
            pastConsults.map(consult => (
              <div key={consult.id} className="card glass-card" style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {new Date(consult.createdAt).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>Dr. {consult.appointment.doctor.name.split(' ').pop()}</span>
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--blue-dark)', marginBottom: 8 }}>{consult.diagnosis}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>"{consult.notes}"</p>
                {consult.prescriptions?.length > 0 && (
                  <div style={{ marginTop: 12, padding: 12, background: 'var(--bg-page)', borderRadius: 8 }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>Prescriptions:</p>
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {consult.prescriptions.map((p: any) => (
                        <li key={p.id} style={{ marginBottom: 4 }}>• {p.medicationName} ({p.dosage})</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="card glass-card" style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
              No past consultations found for this patient.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
