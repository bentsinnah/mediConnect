import { useState, useCallback, useEffect } from 'react';

const isProd = process.env.NODE_ENV === 'production';
let API_BASE = process.env.NEXT_PUBLIC_API_URL || (isProd ? 'https://mediconnect-s11t.onrender.com/api' : 'http://localhost:5000/api');

// Auto-switch to production backend if we're on a mobile device/remote IP and NEXT_PUBLIC_API_URL isn't set
if (typeof window !== 'undefined' && !process.env.NEXT_PUBLIC_API_URL) {
  const host = window.location.hostname;
  if (host !== 'localhost' && host !== '127.0.0.1' && !host.includes('192.168.')) {
    API_BASE = 'https://mediconnect-s11t.onrender.com/api';
  }
}

if (typeof window !== 'undefined') {
  console.log(`[MediConnect] Using API Base: ${API_BASE}`);
}

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Create abort controller for 15s timeout
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(id);

    // Handle non-JSON responses gracefully
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }
      return data;
    } else {
      const text = await response.text();
      if (!response.ok) {
        throw new Error(`Server Error (${response.status}): ${text.slice(0, 100)}`);
      }
      return text;
    }
  } catch (err: any) {
     clearTimeout(id);
     if (err.name === 'AbortError') {
       throw new Error("Request timed out. The backend might be waking up (Render spin-up). Please try again in 30 seconds.");
     }
     throw err;
  }
};

// Hook for fetching data on mount
export function useApi<T>(endpoint: string, dependencies: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchApi(endpoint);
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    execute();
  }, [execute, ...dependencies]);

  return { data, loading, error, refetch: execute };
}
