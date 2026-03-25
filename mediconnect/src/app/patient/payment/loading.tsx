export default function Loading() {
  return (
    <div style={{ padding: 40, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <div className="spinner" style={{ width: 36, height: 36, border: '3px solid var(--border-color)', borderTopColor: 'var(--blue-primary)', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
      <p style={{ color: 'var(--text-secondary)' }}>Loading payment details...</p>
    </div>
  );
}
