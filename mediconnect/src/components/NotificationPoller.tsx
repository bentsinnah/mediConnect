"use client";
import { useEffect, useRef } from "react";
import { fetchApi } from "@/lib/api";
import { useToast } from "@/components/Toast";

export default function NotificationPoller() {
  const { toast } = useToast();
  const lastIdRef = useRef<string | null>(null);

  useEffect(() => {
    const checkNotifications = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const notifs = await fetchApi('/notifications');
        if (notifs && notifs.length > 0) {
          const latest = notifs[0];
          
          if (lastIdRef.current === null) {
            // First load, just record the latest ID so we don't spam them on login
            lastIdRef.current = latest.id;
          } else if (latest.id !== lastIdRef.current) {
            // New notification detected!
            toast.success(latest.title + "\n" + latest.body);
            lastIdRef.current = latest.id;
          }
        }
      } catch (e) {
        // Silently ignore background polling errors
      }
    };

    // Check every 5 seconds for real-time responsiveness
    const interval = setInterval(checkNotifications, 5000);
    return () => clearInterval(interval);
  }, [toast]);

  return null;
}
