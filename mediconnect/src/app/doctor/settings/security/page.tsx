"use client";
import Link from "next/link";
import { ArrowLeft, Shield, Lock, Smartphone, Fingerprint, Key, Save } from "lucide-react";
import { useState } from "react";
import { fetchApi } from "@/lib/api";

export default function DoctorSecurityPage() {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return setError("New passwords do not match.");
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await fetchApi('/profile/password', {
        method: 'PATCH',
        body: JSON.stringify({ currentPassword, newPassword })
      });
      setSuccess("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setShowPasswordForm(false), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <header className="section-header" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/doctor/profile" className="btn btn-outline" style={{ padding: 8, height: 40 }}>
            <ArrowLeft size={20} />
          </Link>
          <h1 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Security</h1>
        </div>
      </header>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: 20, borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => setShowPasswordForm(!showPasswordForm)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ background: 'var(--blue-light)', color: 'var(--blue-primary)', padding: 10, borderRadius: 12 }}><Key size={20} /></div>
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>Change Password</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Update your login credentials</p>
              </div>
            </div>
          </div>
          
          {showPasswordForm && (
            <form onSubmit={handlePasswordChange} style={{ marginTop: 20, paddingTop: 20, borderTop: '1px dashed var(--border-color)' }}>
              {error && <div className="badge badge-red" style={{ marginBottom: 12 }}>{error}</div>}
              {success && <div className="badge badge-green" style={{ marginBottom: 12 }}>{success}</div>}
              
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Current Password</label>
                <input type="password" required value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="input-field" style={{ width: '100%' }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>New Password</label>
                <input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} className="input-field" style={{ width: '100%' }} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Confirm New Password</label>
                <input type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="input-field" style={{ width: '100%' }} />
              </div>
              
              <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                {loading ? "Updating..." : "Save New Password"}
              </button>
            </form>
          )}
        </div>

        <div style={{ padding: 20, borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: 'var(--green-light)', color: 'var(--green-dark)', padding: 10, borderRadius: 12 }}><Smartphone size={20} /></div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>2-Factor Authentication</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>SMS or Authenticator App</p>
            </div>
          </div>
          <div className="toggle active"><div className="toggleKnob"></div></div>
        </div>

        <div style={{ padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: '#F3E5F5', color: '#7B1FA2', padding: 10, borderRadius: 12 }}><Fingerprint size={20} /></div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>Biometric Login</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Touch ID or Face ID</p>
            </div>
          </div>
          <div className="toggle active"><div className="toggleKnob"></div></div>
        </div>
      </div>
    </>
  );
}
