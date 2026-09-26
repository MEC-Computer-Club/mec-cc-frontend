"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Mail,
  UserCheck,
  Plus,
  X,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Send,
  Search,
  AtSign,
  Tag,
  Edit2,
  Check,
} from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";
import UserAvatarWithFallback from "@/components/ui/shared/UserAvatarWithFallback";
import toast from "react-hot-toast";

interface StaffUser {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  clubRole?: string;
  imageUrl?: string;
  imagePosition?: string;
  designation?: string;
}

export interface RoutingRecipient {
  email: string;
  label?: string;
}

interface ChannelConfig {
  enabled: boolean;
  recipients: RoutingRecipient[];
}

interface EmailRoutingData {
  registrationApproval: ChannelConfig;
  contactMessages: ChannelConfig;
}

interface ChannelSectionProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  enabled: boolean;
  recipients: RoutingRecipient[];
  staffUsers: StaffUser[];
  onToggle: (enabled: boolean) => void;
  onAdd: (email: string, label?: string) => void;
  onUpdateLabel: (email: string, label: string) => void;
  onRemove: (email: string) => void;
}

function ChannelSection({
  title,
  description,
  icon: Icon,
  iconColor,
  enabled,
  recipients,
  staffUsers,
  onToggle,
  onAdd,
  onUpdateLabel,
  onRemove,
}: ChannelSectionProps) {
  const [query, setQuery] = useState("");
  const [customLabel, setCustomLabel] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [editingEmail, setEditingEmail] = useState<string | null>(null);
  const [tempEditLabel, setTempEditLabel] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter available staff: not yet added, matches query
  const q = query.trim().toLowerCase();
  const availableStaff = staffUsers.filter(
    (s) => !recipients.some((r) => r.email.toLowerCase() === s.email.toLowerCase())
  );

  const filteredStaff = q
    ? availableStaff.filter(
        (s) =>
          s.fullName.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.role.toLowerCase().includes(q) ||
          (s.designation && s.designation.toLowerCase().includes(q))
      )
    : availableStaff;

  const isQueryValidEmail = q.includes("@") && q.includes(".");
  const isRegisteredStaffEmail = staffUsers.some(
    (s) => s.email.toLowerCase() === q
  );
  const isCustomEmail = isQueryValidEmail && !isRegisteredStaffEmail;
  const isAlreadyAdded = recipients.some((r) => r.email.toLowerCase() === q);

  const handleSelectStaff = (staff: StaffUser) => {
    // Registered staff do not have custom labels
    onAdd(staff.email, "");
    setQuery("");
    setCustomLabel("");
    setIsDropdownOpen(false);
  };

  const handleAddCustom = () => {
    if (!isQueryValidEmail) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (isAlreadyAdded) {
      toast.error("This email is already in the recipient list.");
      return;
    }
    // Only custom emails take a custom label
    const labelToSave = isCustomEmail ? customLabel.trim() : "";
    onAdd(query.trim().toLowerCase(), labelToSave);
    setQuery("");
    setCustomLabel("");
    setIsDropdownOpen(false);
  };

  const handleSaveEditLabel = (email: string) => {
    onUpdateLabel(email, tempEditLabel.trim());
    setEditingEmail(null);
    setTempEditLabel("");
  };

  return (
    <div className="bg-white dark:bg-gray-900 border-2 border-gray-900 dark:border-gray-700 rounded-xl p-5 sm:p-6 shadow-[3px_3px_0px_0px_#111827] dark:shadow-[3px_3px_0px_0px_#374151]">
      {/* Channel Header & Enable Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Icon className={`w-5 h-5 ${iconColor}`} />
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
              {title}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>

        <label className="relative inline-flex items-center cursor-pointer shrink-0">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => onToggle(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span className="ml-2.5 text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200">
            {enabled ? "Active" : "Disabled"}
          </span>
        </label>
      </div>

      {enabled ? (
        <div className="mt-5 space-y-5">
          {/* Search / Selection input with Suggestions Dropdown */}
          <div className="relative" ref={containerRef}>
            <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              Add Recipient:
            </label>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search staff by name/role, or enter custom email..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (filteredStaff.length > 0 && query.trim() && !isQueryValidEmail) {
                        handleSelectStaff(filteredStaff[0]);
                      } else if (isQueryValidEmail) {
                        handleAddCustom();
                      }
                    }
                  }}
                  className="w-full pl-9 pr-3.5 py-2 text-sm bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 text-gray-900 dark:text-white"
                />
              </div>

              {/* Custom Label Input: appears ONLY for custom emails */}
              {isCustomEmail && (
                <div className="relative sm:w-64 animate-fadeIn">
                  <Tag className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Label (e.g. Chief Advisor, Dean)"
                    value={customLabel}
                    onChange={(e) => setCustomLabel(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCustom();
                      }
                    }}
                    className="w-full pl-9 pr-3.5 py-2 text-sm bg-white dark:bg-gray-800 border-2 border-blue-500 rounded-lg focus:outline-none text-gray-900 dark:text-white"
                  />
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  if (filteredStaff.length > 0 && query.trim() && !isQueryValidEmail) {
                    handleSelectStaff(filteredStaff[0]);
                  } else if (isQueryValidEmail) {
                    handleAddCustom();
                  } else {
                    setIsDropdownOpen(true);
                  }
                }}
                className="px-4 py-2 bg-gray-900 text-white dark:bg-white dark:text-gray-900 font-bold text-xs sm:text-sm rounded-lg flex items-center justify-center gap-1.5 hover:opacity-90 transition shrink-0"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>

            {/* Suggestions Popover / Dropdown */}
            {isDropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-1.5 z-30 bg-white dark:bg-gray-900 border border-gray-900 dark:border-gray-700 rounded-lg shadow-[4px_4px_0px_0px_#2563eb] overflow-hidden max-h-60 overflow-y-auto">
                {/* Option to add custom typed email with label */}
                {isQueryValidEmail && !isAlreadyAdded && (
                  <div
                    onClick={handleAddCustom}
                    className="p-2.5 bg-blue-50 dark:bg-blue-950/40 border-b border-gray-200 dark:border-gray-800 cursor-pointer flex items-center justify-between hover:bg-blue-100 dark:hover:bg-blue-900/50 transition"
                  >
                    <div className="flex items-center gap-2">
                      <AtSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                        Add &ldquo;{query.trim()}&rdquo; {customLabel.trim() ? `as "${customLabel.trim()}"` : "(Custom Recipient)"}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
                      Press Enter
                    </span>
                  </div>
                )}

                {/* Staff suggestions */}
                {filteredStaff.length > 0 ? (
                  filteredStaff.slice(0, 12).map((staff) => (
                    <div
                      key={`suggestion-${staff._id}`}
                      onClick={() => handleSelectStaff(staff)}
                      className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 last:border-b-0 cursor-pointer flex items-center justify-between gap-3 hover:bg-blue-50 dark:hover:bg-gray-800 transition"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <UserAvatarWithFallback
                          initialImageUrl={staff.imageUrl}
                          fullName={staff.fullName}
                          imagePosition={staff.imagePosition}
                          w={28}
                          h={28}
                        />
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate">
                            {staff.fullName}
                          </p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                            {staff.email}
                          </p>
                        </div>
                      </div>

                      <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 shrink-0">
                        {staff.designation || staff.role}
                      </span>
                    </div>
                  ))
                ) : (
                  !isQueryValidEmail && (
                    <div className="p-3 text-center text-xs text-gray-500 dark:text-gray-400">
                      No matching staff members found. Enter an email address to add as custom recipient.
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Selected Recipients Display */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Selected Recipients ({recipients.length}):
              </span>
            </div>

            {recipients.length === 0 ? (
              <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-lg text-xs sm:text-sm text-amber-700 dark:text-amber-400 flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                No recipients assigned yet. Search staff or enter custom email above to add.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {recipients.map((rec) => {
                  const staff = staffUsers.find(
                    (s) => s.email.toLowerCase() === rec.email.toLowerCase()
                  );
                  const isCustom = !staff;
                  const isEditing = isCustom && editingEmail === rec.email;

                  return (
                    <div
                      key={`selected-${rec.email}`}
                      className="border-2 border-gray-900 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/70 rounded-lg p-2.5 flex items-center justify-between gap-2.5 shadow-[2px_2px_0px_0px_#111827] dark:shadow-[2px_2px_0px_0px_#374151]"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        {staff ? (
                          <UserAvatarWithFallback
                            initialImageUrl={staff.imageUrl}
                            fullName={staff.fullName}
                            imagePosition={staff.imagePosition}
                            w={32}
                            h={32}
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 flex items-center justify-center shrink-0">
                            <Mail className="w-4 h-4" />
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          {isEditing ? (
                            <div className="flex items-center gap-1 my-0.5">
                              <input
                                type="text"
                                autoFocus
                                value={tempEditLabel}
                                placeholder="e.g. Chief Advisor..."
                                onChange={(e) => setTempEditLabel(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleSaveEditLabel(rec.email);
                                  if (e.key === "Escape") setEditingEmail(null);
                                }}
                                className="px-1.5 py-0.5 text-xs bg-white dark:bg-gray-900 border border-blue-500 rounded text-gray-900 dark:text-white w-full"
                              />
                              <button
                                type="button"
                                onClick={() => handleSaveEditLabel(rec.email)}
                                className="p-0.5 text-emerald-600 hover:text-emerald-700"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 min-w-0">
                              <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                                {staff ? staff.fullName : rec.label || rec.email}
                              </p>

                              {/* For registered staff: display official role badge, NO edit option */}
                              {staff && (
                                <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 shrink-0">
                                  {staff.designation || staff.role}
                                </span>
                              )}

                              {/* For custom email: display custom badge & label editing */}
                              {isCustom && rec.label && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingEmail(rec.email);
                                    setTempEditLabel(rec.label || "");
                                  }}
                                  title="Edit custom label"
                                  className="group inline-flex items-center gap-1 px-1.5 py-0.2 text-[9px] font-extrabold uppercase rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition shrink-0"
                                >
                                  <span>Custom</span>
                                  <Edit2 className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100" />
                                </button>
                              )}

                              {isCustom && !rec.label && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingEmail(rec.email);
                                    setTempEditLabel("");
                                  }}
                                  title="Add custom label"
                                  className="px-1 py-0.2 text-[9px] font-semibold rounded border border-dashed border-gray-400 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 shrink-0"
                                >
                                  + Label
                                </button>
                              )}
                            </div>
                          )}

                          <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                            {rec.email}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemove(rec.email)}
                        title="Remove recipient"
                        className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800/40 rounded-lg text-xs text-gray-500 dark:text-gray-400 italic">
          Notifications for this event are currently disabled.
        </div>
      )}
    </div>
  );
}

export default function EmailRoutingSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>([]);

  const [routing, setRouting] = useState<EmailRoutingData>({
    registrationApproval: { enabled: true, recipients: [] },
    contactMessages: { enabled: true, recipients: [] },
  });

  // Normalization helper for received data
  const normalizeReceivedRecipients = (rawList: any[]): RoutingRecipient[] => {
    if (!Array.isArray(rawList)) return [];
    return rawList.map((item) => {
      if (typeof item === "string") {
        return { email: item.trim().toLowerCase(), label: "" };
      }
      return {
        email: String(item.email || "").trim().toLowerCase(),
        label: item.label ? String(item.label).trim() : "",
      };
    });
  };

  // Fetch initial routing settings and eligible staff
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [routingRes, staffRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/email-routing`, { withCredentials: true }),
          axios.get(`${API_BASE_URL}/api/email-routing/staff-users`, { withCredentials: true }),
        ]);

        if (routingRes.data?.data) {
          setRouting({
            registrationApproval: {
              enabled: routingRes.data.data.registrationApproval?.enabled ?? true,
              recipients: normalizeReceivedRecipients(
                routingRes.data.data.registrationApproval?.recipients
              ),
            },
            contactMessages: {
              enabled: routingRes.data.data.contactMessages?.enabled ?? true,
              recipients: normalizeReceivedRecipients(
                routingRes.data.data.contactMessages?.recipients
              ),
            },
          });
        }

        if (staffRes.data?.data) {
          setStaffUsers(staffRes.data.data);
        }
      } catch (err: any) {
        console.error("Failed to load email routing settings:", err);
        toast.error("Failed to load email routing configuration.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddRecipient = (
    channel: "registrationApproval" | "contactMessages",
    email: string,
    label?: string
  ) => {
    const normalized = email.trim().toLowerCase();
    const current = routing[channel].recipients || [];
    if (current.some((r) => r.email.toLowerCase() === normalized)) return;

    setRouting((prev) => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        recipients: [...current, { email: normalized, label: label?.trim() || "" }],
      },
    }));
  };

  const handleUpdateLabel = (
    channel: "registrationApproval" | "contactMessages",
    email: string,
    label: string
  ) => {
    const normalized = email.trim().toLowerCase();
    setRouting((prev) => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        recipients: prev[channel].recipients.map((r) =>
          r.email.toLowerCase() === normalized ? { ...r, label: label.trim() } : r
        ),
      },
    }));
  };

  const handleRemoveRecipient = (
    channel: "registrationApproval" | "contactMessages",
    email: string
  ) => {
    const normalized = email.trim().toLowerCase();
    setRouting((prev) => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        recipients: prev[channel].recipients.filter(
          (r) => r.email.toLowerCase() !== normalized
        ),
      },
    }));
  };

  const handleToggleChannel = (
    channel: "registrationApproval" | "contactMessages",
    enabled: boolean
  ) => {
    setRouting((prev) => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        enabled,
      },
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await axios.put(`${API_BASE_URL}/api/email-routing`, routing, {
        withCredentials: true,
      });

      if (res.data?.success) {
        toast.success("Email routing preferences saved successfully!");
      }
    } catch (err: any) {
      console.error("Save error:", err);
      toast.error(err.response?.data?.message || "Failed to save email routing settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          Loading email routing settings...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Minimal Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            Email Routing & Delivery Rules
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Configure automated email recipients for member registration approvals and contact messages.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-lg border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Changes
            </>
          )}
        </button>
      </div>

      {/* Channel 1: Member Registration Approvals */}
      <ChannelSection
        title="Member Registration Approvals"
        description="Recipients notified when a new member registers requiring review & verification."
        icon={UserCheck}
        iconColor="text-indigo-600 dark:text-indigo-400"
        enabled={routing.registrationApproval.enabled}
        recipients={routing.registrationApproval.recipients}
        staffUsers={staffUsers}
        onToggle={(enabled) => handleToggleChannel("registrationApproval", enabled)}
        onAdd={(email, label) => handleAddRecipient("registrationApproval", email, label)}
        onUpdateLabel={(email, label) => handleUpdateLabel("registrationApproval", email, label)}
        onRemove={(email) => handleRemoveRecipient("registrationApproval", email)}
      />

      {/* Channel 2: Contact Form Inquiries */}
      <ChannelSection
        title="Contact Form Inquiries"
        description="Recipients notified when a visitor or student submits a message via the Contact page."
        icon={Send}
        iconColor="text-emerald-600 dark:text-emerald-400"
        enabled={routing.contactMessages.enabled}
        recipients={routing.contactMessages.recipients}
        staffUsers={staffUsers}
        onToggle={(enabled) => handleToggleChannel("contactMessages", enabled)}
        onAdd={(email, label) => handleAddRecipient("contactMessages", email, label)}
        onUpdateLabel={(email, label) => handleUpdateLabel("contactMessages", email, label)}
        onRemove={(email) => handleRemoveRecipient("contactMessages", email)}
      />

      {/* Bottom Save Action */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg border-2 border-black dark:border-white shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Saving Preferences...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Preferences
            </>
          )}
        </button>
      </div>
    </div>
  );
}
