"use client";
import Link from "next/link";
import { ArrowLeft, Bell, CheckCircle, Calendar, Stethoscope, XCircle, AlertTriangle } from "lucide-react";
import { useApi, fetchApi } from "@/lib/api";

function notifIcon(title: string) {
  if (title.includes('Cancelled') || title.includes('❌')) return <XCircle size={18} />;
  if (title.includes('Consultation') || title.includes('📋')) return <Stethoscope size={18} />;
  if (title.includes('Appointment') || title.includes('📅')) return <Calendar size={18} />;
  if (title.includes('⚠️')) return <AlertTriangle size={18} />;
  return <Bell size={18} />;
}

export default function DoctorNotificationsPage() {
  const { data: notifications, loading, refetch } = useApi<any[]>('/notifications');
  const unreadCount = (notifications || []).filter(n => !n.isRead).length;

  const markAsRead = async (id: string) => {
    try {
      await fetchApi(`/notifications/${id}/read`, { method: 'PATCH' });
      refetch();
    } catch (e) {}
  };

  const markAllRead = async () => {
    try {
      await fetchApi('/notifications/read-all', { method: 'PATCH' });
      refetch();
    } catch (e) {}
  };

  return (
    <>
      <header className="section-header" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/doctor/dashboard" className="btn btn-outline" style={{ padding: 8, height: 40 }}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Notifications</h1>
            {unreadCount > 0 && <p style={{ fontSize: '0.8rem', color: 'var(--green-primary)', fontWeight: 600 }}>{unreadCount} unread</p>}
          </div>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '8px 12px' }}>
            <CheckCircle size={14} /> Mark all read
          </button>
        )}
      </header>
      
      {loading ? (
        <div style={{ padding: 40, textAlign: 'center' }}>Loading notifications...</div>
      ) : !notifications || notifications.length === 0 ? (
        <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-secondary)' }}>
          <Bell size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
          <p>No notifications yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {notifications.map((n: any) => (
            <div 
              key={n.id} 
              onClick={() => !n.isRead && markAsRead(n.id)} 
              style={{ 
                padding: 16, 
                borderRadius: 16, 
                border: `1px solid ${!n.isRead ? 'var(--green-primary)' : 'var(--border-color)'}`,
                background: !n.isRead ? 'rgba(22, 163, 74, 0.04)' : 'white',
                display: 'flex',
                gap: 12,
                cursor: !n.isRead ? 'pointer' : 'default',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ 
                width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                background: !n.isRead ? 'var(--green-primary)' : 'var(--bg-page)', 
                color: !n.isRead ? 'white' : 'var(--text-muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {notifIcon(n.title)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>{n.title}</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', marginLeft: 8 }}>
                    {new Date(n.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{n.body}</p>
              </div>
              {!n.isRead && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green-primary)', marginTop: 6, flexShrink: 0 }} />}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
