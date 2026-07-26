"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Skeleton } from "@/components/ui/Skeleton";
import api from "@/lib/axios";
import { formatDate, getErrorMessage } from "@/lib/utils";
import { Mail, Trash2, Loader2, LayoutDashboard, Package, ClipboardList, Users, Tag, CheckCheck } from "lucide-react";
import toast from "react-hot-toast";

const ADMIN_NAV = [
  { label: "Dashboard",  href: "/admin",           icon: LayoutDashboard },
  { label: "Users",      href: "/admin/users",      icon: Users },
  { label: "Medicines",  href: "/admin/medicines",  icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Tag },
  { label: "Orders",     href: "/admin/orders",     icon: ClipboardList },
  { label: "Messages",   href: "/admin/contacts",   icon: Mail },
];

interface Contact { id: number; name: string; email: string; subject: string; message: string; isRead: boolean; createdAt: string; }

export default function AdminContactsPage() {
  const [contacts,  setContacts]  = useState<Contact[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [selected,  setSelected]  = useState<Contact | null>(null);
  const [deleting,  setDeleting]  = useState<number | null>(null);
  const [marking,   setMarking]   = useState<number | null>(null);

  const fetchContacts = () => {
    setLoading(true);
    api.get("/contact")
      .then((r) => setContacts(r.data.data?.contacts || []))
      .catch(() => toast.error("Failed to load messages"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchContacts(); }, []);

  const handleMarkRead = async (id: number) => {
    setMarking(id);
    try {
      await api.patch(`/contact/${id}`);
      setContacts((prev) => prev.map((c) => c.id === id ? { ...c, isRead: true } : c));
      if (selected?.id === id) setSelected((s) => s ? { ...s, isRead: true } : s);
      toast.success("Marked as read");
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setMarking(null); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this message?")) return;
    setDeleting(id);
    try {
      await api.delete(`/contact/${id}`);
      setContacts((prev) => prev.filter((c) => c.id !== id));
      if (selected?.id === id) setSelected(null);
      toast.success("Deleted");
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setDeleting(null); }
  };

  const unread = contacts.filter((c) => !c.isRead).length;

  return (
    <DashboardLayout navItems={ADMIN_NAV} title="Admin Panel" role="admin">
      <div className="space-y-5">
        <div>
          <h1 className="font-bold text-2xl text-gray-900" style={{ fontFamily: "var(--font-sora)" }}>Contact Messages</h1>
          <p className="text-gray-500 text-sm mt-0.5">{contacts.length} messages · {unread} unread</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Message list */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-4 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
            ) : contacts.length === 0 ? (
              <div className="py-16 text-center text-gray-400">
                <Mail className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p>No messages yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {contacts.map((c) => (
                  <button key={c.id} onClick={() => { setSelected(c); if (!c.isRead) handleMarkRead(c.id); }}
                    className={`w-full text-left px-4 py-3.5 hover:bg-gray-50 transition-colors ${selected?.id === c.id ? "bg-brand-50" : ""}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {!c.isRead && <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0" />}
                          <p className={`text-sm truncate ${!c.isRead ? "font-bold text-gray-900" : "font-medium text-gray-700"}`}>{c.name}</p>
                        </div>
                        <p className="text-xs text-gray-500 truncate mt-0.5">{c.subject}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{formatDate(c.createdAt)}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Message detail */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
            {selected ? (
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <h2 className="font-bold text-lg text-gray-900" style={{ fontFamily: "var(--font-sora)" }}>{selected.subject}</h2>
                    <p className="text-sm text-gray-500 mt-0.5">From: <span className="font-medium text-gray-700">{selected.name}</span> ({selected.email})</p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDate(selected.createdAt)}</p>
                  </div>
                  <div className="flex gap-2">
                    {!selected.isRead && (
                      <button onClick={() => handleMarkRead(selected.id)} disabled={marking === selected.id}
                        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-brand-50 text-brand-700 hover:bg-brand-100 transition-colors disabled:opacity-40">
                        {marking === selected.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCheck className="w-3.5 h-3.5" />}
                        Mark Read
                      </button>
                    )}
                    <button onClick={() => handleDelete(selected.id)} disabled={deleting === selected.id}
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors disabled:opacity-40">
                      {deleting === selected.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                      Delete
                    </button>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-5 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selected.message}
                </div>
                <a href={`mailto:${selected.email}`} className="mt-4 inline-flex items-center gap-2 text-brand-600 font-medium text-sm hover:underline">
                  <Mail className="w-4 h-4" /> Reply via email
                </a>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-24 text-gray-400">
                <Mail className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-sm">Select a message to read it</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
