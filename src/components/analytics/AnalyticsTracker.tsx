"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";

const SESSION_KEY = "mec_analytics_session_id";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const currentPathRef = useRef<string>(pathname);
  const activeStartRef = useRef<number>(Date.now());
  const accumulatedMsRef = useRef<number>(0);
  const sessionIdRef = useRef<string>("");

  // Initialize or retrieve 30-min browsing session
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      let sid = sessionStorage.getItem(SESSION_KEY);
      if (!sid) {
        sid = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        sessionStorage.setItem(SESSION_KEY, sid);
      }
      sessionIdRef.current = sid;
    } catch {
      sessionIdRef.current = "fallback-session";
    }
  }, []);

  // Helper to send dwell duration beacon
  const flushDuration = (path: string, isExit: boolean = false) => {
    if (typeof window === "undefined") return;
    // Don't track admin dashboard dwell time in public traffic
    if (path.startsWith("/dashboard")) return;

    // Add any pending active time before flushing
    if (document.visibilityState === "visible") {
      const now = Date.now();
      accumulatedMsRef.current += Math.max(0, now - activeStartRef.current);
      activeStartRef.current = now;
    }

    const durationSeconds = Math.round(accumulatedMsRef.current / 1000);
    // Only send if user was on the page for at least 1 second
    if (durationSeconds > 0) {
      const payload = JSON.stringify({
        path,
        durationSeconds,
        sessionId: sessionIdRef.current,
        isExit,
      });

      const url = `${API_BASE_URL}/api/analytics/collect-duration`;

      if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: "application/json" });
        navigator.sendBeacon(url, blob);
      } else {
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    }

    accumulatedMsRef.current = 0;
    activeStartRef.current = Date.now();
  };

  // Track page transitions
  useEffect(() => {
    if (!pathname) return;

    const previousPath = currentPathRef.current;
    if (previousPath && previousPath !== pathname) {
      flushDuration(previousPath, false);
    }

    currentPathRef.current = pathname;
    activeStartRef.current = Date.now();
    accumulatedMsRef.current = 0;

    // Filter out internal dashboard URLs from public traffic
    if (pathname.startsWith("/dashboard")) return;

    // Send page view beacon
    const isFirst = !sessionStorage.getItem("mec_analytics_first_page_sent");
    if (isFirst) {
      try {
        sessionStorage.setItem("mec_analytics_first_page_sent", "true");
      } catch {}
    }

    const viewPayload = {
      path: pathname,
      sessionId: sessionIdRef.current,
      isFirstPage: isFirst,
      referrer: typeof document !== "undefined" ? document.referrer : "",
    };

    fetch(`${API_BASE_URL}/api/analytics/collect-view`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(viewPayload),
    }).catch(() => {
      // Non-blocking telemetry
    });
  }, [pathname]);

  // Handle visibility changes (pausing timer when tab is hidden) & unload beacon
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        // Tab went to background: pause and accumulate active time
        accumulatedMsRef.current += Math.max(0, Date.now() - activeStartRef.current);
      } else if (document.visibilityState === "visible") {
        // Tab resumed: reset start mark
        activeStartRef.current = Date.now();
      }
    };

    const handlePageExit = () => {
      flushDuration(currentPathRef.current, true);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageExit);
    window.addEventListener("beforeunload", handlePageExit);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageExit);
      window.removeEventListener("beforeunload", handlePageExit);
    };
  }, []);

  return null;
}
