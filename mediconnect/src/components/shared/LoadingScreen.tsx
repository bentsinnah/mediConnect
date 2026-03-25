"use client";
import Logo from "./Logo";

export default function LoadingScreen() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      animation: 'fadeOut 0.5s ease-in-out 1.2s forwards'
    }}>
      <div style={{ animation: 'bounce 1s ease-in-out infinite' }}>
        <Logo size="lg" />
      </div>
      <div style={{
        marginTop: 24,
        width: 140,
        height: 4,
        background: '#f0f0f0',
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '40%',
          background: 'var(--blue-primary)',
          borderRadius: 2,
          animation: 'shimmer 1.5s ease-in-out infinite'
        }}></div>
      </div>
      
      <style jsx>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes shimmer {
          0% { left: -40%; }
          100% { left: 100%; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; visibility: hidden; }
        }
      `}</style>
    </div>
  );
}
