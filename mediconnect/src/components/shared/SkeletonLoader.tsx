import React from "react";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

export default function SkeletonLoader({ 
  width = "100%", 
  height = "20px", 
  borderRadius = "8px", 
  className = "", 
  style = {} 
}: SkeletonProps) {
  return (
    <div 
      className={`skeleton-loading ${className}`}
      style={{
        width,
        height,
        borderRadius,
        background: 'linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'skeleton-pulse 1.5s infinite linear',
        ...style
      }}
    />
  );
}
