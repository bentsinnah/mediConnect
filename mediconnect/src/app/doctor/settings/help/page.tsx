"use client";
import Link from "next/link";
import { ArrowLeft, HelpCircle, MessageSquare, Phone, BookOpen, Mail } from "lucide-react";

export default function DoctorHelpPage() {
  return (
    <>
      <header className="section-header" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/doctor/profile" className="btn btn-outline" style={{ padding: 8, height: 40 }}>
            <ArrowLeft size={20} />
          </Link>
          <h1 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Help & Support</h1>
        </div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 12 }}>Contact Us</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 20 }}>Our support team is available 24/7 to assist you with any medical or technical queries.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: 'var(--bg-page)', borderRadius: 12 }}>
              <Phone size={18} color="var(--blue-primary)" />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.9rem', fontWeight: 700 }}>Call Support</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>+234 812 345 6789</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: 'var(--bg-page)', borderRadius: 12 }}>
              <Mail size={18} color="var(--green-primary)" />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.9rem', fontWeight: 700 }}>Email Support</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>support@mediconnect.ng</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 12 }}>FAQ & Guides</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
            <BookOpen size={18} color="var(--orange)" />
            <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>Doctor Help Center & Tutorials</p>
          </div>
        </div>
      </div>
    </>
  );
}
