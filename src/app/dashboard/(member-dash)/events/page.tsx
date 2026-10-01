"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, MapPin, Clock, RefreshCw, FileText } from "lucide-react";
import { FormsTab } from "@/components/dashboard/legacy/FormsTab";
import { useAuth } from "@/context/AuthContext";
import { api, API_BASE_URL } from "@/lib/api";

interface EventItem {
  _id: string;
  title: string;
  description: string;
  date: string;
  eventTime: string;
  location: string;
  status: string;
  category: string;
  isUpcoming: boolean;
}

export default function MemberEventsPage() {
  const [activeTab, setActiveTab] = useState<"events" | "forms">("events");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [forms, setForms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/events`, {
        withCredentials: true,
      });
      setEvents(res.data.data || res.data);
    } catch {
      setError("Failed to load events. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchForms = async () => {
    try {
      const res = await api.get("/api/forms/active");
      if (res && res.data) {
        setForms(res.data);
      }
    } catch {
      // fallback
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchForms();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchEvents}
          className="flex items-center gap-2 mx-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
        >
          <RefreshCw size={16} /> Retry
        </button>
      </div>
    );
  }

  const ongoing = events.filter((e) => (e.status || "").toLowerCase() === "ongoing");
  const upcoming = events.filter((e) => {
    const s = (e.status || "").toLowerCase();
    if (s === "ongoing" || s === "completed" || s === "past" || s === "cancelled") return false;
    if (s === "scheduled" || s === "upcoming") return true;
    return e.isUpcoming;
  });
  const completed = events.filter((e) => {
    const s = (e.status || "").toLowerCase();
    if (s === "completed" || s === "past") return true;
    if (s === "ongoing" || s === "scheduled" || s === "upcoming") return false;
    return !e.isUpcoming;
  });

  return (
    <div className="space-y-8">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-3 border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Calendar className="text-blue-500" size={28} />
          Events & Club Forms
        </h2>
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-xl">
          <button
            onClick={() => setActiveTab("events")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeTab === "events"
                ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
              }`}
          >
            <Calendar size={14} />
            <span>Events</span>
          </button>
          <button
            onClick={() => setActiveTab("forms")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeTab === "forms"
                ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
              }`}
          >
            <FileText size={14} />
            <span>Registration Forms</span>
          </button>
        </div>
      </div>

      {activeTab === "forms" ? (
        user ? (
          <FormsTab user={user} forms={forms} />
        ) : (
          <div className="text-center py-10 text-gray-500">Please sign in to view forms.</div>
        )
      ) : ongoing.length === 0 && upcoming.length === 0 && completed.length === 0 ? (
        <div className="text-center py-20 text-gray-500 dark:text-gray-400">
          No events found.
        </div>
      ) : (
        <>
          {ongoing.length > 0 && (
            <section className="p-4 sm:p-5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center gap-2 mb-4">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
                </span>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Happening Now (Ongoing)
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {ongoing.map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            </section>
          )}

          {upcoming.length > 0 && (
            <section>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Upcoming Events ({upcoming.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcoming.map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            </section>
          )}

          {completed.length > 0 && (
            <section>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Completed Events ({completed.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {completed.map((event) => (
                  <EventCard key={event._id} event={event} muted />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function EventCard({ event, muted = false }: { event: EventItem; muted?: boolean }) {
  const isOngoing = (event.status || "").toLowerCase() === "ongoing";
  const isUpcoming = (event.status || "").toLowerCase() === "scheduled" || (!event.status && event.isUpcoming);
  const statusLabel = isOngoing ? "Ongoing" : isUpcoming ? "Scheduled" : (event.status || "Completed");
  return (
    <div
      className={`bg-white dark:bg-gray-900 rounded-2xl border p-5 flex flex-col gap-3 transition-all hover:shadow-md ${muted
          ? "border-gray-200 dark:border-gray-800 opacity-70"
          : "border-blue-100 dark:border-blue-900/40 shadow-sm"
        }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug">
          {event.title}
        </h4>
        <span
          className={`flex-shrink-0 px-2 py-0.5 text-[10px] font-semibold uppercase rounded-md ${
            isOngoing
              ? "bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border border-rose-500/30 font-bold"
              : isUpcoming
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-500/30"
              : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
          }`}
        >
          {statusLabel}
        </span>
      </div>

      {event.description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
          {event.description}
        </p>
      )}

      <div className="space-y-1.5 mt-auto">
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <Calendar size={13} />
          {new Date(event.date).toDateString().split(" ").slice(1).join(" ")}
        </div>
        {event.eventTime && (
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Clock size={13} />
            {event.eventTime}
          </div>
        )}
        {event.location && (
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <MapPin size={13} />
            {event.location}
          </div>
        )}
      </div>
    </div>
  );
}
