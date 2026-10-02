"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import { DoorOpen, X, Home, PhoneCall, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";

interface ClubRoomData {
  status: "open" | "closed";
  openedBy?: string;
  updatedAt?: string;
}

export function ClubRoomIndicator() {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<ClubRoomData>({ status: "closed" });
  const [modalOpen, setModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/site-settings/public`);
      if (res.data?.clubRoom) {
        setData(res.data.clubRoom);
      }
    } catch {
      // Ignore network errors
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(() => {
      if (typeof document !== "undefined" && document.hidden) return;
      fetchStatus();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Close modal on Escape or Click Outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalOpen(false);
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setModalOpen(false);
      }
    };
    if (modalOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalOpen]);

  // Hide on dashboard or before client mount
  if (!mounted || pathname?.startsWith("/dashboard")) {
    return null;
  }

  const isOpen = data.status === "open";

  const formatOpeningTime = (iso?: string) => {
    if (!iso) return "";
    try {
      const date = new Date(iso);
      const timeStr = date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });
      const today = new Date();
      const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

      return isToday ? timeStr : `${date.toLocaleDateString([], { month: "short", day: "numeric" })}, ${timeStr}`;
    } catch {
      return "";
    }
  };

  return createPortal(
    <>
      {/* ── Floating Indicator Icon Button (Bottom Right) ── */}
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 9999,
        }}
        className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200 select-none cursor-pointer group ${
          isOpen
            ? "bg-surface-elevated text-emerald-600 dark:text-emerald-400 border-emerald-500/80 shadow-[2px_2px_0px_#10b981] hover:shadow-[3px_3px_0px_#10b981] hover:-translate-x-0.5 hover:-translate-y-0.5"
            : "bg-surface-elevated text-red-500 dark:text-red-400 border-red-500/80 shadow-[2px_2px_0px_#ef4444] hover:shadow-[3px_3px_0px_#ef4444] hover:-translate-x-0.5 hover:-translate-y-0.5"
        }`}
        aria-label={isOpen ? "Club is Open" : "Club is Closed"}
        title={isOpen ? "Club is Open" : "Club is Closed"}
      >
        <DoorOpen size={18} className="transition-transform group-hover:scale-110" />

        {/* Status Pip on Top-Right Corner */}
        <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3 items-center justify-center">
          {isOpen ? (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 border border-surface-elevated" />
            </>
          ) : (
            <span className="inline-flex rounded-full h-2 w-2 bg-red-500 border border-surface-elevated" />
          )}
        </span>
      </button>

      {/* ── Neo-Brutalist Status Modal ── */}
      {modalOpen && (
        <div
          style={{ zIndex: 10000 }}
          className="fixed inset-0 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <div
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="club-room-modal-title"
            className="w-full max-w-md bg-surface-elevated border border-black dark:border-border-default rounded-xl shadow-[4px_4px_0px_var(--accent-primary)] overflow-hidden transition-all transform animate-in zoom-in-95 duration-150"
          >
            {/* Modal Header */}
            <div
              className={`p-5 border-b border-black dark:border-border-default flex items-center justify-between ${
                isOpen
                  ? "bg-emerald-500/10 dark:bg-emerald-950/40"
                  : "bg-red-500/10 dark:bg-red-950/40"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center ${
                    isOpen
                      ? "bg-emerald-500 text-white border-emerald-600 shadow-[2px_2px_0px_#065f46]"
                      : "bg-red-500 text-white border-red-600 shadow-[2px_2px_0px_#991b1b]"
                  }`}
                >
                  <DoorOpen size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${isOpen ? "bg-emerald-500 animate-pulse" : "bg-red-500"
                        }`}
                    />
                    <span className="font-mono text-[11px] font-black uppercase tracking-wider text-text-secondary">
                      {isOpen ? "Active Operations" : "Status: Off Hours"}
                    </span>
                  </div>
                  <h3
                    id="club-room-modal-title"
                    className="text-base sm:text-lg font-black text-text-primary tracking-tight"
                  >
                    {isOpen ? "Our Club Room is Open!" : "Club Room is Closed"}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-lg border border-border-default bg-surface-elevated text-text-secondary hover:text-text-primary hover:bg-surface-secondary flex items-center justify-center transition cursor-pointer"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              <p className="text-sm text-text-secondary leading-relaxed font-medium">
                {isOpen
                  ? "Our club room is open, let's head there and spend some productive time."
                  : "Club room is closed for now. Please contact executive members if you need club room access to spend some productive time there."}
              </p>

              {/* Opened Since timestamp when open (no openedBy exposed in public) */}
              {isOpen && data.updatedAt && (
                <div className="p-3.5 rounded-xl bg-surface-secondary border border-border-default flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <Clock size={16} className="text-emerald-500 flex-shrink-0" />
                    <div>
                      <span className="text-text-tertiary block text-[10px] font-mono uppercase font-bold tracking-wide">
                        Status
                      </span>
                      <span className="font-bold text-text-primary text-xs sm:text-sm">
                        Opened since {formatOpeningTime(data.updatedAt)}
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Active
                  </span>
                </div>
              )}

              {/* Quick Actions (Strictly following user requirements) */}
              <div className="pt-2 border-t border-border-default flex items-center gap-3">
                {isOpen ? (
                  <>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setModalOpen(false);
                        router.push("/");
                      }}
                      className="flex-1 font-mono text-xs"
                      icon={<Home size={14} />}
                    >
                      Home
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setModalOpen(false);
                        router.push("/contact");
                      }}
                      className="flex-1 font-mono text-xs"
                      icon={<PhoneCall size={14} />}
                    >
                      Contact Us
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setModalOpen(false);
                        router.push("/executives");
                      }}
                      className="flex-1 font-mono text-xs"
                      icon={<Users size={14} />}
                    >
                      Executives
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setModalOpen(false);
                        router.push("/contact");
                      }}
                      className="flex-1 font-mono text-xs"
                      icon={<PhoneCall size={14} />}
                    >
                      Contact Us
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>,
    document.body
  );
}
