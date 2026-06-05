"use client";
import Logo from "@/components/global/logo";
import {
  BarChart, Briefcase, Inbox, Layout, LogOut, Menu, X,
  CheckCircle, AlertCircle, Calendar, Mail, Clock, ChevronRight, KeyRound,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/client";
import { AdminProjectsManager } from "@/app/admin/_components/adminProjectManager";
import {
  deleteProjectAction,
  addProjectAction,
  updateProjectAction,
  markInquiryReadAction,
  updateBookingStatusAction,
} from "@/app/admin/dashboard/_components/adminActions";
import { useRouter } from "next/navigation";

// ─── Types ───────────────────────────────────────────────────────────────────

interface AdminUser { email: string; id: string }

interface Toast { message: string; type: "success" | "error" }

interface Props {
  initialProjects: any[];
  initialInquiries: any[];
  initialBookings: any[];
  user: AdminUser;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getInitials = (email: string) => {
  const local = email.split("@")[0];
  const parts = local.split(/[._-]/);
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : local.slice(0, 2).toUpperCase();
};

const formatDate = (raw: string) =>
  raw
    ? new Date(raw).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "—";

const STATUS_BOOKING: Record<string, string> = {
  pending:   "text-amber-400 bg-amber-500/10 border-amber-500/20",
  confirmed: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  cancelled: "text-red-400 bg-red-500/10 border-red-500/20",
};

// ─── Sidebar nav config ───────────────────────────────────────────────────────

const NAV = [
  { label: "Overview",  tab: "overview",  icon: BarChart },
  { label: "Projects",  tab: "projects",  icon: Briefcase },
  { label: "Inquiries", tab: "inquiries", icon: Inbox },
  { label: "Bookings",  tab: "bookings",  icon: Calendar },
  { label: "Settings",  tab: "settings",  icon: Layout },
];

// ─── Component ────────────────────────────────────────────────────────────────

export const AdminDashboard = ({ initialProjects, initialInquiries, initialBookings, user }: Props) => {
  const [activeTab, setActiveTab]       = useState("overview");
  const [projects,  setProjects]        = useState(initialProjects);
  const [inquiries, setInquiries]       = useState(initialInquiries);
  const [bookings,  setBookings]        = useState(initialBookings);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [toast,      setToast]          = useState<Toast | null>(null);
  const [expandedInquiry, setExpanded]  = useState<any | null>(null);

  // Settings form state
  const [newPw,      setNewPw]     = useState("");
  const [confirmPw,  setConfirmPw] = useState("");
  const [pwLoading,  setPwLoading] = useState(false);

  const router = useRouter();
  const initials = getInitials(user.email);

  // ── Toast ─────────────────────────────────────────────────────────────────

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  // ── Auth ──────────────────────────────────────────────────────────────────

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  // ── Projects ──────────────────────────────────────────────────────────────

  const handleDeleteProject = async (id: number) => {
    setProjects((prev: any[]) => prev.filter((p: any) => p.id !== id));
    const { error } = await deleteProjectAction(id.toString());
    if (error) {
      showToast(error, "error");
      setProjects(initialProjects);
    } else {
      showToast("Project deleted");
    }
  };

  const handleAddProject = async (project: any): Promise<boolean> => {
    const { data, error } = await addProjectAction(project);
    if (error) { showToast(error, "error"); return false; }
    if (data) {
      setProjects((prev: any[]) => [data[0], ...prev]);
      showToast("Project added successfully");
      return true;
    }
    return false;
  };

  const handleUpdateProject = async (id: number, project: any): Promise<boolean> => {
    const { data, error } = await updateProjectAction(id.toString(), project);
    if (error) { showToast(error, "error"); return false; }
    if (data) {
      setProjects((prev: any[]) => prev.map((p: any) => (p.id === id ? data[0] : p)));
      showToast("Project updated");
      return true;
    }
    return false;
  };

  // ── Inquiries ─────────────────────────────────────────────────────────────

  const handleInquiryClick = async (inq: any) => {
    setExpanded(inq);
    if (!inq.read) {
      setInquiries((prev: any[]) => prev.map((i: any) => (i.id === inq.id ? { ...i, read: true } : i)));
      await markInquiryReadAction(inq.id.toString());
    }
  };

  // ── Bookings ──────────────────────────────────────────────────────────────

  const handleBookingStatus = async (id: number, status: string) => {
    setBookings((prev: any[]) => prev.map((b: any) => (b.id === id ? { ...b, status } : b)));
    const { error } = await updateBookingStatusAction(id.toString(), status);
    if (error) {
      showToast(error, "error");
      setBookings(initialBookings);
    } else {
      showToast(`Booking marked as ${status}`);
    }
  };

  // ── Password change ───────────────────────────────────────────────────────

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw !== confirmPw) { showToast("Passwords do not match", "error"); return; }
    if (newPw.length < 8)    { showToast("Password must be at least 8 characters", "error"); return; }
    setPwLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPw });
    setPwLoading(false);
    if (error) { showToast(error.message, "error"); }
    else { showToast("Password updated successfully"); setNewPw(""); setConfirmPw(""); }
  };

  // ── Derived stats ─────────────────────────────────────────────────────────

  const unreadCount  = inquiries.filter((i: any) => !i.read).length;
  const pendingCount = bookings.filter((b: any)  => b.status === "pending").length;

  // ── Sidebar ───────────────────────────────────────────────────────────────

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-white/5">
        <Logo />
        <div className="mt-4 px-2 py-1 bg-teal-500/10 rounded border border-teal-500/20 text-xs text-teal-400 font-mono text-center">
          ADMIN PORTAL
        </div>
      </div>

      <nav className="p-4 space-y-1 flex-grow">
        {NAV.map(({ label, tab, icon: Icon }) => {
          const isActive = activeTab === tab;
          const badge =
            tab === "inquiries" && unreadCount > 0 ? unreadCount :
            tab === "bookings"  && pendingCount > 0 ? pendingCount : null;
          return (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setMobileOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-gradient-to-r from-teal-500/10 to-transparent border-l-2 border-teal-500 text-teal-400"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 text-left">{label}</span>
              {badge !== null && (
                <span className="ml-auto text-xs bg-teal-500/20 text-teal-400 border border-teal-500/30 px-1.5 py-0.5 rounded-full font-mono">
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5 space-y-2">
        <div className="px-4 py-2 text-xs text-gray-600 truncate">{user.email}</div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </>
  );

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#020405] text-white font-sans">

      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#050505] border-r border-white/5 hidden md:flex flex-col z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={`fixed left-0 top-0 h-full w-72 bg-[#050505] border-r border-white/5 flex flex-col z-50 md:hidden transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="md:ml-64 p-4 md:p-8">

        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                Welcome back
              </h1>
              <p className="text-gray-500 text-sm">
                System Status: <span className="text-emerald-400">● Online</span>
              </p>
            </div>
          </div>
          <div
            className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center font-bold text-white shadow-lg text-sm flex-shrink-0"
            title={user.email}
          >
            {initials}
          </div>
        </header>

        {/* ── Overview ───────────────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {[
                {
                  label: "Active Projects", val: projects.length,
                  sub: "in portfolio", color: "text-cyan-400", border: "border-cyan-500/20",
                },
                {
                  label: "Inquiries", val: inquiries.length,
                  sub: unreadCount > 0 ? `${unreadCount} unread` : "all read",
                  color: unreadCount > 0 ? "text-teal-400" : "text-gray-500",
                  border: "border-teal-500/20",
                },
                {
                  label: "Bookings", val: bookings.length,
                  sub: pendingCount > 0 ? `${pendingCount} pending` : "all handled",
                  color: pendingCount > 0 ? "text-amber-400" : "text-gray-500",
                  border: "border-amber-500/20",
                },
                {
                  label: "Unread Messages", val: unreadCount,
                  sub: "need attention", color: unreadCount > 0 ? "text-rose-400" : "text-gray-500",
                  border: "border-rose-500/20",
                },
              ].map((stat, i) => (
                <div key={i} className={`bg-[#080808] border ${stat.border} p-6 rounded-xl`}>
                  <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">{stat.label}</div>
                  <div className="text-3xl font-bold text-white mb-1">{stat.val}</div>
                  <div className={`text-xs ${stat.color}`}>{stat.sub}</div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-[#080808] border border-white/5 rounded-xl p-6">
              <h3 className="font-bold text-white mb-4">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: "Manage Projects",  tab: "projects"  },
                  { label: "View Inquiries",   tab: "inquiries" },
                  { label: "View Bookings",    tab: "bookings"  },
                ].map(({ label, tab }) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg text-sm text-white flex items-center gap-2 transition-colors"
                  >
                    {label} <ChevronRight className="w-3 h-3 text-gray-500" />
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Inquiries preview */}
            {inquiries.length > 0 && (
              <div className="bg-[#080808] border border-white/5 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
                  <h3 className="font-bold text-white">Recent Inquiries</h3>
                  <button onClick={() => setActiveTab("inquiries")} className="text-teal-400 text-xs hover:underline">
                    View all
                  </button>
                </div>
                <div className="divide-y divide-white/5">
                  {inquiries.slice(0, 5).map((inq: any) => (
                    <button
                      key={inq.id}
                      onClick={() => handleInquiryClick(inq)}
                      className={`w-full text-left p-4 hover:bg-white/5 transition-colors flex justify-between items-center ${!inq.read ? "bg-teal-500/5" : ""}`}
                    >
                      <div className="flex gap-3 items-center min-w-0">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${!inq.read ? "bg-teal-500" : "bg-transparent"}`} />
                        <div className="min-w-0">
                          <div className="font-semibold text-white text-sm truncate">{inq.name}</div>
                          <div className="text-gray-500 text-xs truncate">{inq.message}</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 flex-shrink-0 ml-4">{formatDate(inq.created_at)}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Projects ───────────────────────────────────────────────────── */}
        {activeTab === "projects" && (
          <AdminProjectsManager
            projects={projects}
            onDelete={handleDeleteProject}
            onAdd={handleAddProject}
            onUpdate={handleUpdateProject}
          />
        )}

        {/* ── Inquiries ──────────────────────────────────────────────────── */}
        {activeTab === "inquiries" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">Inquiries</h2>
                <p className="text-gray-500 text-sm mt-1">
                  {inquiries.length} total · {unreadCount} unread
                </p>
              </div>
            </div>
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden">
              {inquiries.length === 0 ? (
                <div className="p-16 text-center text-gray-600">No inquiries yet.</div>
              ) : (
                <div className="divide-y divide-white/5">
                  {inquiries.map((inq: any) => (
                    <button
                      key={inq.id}
                      onClick={() => handleInquiryClick(inq)}
                      className={`w-full text-left p-4 hover:bg-white/5 transition-colors flex justify-between items-center gap-4 ${!inq.read ? "bg-teal-500/5" : ""}`}
                    >
                      <div className="flex gap-4 items-center min-w-0">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-0.5 ${!inq.read ? "bg-teal-500" : "bg-white/10"}`} />
                        <div className="min-w-0">
                          <div className="font-semibold text-white text-sm">
                            {inq.name}
                            {inq.company && (
                              <span className="text-gray-500 font-normal text-xs ml-2">{inq.company}</span>
                            )}
                          </div>
                          <div className="text-gray-400 text-sm truncate max-w-md">{inq.message}</div>
                          <div className="text-xs text-gray-600 mt-0.5 flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {inq.email}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 flex-shrink-0">{formatDate(inq.created_at)}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Bookings ───────────────────────────────────────────────────── */}
        {activeTab === "bookings" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Bookings</h2>
              <p className="text-gray-500 text-sm mt-1">
                {bookings.length} total · {pendingCount} pending
              </p>
            </div>
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden">
              {bookings.length === 0 ? (
                <div className="p-16 text-center text-gray-600">No bookings yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3">Client</th>
                        <th className="px-4 py-3 hidden md:table-cell">Date & Time</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 hidden lg:table-cell">Received</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {bookings.map((b: any) => (
                        <tr key={b.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-semibold text-white">{b.name}</div>
                            <div className="text-gray-500 text-xs flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3" /> {b.email}
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell text-gray-400 text-xs">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> {b.booking_date ?? "—"}
                            </div>
                            <div className="flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3" /> {b.booking_time ?? "—"}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border capitalize ${STATUS_BOOKING[b.status] ?? "text-gray-400 bg-white/5 border-white/10"}`}>
                              {b.status ?? "pending"}
                            </span>
                          </td>
                          <td className="px-4 py-3 hidden lg:table-cell text-gray-500 text-xs">
                            {formatDate(b.created_at)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-2">
                              {b.status !== "confirmed" && (
                                <button
                                  onClick={() => handleBookingStatus(b.id, "confirmed")}
                                  className="px-2 py-1 rounded text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
                                >
                                  Confirm
                                </button>
                              )}
                              {b.status !== "cancelled" && (
                                <button
                                  onClick={() => handleBookingStatus(b.id, "cancelled")}
                                  className="px-2 py-1 rounded text-xs bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                                >
                                  Cancel
                                </button>
                              )}
                              {b.status !== "pending" && (
                                <button
                                  onClick={() => handleBookingStatus(b.id, "pending")}
                                  className="px-2 py-1 rounded text-xs bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 transition-colors"
                                >
                                  Reset
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Settings ───────────────────────────────────────────────────── */}
        {activeTab === "settings" && (
          <div className="space-y-6 max-w-xl">
            <div>
              <h2 className="text-2xl font-bold text-white">Settings</h2>
              <p className="text-gray-500 text-sm mt-1">Manage your account</p>
            </div>

            {/* Account info */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 space-y-3">
              <h3 className="font-semibold text-white">Account</h3>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center font-bold text-white">
                  {initials}
                </div>
                <div>
                  <div className="text-white font-medium">{user.email}</div>
                  <div className="text-teal-400 text-xs font-mono mt-0.5">Administrator</div>
                </div>
              </div>
            </div>

            {/* Change password */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-gray-400" /> Change Password
              </h3>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="w-full bg-black border border-white/10 px-3 py-2.5 rounded-lg text-white focus:outline-none focus:border-teal-500/50"
                    required
                    minLength={8}
                    autoComplete="new-password"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full bg-black border border-white/10 px-3 py-2.5 rounded-lg text-white focus:outline-none focus:border-teal-500/50"
                    required
                    autoComplete="new-password"
                  />
                </div>
                <button
                  type="submit"
                  disabled={pwLoading}
                  className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 px-5 py-2.5 rounded-lg text-white font-bold transition-colors text-sm"
                >
                  {pwLoading && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {pwLoading ? "Updating…" : "Update Password"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* ── Inquiry Detail Modal ────────────────────────────────────────── */}
      {expandedInquiry && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setExpanded(null)}
        >
          <div
            className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 max-w-lg w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-5">
              <div>
                <h3 className="font-bold text-white text-lg">{expandedInquiry.name}</h3>
                {expandedInquiry.company && (
                  <p className="text-gray-500 text-sm">{expandedInquiry.company}</p>
                )}
                <a
                  href={`mailto:${expandedInquiry.email}`}
                  className="text-teal-400 text-sm hover:underline flex items-center gap-1 mt-1"
                >
                  <Mail className="w-3 h-3" /> {expandedInquiry.email}
                </a>
              </div>
              <button
                onClick={() => setExpanded(null)}
                className="text-gray-500 hover:text-white transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-black/50 rounded-xl p-4 text-gray-300 text-sm leading-relaxed whitespace-pre-wrap border border-white/5">
              {expandedInquiry.message}
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div className="text-xs text-gray-600">{formatDate(expandedInquiry.created_at)}</div>
              <a
                href={`mailto:${expandedInquiry.email}?subject=Re: Your inquiry`}
                className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors"
              >
                <Mail className="w-3 h-3" /> Reply via Email
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast Notification ───────────────────────────────────────────── */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium shadow-xl backdrop-blur-sm transition-all ${
            toast.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
        >
          {toast.type === "success"
            ? <CheckCircle className="w-4 h-4 flex-shrink-0" />
            : <AlertCircle className="w-4 h-4 flex-shrink-0" />
          }
          {toast.message}
        </div>
      )}
    </div>
  );
};
