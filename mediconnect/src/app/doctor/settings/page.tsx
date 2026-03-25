"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Smartphone, Calendar, ChevronRight, Save, Settings, Plus, X, Building, MapPin, Globe, CreditCard } from "lucide-react";
import { useApi, fetchApi } from "@/lib/api";
import { useToast } from "@/components/Toast";

export default function DoctorSettingsPage() {
  const { data: dbSettings, loading } = useApi<any>('/settings');
  const { toast } = useToast();
  
  const [isAvailable, setIsAvailable] = useState(true);
  const [consultationType, setConsultationType] = useState('BOTH');
  const [fee, setFee] = useState("15000");
  const [clinicAddress, setClinicAddress] = useState("");
  const [languages, setLanguages] = useState("English");
  const [about, setAbout] = useState("");
  const [slots, setSlots] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Sync state when DB loads
  useEffect(() => {
    if (dbSettings) {
      if (typeof dbSettings.isAvailable === 'boolean') setIsAvailable(dbSettings.isAvailable);
      if (dbSettings.consultationType) setConsultationType(dbSettings.consultationType);
      if (dbSettings.fee) setFee(dbSettings.fee.toString());
      if (dbSettings.clinicAddress) setClinicAddress(dbSettings.clinicAddress);
      if (dbSettings.languages) setLanguages(Array.isArray(dbSettings.languages) ? dbSettings.languages.join(', ') : dbSettings.languages);
      if (dbSettings.about) setAbout(dbSettings.about);
      if (dbSettings.availabilitySlots) setSlots(dbSettings.availabilitySlots);
    }
  }, [dbSettings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetchApi('/settings', {
        method: 'PATCH',
        body: JSON.stringify({ 
          isAvailable, 
          consultationType, 
          fee, 
          clinicAddress, 
          languages, 
          about, 
          slots 
        })
      });
      toast.success("Clinic settings saved successfully.");
    } catch (err: any) {
      toast.error("Failed to save: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleSlot = (dayOfWeek: number, timeStr: string) => {
    const exists = slots.find(s => s.dayOfWeek === dayOfWeek && s.startTime === timeStr);
    if (exists) {
      setSlots(slots.filter(s => !(s.dayOfWeek === dayOfWeek && s.startTime === timeStr)));
    } else {
      setSlots([...slots, { dayOfWeek, startTime: timeStr, endTime: "N/A" }]);
    }
  };

  const applyFullDay = (dayIdx: number) => {
    const withoutDay = slots.filter(s => s.dayOfWeek !== dayIdx);
    const fullDaySlots = TIMES.map(t => ({ dayOfWeek: dayIdx, startTime: t, endTime: "N/A" }));
    setSlots([...withoutDay, ...fullDaySlots]);
  };

  const clearDay = (dayIdx: number) => {
    setSlots(slots.filter(s => s.dayOfWeek !== dayIdx));
  };

  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const TIMES = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"];

  return (
    <>
      <header className="section-header" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/doctor/profile" className="btn btn-outline" style={{ padding: 8, height: 40 }}>
            <ArrowLeft size={20} />
          </Link>
          <h1 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Clinic Settings</h1>
        </div>
        <button onClick={handleSave} disabled={saving} className={`btn btn-green ${saving ? 'opacity-70' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px' }}>
          <Save size={18} /> {saving ? "Saving..." : "Save"}
        </button>
      </header>

      <div className="card glass-card" style={{ padding: 0, overflow: 'hidden', marginBottom: 24 }}>
        <div style={{ padding: 20, borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: 'var(--blue-light)', color: 'var(--blue-primary)', padding: 10, borderRadius: 12 }}>
               <Clock size={20} />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>Availability Status</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {isAvailable ? "Currently accepting patients" : "Not accepting patients"}
              </p>
            </div>
          </div>
          <button 
            className={`toggle ${isAvailable ? 'active' : ''}`} 
            onClick={() => setIsAvailable(!isAvailable)}
            style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
          >
            <div className="toggleKnob"></div>
          </button>
        </div>

        <div style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ background: '#FFF3E0', color: '#F97316', padding: 10, borderRadius: 12 }}>
              <Smartphone size={20} />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>Consultation Type</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>How do you see patients?</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            {['IN_PERSON', 'VIRTUAL', 'BOTH'].map(type => (
              <button 
                key={type}
                onClick={() => setConsultationType(type)}
                style={{
                  flex: 1, padding: 10, borderRadius: 12,
                  border: consultationType === type ? '2px solid #F97316' : '1px solid var(--border-color)',
                  background: consultationType === type ? '#FFF7ED' : 'white',
                  color: consultationType === type ? '#EA580C' : 'var(--text-secondary)',
                  fontWeight: 600, fontSize: '0.85rem'
                }}
              >
                {type === 'IN_PERSON' ? 'In-person Only' : type === 'VIRTUAL' ? 'Virtual Only' : 'Both (Mixed)'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 32 }}>
        <div className="section-header">
          <h3 className="section-title">Schedule Slots</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Click to toggle availability</span>
        </div>
        
        {DAYS.map((dayName, dayIdx) => (
          <div key={dayIdx} className="card glass-card" style={{ padding: 16, marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Calendar size={16} color="var(--blue-primary)" />
                <span style={{ fontWeight: 700 }}>{dayName}</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => applyFullDay(dayIdx)} style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--blue-primary)', background: 'var(--blue-light)', padding: '4px 10px', borderRadius: 8, border: 'none', cursor: 'pointer' }}>Fill 9-5</button>
                <button onClick={() => clearDay(dayIdx)} style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', background: 'var(--bg-secondary)', padding: '4px 10px', borderRadius: 8, border: 'none', cursor: 'pointer' }}>Clear</button>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {TIMES.map(t => {
                const isActive = slots.find(s => s.dayOfWeek === dayIdx && s.startTime === t);
                return (
                  <button 
                    key={t}
                    onClick={() => toggleSlot(dayIdx, t)}
                    style={{
                      padding: '6px 12px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                      background: isActive ? 'var(--blue-primary)' : 'var(--bg-secondary)',
                      color: isActive ? 'white' : 'var(--text-secondary)',
                      border: isActive ? '1px solid var(--blue-primary)' : '1px solid var(--border-color)',
                      transition: 'all 0.2s'
                    }}
                  >
                    {t}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="card glass-card" style={{ padding: 20, marginBottom: 40 }}>
        <div 
          onClick={() => setShowAdvanced(!showAdvanced)}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: 'var(--green-light)', color: 'var(--green-primary)', padding: 10, borderRadius: 12 }}>
              <Settings size={20} />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>Advanced Clinic Controls</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Manage fee, location, and bio</p>
            </div>
          </div>
          <ChevronRight size={20} color="var(--text-muted)" style={{ transform: showAdvanced ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
        </div>

        {showAdvanced && (
          <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Consultation Fee (NGN)</label>
              <div className="input-icon-wrap" style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontWeight: 600, color: 'var(--text-muted)' }}>₦</span>
                <input type="number" className="input-field" style={{ paddingLeft: 40 }} value={fee} onChange={e => setFee(e.target.value)} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Clinic Full Address</label>
              <div className="input-icon-wrap">
                <MapPin size={18} className="icon-left" />
                <input type="text" className="input-field" placeholder="123 Harmony Way, Lagos" value={clinicAddress} onChange={e => setClinicAddress(e.target.value)} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Spoken Languages (Comma separated)</label>
              <div className="input-icon-wrap">
                <Globe size={18} className="icon-left" />
                <input type="text" className="input-field" placeholder="English, Yoruba" value={languages} onChange={e => setLanguages(e.target.value)} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Professional Bio</label>
              <textarea 
                className="input-field" 
                placeholder="I am an experienced professional specializing in..." 
                style={{ minHeight: 100, resize: 'vertical' }}
                value={about}
                onChange={e => setAbout(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
