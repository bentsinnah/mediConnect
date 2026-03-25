"use client";
import React from "react";
import NextImage from "next/image";

interface AvatarProps {
  src?: string;
  name: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function Avatar({ src, name, size = 40, className = "", style = {} }: AvatarProps) {
  const [imgError, setImgError] = React.useState(false);
  
  const getInitials = (name: string) => {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const hasImage = src && typeof src === 'string' && src.trim() !== '' && !imgError;

  if (hasImage) {
    return (
      <NextImage
        src={src}
        alt={name}
        width={size}
        height={size}
        className={className}
        onError={() => setImgError(true)}
        style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0, ...style }}
      />
    );
  }

  return (
    <div
      className={className}
      title={name}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: 'var(--blue-light)',
        color: 'var(--blue-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.4,
        fontWeight: 700,
        border: '1.5px solid var(--blue-primary)',
        flexShrink: 0,
        overflow: 'hidden',
        ...style
      }}
    >
      {getInitials(name)}
    </div>
  );
}
