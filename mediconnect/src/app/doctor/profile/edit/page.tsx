"use client";
import Link from "next/link";
import { ArrowLeft, Camera, Save } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useApi, fetchApi } from "@/lib/api";
import Avatar from "@/components/Avatar";
import styles from "../../../patient/profile/edit/edit.module.css";

export default function EditDoctorProfilePage() {
  const [loading, setLoading] = useState(false);
  const { data: user, loading: fetching } = useApi<any>('/profile');

  const [avatar, setAvatar] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [clinic, setClinic] = useState("");
  const [email, setEmail] = useState("");
  const [fee, setFee] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setSpecialty(user.doctorProfile?.specialty || "");
      setClinic(user.doctorProfile?.clinic || "");
      setEmail(user.email || "");
      setFee(user.doctorProfile?.fee?.toString() || "");
      if (user.avatar) setAvatar(user.avatar);
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetchApi('/profile', {
        method: 'PATCH',
        body: JSON.stringify({ name, specialty, clinic, fee: parseInt(fee), avatar })
      });
      alert("Doctor profile successfully updated.");
      window.location.href = "/doctor/profile";
    } catch (err: any) {
      alert("Failed to update: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/doctor/profile" className={styles.backBtn}>
            <ArrowLeft size={20} />
          </Link>
          <h1 className={styles.title}>Edit Doctor Profile</h1>
        </div>
      </header>

      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            if (file.size > 5 * 1024 * 1024) {
              alert("Image must be smaller than 5MB");
              return;
            }
            const reader = new FileReader();
            reader.onloadend = () => setAvatar(reader.result as string);
            reader.readAsDataURL(file);
          }
        }} 
      />

      <form onSubmit={handleSave} className={styles.formContainer}>
        <div className={styles.avatarSection}>
          <div className={styles.avatarWrap} onClick={() => fileInputRef.current?.click()} style={{ cursor: 'pointer' }}>
            <Avatar 
              src={avatar || user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${name}`} 
              name={name} 
              size={100} 
              className={styles.avatar} 
              style={{ border: '3px solid var(--green-light)' }} 
            />
            <button type="button" className={styles.cameraBtn} style={{ background: 'var(--green-primary)' }}>
              <Camera size={16} color="white" />
            </button>
          </div>
          <p className={styles.avatarHint}>Tap to change professional photo (Max 10MB)</p>
        </div>

        <div className={styles.inputGroup}>
          <label>Full Name</label>
          <input type="text" className="input-field" value={name} onChange={e => setName(e.target.value)} required />
        </div>

        <div className={styles.inputGroup}>
          <label>Medical Specialty</label>
          <input type="text" className="input-field" value={specialty} onChange={e => setSpecialty(e.target.value)} required />
        </div>
        
        <div className={styles.inputGroup}>
          <label>Clinic/Hospital Name</label>
          <input type="text" className="input-field" value={clinic} onChange={e => setClinic(e.target.value)} required />
        </div>

        <div className={styles.inputGroup}>
          <label>Email Address</label>
          <input type="email" className="input-field" value={email} readOnly style={{ opacity: 0.7 }} />
        </div>

        <div className={styles.inputGroup}>
          <label>Consultation Fee (₦)</label>
          <input type="number" className="input-field" value={fee} onChange={e => setFee(e.target.value)} required />
        </div>

        <button 
          type="submit" 
          className="btn btn-green btn-lg" 
          style={{ width: '100%', marginTop: 24 }}
          disabled={loading}
        >
          {loading ? "Saving Changes..." : <><Save size={18} /> Save Changes</>}
        </button>
      </form>
    </>
  );
}
