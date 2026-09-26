"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Calendar,
  Users,
  Search,
  Plus,
  FilePlus,
  MoreVertical,
  Video,
  Image as ImageIcon,
  ChevronRight,
  ChevronLeft,
  Pencil,
  Trash2,
  Eye,
  LayoutGrid,
  List as ListIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";

type EventItem = {
  title: string;
  _id: string;
  date: string;
  eventTime: string;
  attendees: string[];
  isUpcoming: boolean;
  registrationLink: string;
  location: string;
  status: string;
  description: string;
  category: string;
  createdAt?: string;
};

type FormItem = {
  _id: string;
  title: string;
  status: string;
  startDate: string;
  endDate: string;
  createdAt?: string;
};

const PAGE_SIZE = 6;

export default function EventsManagementPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [eventPage, setEventPage] = useState(1);
  const [formPage, setFormPage] = useState(1);
  const [forms, setForms] = useState<FormItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const tabs = ["All", "Events", "Forms"];

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/forms`, { withCredentials: true });
        setForms(response.data.data || []);
      } catch (error) {
        console.error("Error fetching forms:", error);
      }
    };
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/events`, { withCredentials: true });
        setEvents(response.data.data || []);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
    fetchForms();
  }, []);

  // Reset pagination on search or tab change
  useEffect(() => {
    setEventPage(1);
    setFormPage(1);
  }, [searchQuery, activeTab]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async (id: string, type: "event" | "form") => {
    setDeleteError(null);
    try {
      const endpoint = type === "event" ? `/api/events/${id}` : `/api/forms/${id}`;
      await axios.delete(`${API_BASE_URL}${endpoint}`, {
        withCredentials: true,
      });
      if (type === "event") {
        setEvents((prev) => prev.filter((e) => e._id !== id));
      } else {
        setForms((prev) => prev.filter((f) => f._id !== id));
      }
      setOpenDropdown(null);
    } catch {
      setDeleteError("Failed to delete. Please try again.");
    }
  };

  const filteredEvents = useMemo(() => {
    const list = events.filter((event) => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === "All" || activeTab === "Events";
      return matchesSearch && matchesTab;
    });

    // Automatically sorted: newest date first
    return list.sort((a, b) => {
      const tA = a.date ? new Date(a.date).getTime() : 0;
      const tB = b.date ? new Date(b.date).getTime() : 0;
      return tB - tA;
    });
  }, [searchQuery, activeTab, events]);

  const filteredForms = useMemo(() => {
    const list = forms.filter((f) => {
      const matchesSearch = f.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === "All" || activeTab === "Forms";
      return matchesSearch && matchesTab;
    });

    // Automatically sorted by publish date (startDate / createdAt) descending
    return list.sort((a, b) => {
      const tA = a.startDate
        ? new Date(a.startDate).getTime()
        : a.createdAt
        ? new Date(a.createdAt).getTime()
        : 0;
      const tB = b.startDate
        ? new Date(b.startDate).getTime()
        : b.createdAt
        ? new Date(b.createdAt).getTime()
        : 0;
      return tB - tA;
    });
  }, [searchQuery, activeTab, forms]);

  const totalEventPages = Math.ceil(filteredEvents.length / PAGE_SIZE) || 1;
  const totalFormPages = Math.ceil(filteredForms.length / PAGE_SIZE) || 1;

  const paginatedEvents = useMemo(() => {
    const start = (eventPage - 1) * PAGE_SIZE;
    return filteredEvents.slice(start, start + PAGE_SIZE);
  }, [filteredEvents, eventPage]);

  const paginatedForms = useMemo(() => {
    const start = (formPage - 1) * PAGE_SIZE;
    return filteredForms.slice(start, start + PAGE_SIZE);
  }, [filteredForms, formPage]);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-6 border-b border-border-default pb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary">
              Events &amp; Forms
            </h2>
            <p className="text-text-secondary mt-1 text-sm">
              Manage your club events, registration forms, and attendees.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/dashboard/manage-events/create-event"
              className="flex items-center gap-2 whitespace-nowrap bg-text-primary hover:bg-surface-inverse text-white px-4 py-2.5 rounded-lg font-semibold transition-all shadow-[3px_3px_0px_0px_var(--border-default)] text-sm border border-border-default"
              style={{ color: "#FFFFFF" }}
            >
              <Plus size={16} />
              New Event
            </Link>
            <Link
              href="/dashboard/manage-events/create-form"
              className="flex items-center gap-2 whitespace-nowrap bg-surface-elevated border border-border-default hover:bg-surface-secondary text-text-primary px-4 py-2.5 rounded-lg font-semibold transition-all shadow-[3px_3px_0px_0px_var(--border-default)] text-sm"
            >
              <FilePlus size={16} />
              Create Form
            </Link>
          </div>
        </div>

        {/* Filters, View Switcher & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Tabs */}
            <div className="flex bg-surface-secondary p-1 rounded-xl w-fit border border-border-default overflow-x-auto shadow-[2px_2px_0px_0px_var(--border-default)]">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
                    activeTab === tab
                      ? "bg-surface-elevated text-text-primary shadow-[2px_2px_0px_0px_var(--accent-primary)] border border-border-default"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* View Tool: Cards vs List Toggle */}
            <div className="flex items-center bg-surface-secondary p-1 rounded-xl border border-border-default shadow-[2px_2px_0px_0px_var(--border-default)]">
              <button
                type="button"
                onClick={() => setViewMode("card")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  viewMode === "card"
                    ? "bg-surface-elevated text-accent-primary border border-border-default shadow-[2px_2px_0px_0px_var(--accent-primary)] font-bold"
                    : "text-text-secondary hover:text-text-primary"
                }`}
                title="Cards view"
              >
                <LayoutGrid size={15} />
                <span className="hidden sm:inline">Cards</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-surface-elevated text-accent-primary border border-border-default shadow-[2px_2px_0px_0px_var(--accent-primary)] font-bold"
                    : "text-text-secondary hover:text-text-primary"
                }`}
                title="List view"
              >
                <ListIcon size={15} />
                <span className="hidden sm:inline">List</span>
              </button>
            </div>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border-default bg-surface-elevated text-text-primary focus:ring-2 focus:ring-accent-primary focus:border-transparent outline-none transition-all shadow-sm text-sm"
            />
          </div>
        </div>
      </div>

      {deleteError && (
        <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
          {deleteError}
        </div>
      )}

      {/* Events Section */}
      {(activeTab === "All" || activeTab === "Events") && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-text-primary">
              <Calendar className="text-accent-primary" size={20} />
              Active Events
              <span className="ml-1 px-2 py-0.5 text-xs bg-surface-secondary rounded-full text-text-secondary font-bold">
                {filteredEvents.length}
              </span>
            </h3>
          </div>

          {filteredEvents.length === 0 ? (
            <EmptyState query={searchQuery} />
          ) : viewMode === "list" ? (
            /* Events List View */
            <div className="bg-surface-elevated rounded-2xl border border-border-default overflow-x-auto shadow-[4px_4px_0px_0px_var(--border-default)]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-surface-secondary border-b border-border-default text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Event Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Date &amp; Time</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Attendees</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedEvents.map((event) => (
                    <tr
                      key={event._id}
                      onClick={() => router.push(`/dashboard/manage-events/event-detail/${event._id}`)}
                      className="border-b border-border-default hover:bg-surface-secondary/60 cursor-pointer transition"
                    >
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            event.status === "completed"
                              ? "bg-surface-secondary text-text-secondary"
                              : event.status === "cancelled"
                              ? "bg-accent-error/15 text-accent-error"
                              : "bg-accent-success/15 text-accent-success border border-accent-success/30"
                          }`}
                        >
                          {event.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-text-primary hover:text-accent-primary">
                        {event.title}
                      </td>
                      <td className="py-3.5 px-4 text-text-secondary">{event.category || "General"}</td>
                      <td className="py-3.5 px-4 text-text-secondary">
                        {event.date
                          ? new Date(event.date).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "TBA"}
                      </td>
                      <td className="py-3.5 px-4 text-text-secondary truncate max-w-[140px]">
                        {event.location || "TBA"}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-text-primary">{event.attendees?.length || 0}</span>{" "}
                        registered
                      </td>
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => router.push(`/dashboard/manage-events/event-detail/${event._id}`)}
                            className="p-1.5 rounded-lg border border-border-default bg-surface-elevated text-text-secondary hover:text-accent-primary transition"
                            title="Edit / Manage"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => handleDelete(event._id, "event")}
                            className="p-1.5 rounded-lg border border-border-default bg-surface-elevated text-text-secondary hover:text-accent-error transition"
                            title="Delete Event"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Events Card View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedEvents.map((event) => (
                <div
                  key={event._id}
                  onClick={() => router.push(`/dashboard/manage-events/event-detail/${event._id}`)}
                  className="group relative bg-surface-elevated p-6 rounded-2xl shadow-[4px_4px_0px_0px_var(--border-default)] hover:shadow-[6px_6px_0px_0px_var(--border-default)] hover:-translate-y-0.5 border border-border-default transition-all duration-200 flex flex-col justify-between cursor-pointer"
                >
                  {/* Dropdown */}
                  <div
                    className="absolute top-4 right-4 z-10"
                    ref={openDropdown === event._id ? dropdownRef : null}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdown(openDropdown === event._id ? null : event._id);
                      }}
                      className="p-1.5 hover:bg-surface-secondary rounded-lg text-text-secondary transition-colors"
                      aria-label="Options"
                    >
                      <MoreVertical size={18} />
                    </button>
                    {openDropdown === event._id && (
                      <div
                        className="absolute right-0 mt-1 w-44 bg-surface-elevated rounded-xl shadow-[4px_4px_0px_0px_var(--border-default)] border border-border-default z-20 py-1 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/dashboard/manage-events/event-detail/${event._id}`);
                            setOpenDropdown(null);
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-xs font-semibold text-text-primary hover:bg-surface-secondary transition"
                        >
                          <Pencil size={13} /> Edit / Manage
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(event._id, "event");
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-xs font-semibold text-accent-error hover:bg-surface-secondary transition"
                        >
                          <Trash2 size={13} /> Delete Event
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-2 py-1 rounded-md bg-accent-primary-light text-text-primary text-[10px] font-bold uppercase tracking-wider">
                        {event.category || "General"}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          event.status === "completed"
                            ? "bg-surface-secondary text-text-secondary"
                            : event.status === "cancelled"
                            ? "bg-accent-error/20 text-accent-error"
                            : "bg-accent-success text-surface-elevated"
                        }`}
                      >
                        {event.status}
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-text-primary group-hover:text-accent-primary transition-colors pr-6">
                      {event.title}
                    </h3>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-sm text-text-secondary gap-2">
                        <Calendar size={14} />
                        {event.date
                          ? new Date(event.date).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "TBA"}
                      </div>
                      <div className="flex items-center text-sm text-text-secondary gap-2">
                        <Users size={14} />
                        <span className="font-semibold text-text-primary">
                          {event.attendees?.length ?? 0}
                        </span>{" "}
                        registered
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border-default flex items-center justify-between">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/dashboard/manage-events/event-detail/${event._id}`);
                      }}
                      className="text-sm font-semibold text-accent-primary flex items-center gap-1 hover:underline"
                    >
                      Manage <ChevronRight size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/dashboard/manage-events/event-detail/${event._id}`);
                      }}
                      className="text-sm font-semibold text-text-secondary hover:text-text-primary"
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Events Pagination */}
          {totalEventPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border-default flex-wrap gap-3">
              <p className="text-xs text-text-secondary font-medium">
                Showing{" "}
                <span className="font-bold text-text-primary">
                  {(eventPage - 1) * PAGE_SIZE + 1}&#8211;{Math.min(eventPage * PAGE_SIZE, filteredEvents.length)}
                </span>{" "}
                of <span className="font-bold text-text-primary">{filteredEvents.length}</span> events
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setEventPage((p) => Math.max(1, p - 1))}
                  disabled={eventPage === 1}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg border border-border-default bg-surface-elevated hover:border-accent-primary disabled:opacity-40 transition flex items-center gap-1"
                >
                  <ChevronLeft size={13} /> Prev
                </button>
                {Array.from({ length: totalEventPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setEventPage(p)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition ${
                      eventPage === p
                        ? "bg-accent-primary text-white border-accent-primary shadow-[2px_2px_0px_0px_var(--text-primary)]"
                        : "bg-surface-elevated text-text-primary border-border-default hover:border-accent-primary"
                    }`}
                    style={eventPage === p ? { color: "#FFFFFF" } : {}}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setEventPage((p) => Math.min(totalEventPages, p + 1))}
                  disabled={eventPage === totalEventPages}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg border border-border-default bg-surface-elevated hover:border-accent-primary disabled:opacity-40 transition flex items-center gap-1"
                >
                  Next <ChevronRight size={13} />
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Forms Section */}
      {(activeTab === "All" || activeTab === "Forms") && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-text-primary">
              <FilePlus className="text-accent-primary" size={20} />
              Active Forms
              <span className="ml-1 px-2 py-0.5 text-xs bg-surface-secondary rounded-full text-text-secondary font-bold">
                {filteredForms.length}
              </span>
            </h3>
          </div>

          {filteredForms.length === 0 ? (
            <EmptyState query={searchQuery} />
          ) : viewMode === "list" ? (
            /* Forms List View */
            <div className="bg-surface-elevated rounded-2xl border border-border-default overflow-x-auto shadow-[4px_4px_0px_0px_var(--border-default)]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-surface-secondary border-b border-border-default text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Form Title</th>
                    <th className="py-3 px-4">Publish Date</th>
                    <th className="py-3 px-4">Deadline</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedForms.map((form) => (
                    <tr
                      key={form._id}
                      onClick={() => router.push(`/dashboard/manage-events/forms/${form._id}`)}
                      className="border-b border-border-default hover:bg-surface-secondary/60 cursor-pointer transition"
                    >
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            form.status === "closed"
                              ? "bg-surface-secondary text-text-secondary"
                              : "bg-accent-success/15 text-accent-success border border-accent-success/30"
                          }`}
                        >
                          {form.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-text-primary hover:text-accent-primary">
                        {form.title}
                      </td>
                      <td className="py-3.5 px-4 text-text-secondary">
                        {form.startDate
                          ? new Date(form.startDate).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : form.createdAt
                          ? new Date(form.createdAt).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "N/A"}
                      </td>
                      <td className="py-3.5 px-4 text-text-secondary">
                        {form.endDate
                          ? new Date(form.endDate).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "No deadline"}
                      </td>
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => router.push(`/dashboard/manage-events/forms/${form._id}`)}
                            className="px-2.5 py-1.5 rounded-lg border border-border-default bg-surface-elevated text-xs font-bold text-accent-primary hover:underline transition"
                          >
                            Responses
                          </button>
                          <button
                            onClick={() => router.push(`/dashboard/manage-events/forms/${form._id}/edit`)}
                            className="p-1.5 rounded-lg border border-border-default bg-surface-elevated text-text-secondary hover:text-accent-primary transition"
                            title="Edit Form"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => handleDelete(form._id, "form")}
                            className="p-1.5 rounded-lg border border-border-default bg-surface-elevated text-text-secondary hover:text-accent-error transition"
                            title="Delete Form"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Forms Card View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedForms.map((form) => (
                <div
                  key={form._id}
                  onClick={() => router.push(`/dashboard/manage-events/forms/${form._id}`)}
                  className="group relative bg-surface-elevated p-6 rounded-2xl shadow-[4px_4px_0px_0px_var(--border-default)] hover:shadow-[6px_6px_0px_0px_var(--border-default)] hover:-translate-y-0.5 border border-border-default transition-all duration-200 flex flex-col justify-between cursor-pointer"
                >
                  {/* Dropdown */}
                  <div
                    className="absolute top-4 right-4 z-10"
                    ref={openDropdown === form._id ? dropdownRef : null}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdown(openDropdown === form._id ? null : form._id);
                      }}
                      className="p-1.5 hover:bg-surface-secondary rounded-lg text-text-secondary transition-colors"
                      aria-label="Options"
                    >
                      <MoreVertical size={18} />
                    </button>
                    {openDropdown === form._id && (
                      <div
                        className="absolute right-0 mt-1 w-44 bg-surface-elevated rounded-xl shadow-[4px_4px_0px_0px_var(--border-default)] border border-border-default z-20 py-1 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/dashboard/manage-events/forms/${form._id}/edit`);
                            setOpenDropdown(null);
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-xs font-semibold text-text-primary hover:bg-surface-secondary transition"
                        >
                          <Pencil size={13} /> Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/dashboard/manage-events/forms/${form._id}`);
                            setOpenDropdown(null);
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-xs font-semibold text-text-primary hover:bg-surface-secondary transition"
                        >
                          <Eye size={13} /> View Details
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(form._id, "form");
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-xs font-semibold text-accent-error hover:bg-surface-secondary transition"
                        >
                          <Trash2 size={13} /> Delete Form
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="inline-block px-2 py-1 rounded-md bg-accent-success text-surface-elevated text-[10px] font-semibold uppercase tracking-wider mb-4">
                      {form.status}
                    </div>
                    <h3 className="text-base font-semibold text-text-primary group-hover:text-accent-primary transition-colors pr-6">
                      {form.title}
                    </h3>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-sm text-text-secondary gap-2">
                        <Calendar size={14} />
                        Ends: {form.endDate ? new Date(form.endDate).toDateString().split(" ").slice(1).join(" ") : "No deadline"}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border-default flex items-center justify-between">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/dashboard/manage-events/forms/${form._id}`);
                      }}
                      className="text-sm font-semibold text-accent-primary flex items-center gap-1 hover:underline"
                    >
                      View Responses <ChevronRight size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/dashboard/manage-events/forms/${form._id}/edit`);
                      }}
                      className="text-sm font-semibold text-text-secondary hover:text-accent-primary transition"
                    >
                      Edit Form
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Forms Pagination */}
          {totalFormPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border-default flex-wrap gap-3">
              <p className="text-xs text-text-secondary font-medium">
                Showing{" "}
                <span className="font-bold text-text-primary">
                  {(formPage - 1) * PAGE_SIZE + 1}&#8211;{Math.min(formPage * PAGE_SIZE, filteredForms.length)}
                </span>{" "}
                of <span className="font-bold text-text-primary">{filteredForms.length}</span> forms
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setFormPage((p) => Math.max(1, p - 1))}
                  disabled={formPage === 1}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg border border-border-default bg-surface-elevated hover:border-accent-primary disabled:opacity-40 transition flex items-center gap-1"
                >
                  <ChevronLeft size={13} /> Prev
                </button>
                {Array.from({ length: totalFormPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setFormPage(p)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition ${
                      formPage === p
                        ? "bg-accent-primary text-white border-accent-primary shadow-[2px_2px_0px_0px_var(--text-primary)]"
                        : "bg-surface-elevated text-text-primary border-border-default hover:border-accent-primary"
                    }`}
                    style={formPage === p ? { color: "#FFFFFF" } : {}}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setFormPage((p) => Math.min(totalFormPages, p + 1))}
                  disabled={formPage === totalFormPages}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg border border-border-default bg-surface-elevated hover:border-accent-primary disabled:opacity-40 transition flex items-center gap-1"
                >
                  Next <ChevronRight size={13} />
                </button>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function EmptyState({ query }: { query?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-surface-elevated rounded-2xl border border-dashed border-border-default text-center">
      <div className="w-12 h-12 rounded-full bg-surface-secondary flex items-center justify-center text-text-secondary mb-4">
        <Search size={24} />
      </div>
      <h3 className="text-base font-semibold text-text-primary">No items found</h3>
      <p className="text-sm text-text-secondary mt-1 max-w-sm">
        {query ? `No events or forms matching "${query}".` : "Get started by creating your first event or form."}
      </p>
    </div>
  );
}
