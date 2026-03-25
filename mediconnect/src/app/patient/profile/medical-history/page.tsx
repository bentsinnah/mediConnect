"use client";
import Link from "next/link";
import { ArrowLeft, Plus, Shield, AlertCircle, Pill } from "lucide-react";
import { useApi } from "@/lib/api";
import styles from "./medical-history.module.css";

export default function MedicalHistoryPage() {
  const { data: history, loading } = useApi<any[]>('/medical-history');

  const conditions = history?.filter(h => h.type === 'CONDITION') || [];
  const allergies = history?.filter(h => h.type === 'ALLERGY') || [];
  const medications = history?.filter(h => h.type === 'MEDICATION') || [];
  return (
    <>
      <header className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/patient/profile" className={styles.backBtn}>
            <ArrowLeft size={20} />
          </Link>
          <h1 className={styles.title}>Medical History</h1>
        </div>
        <button className={styles.addBtn}><Plus size={20} /></button>
      </header>

      <div className={styles.container}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center' }}>Loading medical records...</div>
        ) : (
          <>
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <Shield size={20} color="var(--blue-primary)" />
                <h2>Chronic Conditions</h2>
              </div>
              <div className={styles.card}>
                {conditions.length === 0 ? <p style={{ padding: 16 }}>No conditions recorded.</p> : conditions.map((item) => (
                  <div key={item.id} className={styles.conditionItem} style={{ marginBottom: 16 }}>
                    <div className={styles.itemInfo}>
                      <h3 className={styles.itemName}>{item.name}</h3>
                      <p className={styles.itemMeta}>Diagnosed: {item.diagnosedAt || 'Unknown'} · {item.details}</p>
                    </div>
                    {item.isActive && <span className="badge badge-blue">Active</span>}
                  </div>
                ))}
              </div>
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <AlertCircle size={20} color="var(--red)" />
                <h2>Allergies</h2>
              </div>
              <div className={styles.card}>
                {allergies.length === 0 ? <p style={{ padding: 16 }}>No allergies recorded.</p> : allergies.map((item, idx) => (
                  <div key={item.id} className={styles.conditionItem} style={{ marginTop: idx > 0 ? 16 : 0, paddingTop: idx > 0 ? 16 : 0, borderTop: idx > 0 ? '1px solid var(--border-color)' : 'none' }}>
                    <div className={styles.itemInfo}>
                      <h3 className={styles.itemName}>{item.name}</h3>
                      <p className={styles.itemMeta}>{item.details || 'No details'}</p>
                    </div>
                    {item.severity === 'Severe' ? (
                      <span className="badge badge-red">Severe</span>
                    ) : item.severity ? (
                      <span className="badge" style={{ background: '#FEF3C7', color: '#92400E' }}>{item.severity}</span>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <Pill size={20} color="var(--green-primary)" />
                <h2>Current Medications</h2>
              </div>
              <div className={styles.card}>
                {medications.length === 0 ? <p style={{ padding: 16 }}>No current medications.</p> : medications.map((item, idx) => (
                  <div key={item.id} className={styles.medItem} style={{ marginTop: idx > 0 ? 16 : 0, paddingTop: idx > 0 ? 16 : 0, borderTop: idx > 0 ? '1px solid var(--border-color)' : 'none' }}>
                    <div className={styles.medIcon}><Pill size={20} color="var(--green-primary)" /></div>
                    <div className={styles.itemInfo}>
                      <h3 className={styles.itemName}>{item.name}</h3>
                      <p className={styles.itemMeta}>{item.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>

      <div className={styles.infoBox}>
        <p>This medical history is shared with your doctors during consultations to help them provide better care.</p>
      </div>
    </>
  );
}
