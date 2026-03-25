import React from "react";
import Link from "next/link";
import { User, Stethoscope } from "lucide-react";

interface AuthRoleSwitcherProps {
  currentRole: "patient" | "doctor";
  type: "login" | "signup";
}

export default function AuthRoleSwitcher({ currentRole, type }: AuthRoleSwitcherProps) {
  const isPatient = currentRole === "patient";

  const getTargetUrl = (targetRole: "patient" | "doctor") => {
    if (type === "login") {
      return `/login?role=${targetRole}`;
    }
    return `/signup/${targetRole}`;
  };

  return (
    <div style={{ 
      display: 'flex', 
      background: 'var(--bg-secondary)', 
      padding: 4, 
      borderRadius: 16, 
      width: '100%', 
      marginBottom: 24,
      position: 'relative',
      border: '1px solid var(--border-color)'
    }}>
      {/* Animated Background Slider */}
      <div style={{
        position: 'absolute',
        top: 4,
        bottom: 4,
        left: isPatient ? 4 : '50%',
        width: 'calc(50% - 4px)',
        background: isPatient ? 'var(--blue-primary)' : 'var(--green-primary)',
        borderRadius: 12,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        zIndex: 0
      }} />

      <Link 
        href={getTargetUrl("patient")}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          padding: '12px 0',
          fontSize: '0.9rem',
          fontWeight: 700,
          color: isPatient ? 'white' : 'var(--text-secondary)',
          textDecoration: 'none',
          zIndex: 1,
          transition: 'color 0.2s'
        }}
      >
        <User size={18} />
        Patient
      </Link>

      <Link 
        href={getTargetUrl("doctor")}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          padding: '12px 0',
          fontSize: '0.9rem',
          fontWeight: 700,
          color: !isPatient ? 'white' : 'var(--text-secondary)',
          textDecoration: 'none',
          zIndex: 1,
          transition: 'color 0.2s'
        }}
      >
        <Stethoscope size={18} />
        Doctor
      </Link>
    </div>
  );
}
