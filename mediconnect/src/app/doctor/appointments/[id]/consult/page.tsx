"use client";
import Link from "next/link";
import { ArrowLeft, Mic, Save, Plus, FileText, Pill, Trash2 } from "lucide-react";
import Avatar from "@/components/Avatar"; // Added Avatar import
import styles from "./consult.module.css";
import { useState } from "react";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import { fetchApi, useApi } from "@/lib/api";
import { useParams } from "next/navigation";

export default function DoctorConsultationPage() {
  const { id } = useParams() as { id: string };
  const { data: appointment } = useApi<any>(`/appointments/${id}`);
  const [notes, setNotes] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const [prescriptions, setPrescriptions] = useState([{ name: "", dosage: "", frequency: "", duration: "" }]);

  const { isListening, toggleListening } = useSpeechToText((transcript: string) => {
    setNotes(prev => prev ? `${prev} ${transcript}` : transcript);
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes || !diagnosis) {
      alert("Notes and Diagnosis are required");
      return;
    }
    
    setSaving(true);
    try {
      // Filter out empty prescriptions
      const validPrescriptions = prescriptions
        .filter(p => p.name.trim())
        .map(p => ({
          medicationName: p.name,
          dosage: p.dosage || "As directed",
          frequency: p.frequency || "Daily",
          duration: p.duration || "N/A"
        }));

      await fetchApi('/consultations', {
        method: 'POST',
        body: JSON.stringify({
          appointmentId: id,
          diagnosis,
          notes,
          medications: validPrescriptions
        })
      });
      toast.success("Consultation saved successfully! Appointment marked as completed.");
      setTimeout(() => window.location.href = "/doctor/dashboard", 1000);
    } catch (err: any) {
      toast.error("Failed to save: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const addPrescriptionRow = () => {
    setPrescriptions([...prescriptions, { name: "", dosage: "", frequency: "", duration: "" }]);
  };

  const updatePrescription = (index: number, field: string, value: string) => {
    const newP = [...prescriptions];
    newP[index] = { ...newP[index], [field]: value };
    setPrescriptions(newP);
  };

  const removePrescription = (index: number) => {
    const newP = prescriptions.filter((_, i) => i !== index);
    setPrescriptions(newP);
  };

  return (
    <>
      <header className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/doctor/dashboard" className={styles.backBtn}>
            <ArrowLeft size={20} />
          </Link>
          <h1 className={styles.title}>Write Consultation</h1>
        </div>
        <button type="button" className={styles.micBtn} onClick={toggleListening}>
          <Mic size={20} color={isListening ? "var(--red)" : "var(--green-dark)"} className={isListening ? 'pulse' : ''} />
          <span style={{ color: isListening ? "var(--red)" : "var(--green-dark)", fontWeight: 700 }}>
            {isListening ? "Recording..." : "Voice Dictation"}
          </span>
        </button>
      </header>

      <div className={styles.patientBanner}>
        <img src={appointment?.patient?.avatar || "https://images.unsplash.com/photo-1531123897727-8f129e1bf98c?w=100&q=80"} alt={appointment?.patient?.name} className={styles.avatar} />
        <div>
          <p className={styles.label}>Consultation for</p>
          <p className={styles.patientName}>{appointment?.patient?.name || "Loading..."}</p>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <p className={styles.label}>Slot Time</p>
          <p className={styles.vitalsText}>{appointment?.date} · {appointment?.time}</p>
        </div>
      </div>

      <form onSubmit={handleSave} className={styles.formContainer}>
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <FileText size={20} color="var(--green-primary)" />
            <h2>Clinical Notes & Diagnosis</h2>
          </div>
          <input 
            type="text"
            className="input-field"
            placeholder="Main Diagnosis (e.g., Acute Bronchitis)"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            required
            style={{ marginBottom: 12 }}
          />
          <textarea 
            className={styles.textArea}
            placeholder="Type or dictate your detailed clinical notes and observations here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            required
          />
        </div>

        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Pill size={20} color="var(--blue-primary)" />
              <h2>Prescriptions</h2>
            </div>
            <button type="button" className={styles.addBtn} onClick={addPrescriptionRow}><Plus size={16} /> Add Med</button>
          </div>
          
          {prescriptions.map((p, index) => (
            <div key={index} className={styles.medRow} style={{ position: 'relative', marginBottom: 12 }}>
              <input type="text" className="input-field" placeholder="Medication Name" value={p.name} onChange={e => updatePrescription(index, 'name', e.target.value)} />
              <input type="text" className="input-field" placeholder="Dosage" value={p.dosage} onChange={e => updatePrescription(index, 'dosage', e.target.value)} />
              <input type="text" className="input-field" placeholder="Freq" value={p.frequency} onChange={e => updatePrescription(index, 'frequency', e.target.value)} />
              <input type="text" className="input-field" placeholder="Days" value={p.duration} onChange={e => updatePrescription(index, 'duration', e.target.value)} />
              {prescriptions.length > 1 && (
                <button type="button" onClick={() => removePrescription(index)} style={{ position: 'absolute', right: -30, top: 12, background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer' }}>
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}
        </div>

        <button type="submit" disabled={saving} className={`btn btn-green btn-lg ${saving ? 'opacity-70' : ''}`} style={{ width: '100%', marginBottom: 40 }}>
          <Save size={18} /> {saving ? "Saving..." : "Save and Send to Patient"}
        </button>
      </form>
    </>
  );
}
