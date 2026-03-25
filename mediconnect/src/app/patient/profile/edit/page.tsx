"use client";
import Link from "next/link";
import { ArrowLeft, Camera, Save } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useApi, fetchApi } from "@/lib/api";
import Avatar from "@/components/Avatar";
import styles from "./edit.module.css";

export default function EditPatientProfilePage() {
  const [loading, setLoading] = useState(false);
  const { data: user, loading: fetching } = useApi<any>('/profile');

  const [avatar, setAvatar] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passLoading, setPassLoading] = useState(false);
  const [passError, setPassError] = useState("");
  const [passSuccess, setPassSuccess] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setDob(user.patientProfile?.dateOfBirth || "");
      setAddress(user.patientProfile?.address || "");
      if (user.avatar) setAvatar(user.avatar);
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetchApi('/profile', {
        method: 'PATCH',
        body: JSON.stringify({ name, phone, dateOfBirth: dob, address, avatar })
      });
      alert("Profile successfully updated.");
      window.location.href = "/patient/profile";
    } catch (err: any) {
      alert("Failed to update: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return setPassError("New passwords do not match.");
    setPassLoading(true);
    setPassError("");
    setPassSuccess("");
    try {
      await fetchApi('/profile/password', {
        method: 'PATCH',
        body: JSON.stringify({ currentPassword, newPassword })
      });
      setPassSuccess("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setShowPasswordForm(false), 2000);
    } catch (err: any) {
      setPassError(err.message || 'Failed to update password');
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <>
      <header className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/patient/profile" className={styles.backBtn}>
            <ArrowLeft size={20} />
          </Link>
          <h1 className={styles.title}>Edit Profile</h1>
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
            <Avatar src={avatar || user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${name}`} name={name} size={100} className={styles.avatar} />
            <button type="button" className={styles.cameraBtn}>
              <Camera size={16} color="white" />
            </button>
          </div>
          <p className={styles.avatarHint}>Tap to change photo (Max 10MB)</p>
        </div>

        <div className={styles.inputGroup}>
          <label>Full Name</label>
          <input type="text" className="input-field" value={name} onChange={e => setName(e.target.value)} required />
        </div>

        <div className={styles.inputGroup}>
          <label>Email Address</label>
          <input type="email" className="input-field" value={email} readOnly style={{ opacity: 0.7 }} />
        </div>

        <div className={styles.inputGroup}>
          <label>Phone Number</label>
          <input type="tel" className="input-field" value={phone} onChange={e => setPhone(e.target.value)} />
        </div>

        <div className={styles.inputGroup}>
          <label>Date of Birth</label>
          <input type="date" className="input-field" value={dob} onChange={e => setDob(e.target.value)} />
        </div>
        
        <div className={styles.inputGroup}>
          <label>Home Address</label>
          <input type="text" className="input-field" value={address} onChange={e => setAddress(e.target.value)} />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary btn-lg" 
          style={{ width: '100%', marginTop: 24, marginBottom: 32 }}
          disabled={loading}
        >
          {loading ? "Saving Changes..." : <><Save size={18} /> Save Changes</>}
        </button>
      </form>

      <div className={styles.formContainer} style={{ paddingTop: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '16px 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }} onClick={() => setShowPasswordForm(!showPasswordForm)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>Change Password</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Update your login credentials</p>
            </div>
          </div>
          <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Toggle</button>
        </div>

        {showPasswordForm && (
          <form onSubmit={handlePasswordChange} style={{ marginTop: 20 }}>
            {passError && <div className="badge badge-red" style={{ marginBottom: 12 }}>{passError}</div>}
            {passSuccess && <div className="badge badge-green" style={{ marginBottom: 12 }}>{passSuccess}</div>}
            
            <div className={styles.inputGroup} style={{ marginBottom: 16 }}>
              <label>Current Password</label>
              <input type="password" required value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="input-field" />
            </div>
            <div className={styles.inputGroup} style={{ marginBottom: 16 }}>
              <label>New Password</label>
              <input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} className="input-field" />
            </div>
            <div className={styles.inputGroup} style={{ marginBottom: 20 }}>
              <label>Confirm New Password</label>
              <input type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="input-field" />
            </div>
            
            <button type="submit" disabled={passLoading} className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
              {passLoading ? "Updating..." : "Save New Password"}
            </button>
          </form>
        )}
      </div>
    </>
  );
}
