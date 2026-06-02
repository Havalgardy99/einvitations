import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useSearchParams } from "react-router-dom";
import {
  Plus,
  Copy,
  Check,
  Trash2,
  LogOut,
  Sparkles,
  Users,
  MessageSquare,
  Pencil,
  ArrowRight,
  Save,
  Heart,
  LayoutGrid,
  Mail,
  ShoppingBag,
  Layers3,
  SlidersHorizontal
} from "lucide-react";
import type {
  TemplateOrder,
  InvitationLinks,
  InvitationTemplate,
  TimelineItem
} from "../../shared/invitation";
import { api, type AdminInvitationListItem } from "../api/client";
import { mediaUrl } from "../api/base";
import { toAbsoluteUrl } from "../lib/urls";
import ImageUpload from "../components/admin/ImageUpload";
import LinksPanel from "../components/admin/LinksPanel";
import {
  DEFAULT_THEME_COLORS,
  defaultCategoryForm,
  type CustomTemplateCategory,
  type TemplateLayoutType
} from "../../shared/templateCategories";
import {
  DEFAULT_CINEMATIC_VIDEO,
  TEMPLATE_PRESETS,
  type TemplatePresetKey
} from "../../shared/templates";

type View = "list" | "edit";

export default function AdminDashboard() {
  const [searchParams] = useSearchParams();
  const presetFromUrl = searchParams.get("template") as TemplatePresetKey | null;
  const initialTemplateKey =
    TEMPLATE_PRESETS.find((preset) => preset.key === presetFromUrl)?.key ??
    TEMPLATE_PRESETS[0].key;
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showForgotHint, setShowForgotHint] = useState(false);
  const [list, setList] = useState<AdminInvitationListItem[]>([]);
  const [view, setView] = useState<View>("list");
  const [editing, setEditing] = useState<InvitationTemplate | null>(null);
  const [editingLinks, setEditingLinks] = useState<InvitationLinks | null>(null);
  const [rsvps, setRsvps] = useState<unknown[]>([]);
  const [guestbook, setGuestbook] = useState<unknown[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [createForm, setCreateForm] = useState({
    accountName: "",
    coupleName1: "",
    coupleName2: "",
    templateKey: initialTemplateKey as string
  });
  const [orders, setOrders] = useState<TemplateOrder[]>([]);
  const [templateCards, setTemplateCards] = useState<
    { key: string; name: string; subtitle: string; description: string; previewImageUrl: string }[]
  >([]);
  const [categories, setCategories] = useState<CustomTemplateCategory[]>([]);
  const [categoryForm, setCategoryForm] = useState(defaultCategoryForm());
  const [savingCategory, setSavingCategory] = useState(false);

  const loadList = useCallback(async () => {
    const [invitations, ordersData, cards, cats] = await Promise.all([
      api.listInvitations(),
      api.listOrders(),
      api.listTemplateCards(),
      api.listTemplateCategories()
    ]);
    setList(invitations);
    setOrders(ordersData);
    setTemplateCards(cards);
    setCategories(cats);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      setAuthed(false);
      return;
    }
    api
      .checkAuth()
      .then(() => {
        setAuthed(true);
        return loadList();
      })
      .catch(() => {
        localStorage.removeItem("admin_token");
        setAuthed(false);
      });
  }, [loadList]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    const user = username.trim();
    const pass = password.trim();
    if (!user || !pass) {
      setLoginError("تکایە ناوی بەکارهێنەر و وشەی نهێنی بنووسە");
      return;
    }

    try {
      const { token } = await api.login(user, pass);
      localStorage.setItem("admin_token", token);
      setAuthed(true);
      await loadList();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (
        msg === "Failed to fetch" ||
        msg.includes("NetworkError") ||
        msg.includes("ECONNREFUSED")
      ) {
        setLoginError(
          "API کار ناکات — لە تێرمیناڵ Ctrl+C و دواتر: npm.cmd install && npm.cmd run dev (دەبێت [api] و [web] هەردووکیان بینرێن)"
        );
      } else if (msg.includes("401") || msg.includes("هەڵەیە")) {
        setLoginError(
          "ناوی بەکارهێنەر یان وشەی نهێنی هەڵەیە — admin / admin123 لە .env.local"
        );
      } else {
        setLoginError(msg || "چوونەژوورەوە سەرکەوتوو نەبوو");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setAuthed(false);
    setView("list");
    setEditing(null);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.accountName.trim()) return;
    const created = await api.createInvitation({
      accountName: createForm.accountName.trim(),
      coupleName1: createForm.coupleName1.trim() || undefined,
      coupleName2: createForm.coupleName2.trim() || undefined,
      templateKey: createForm.templateKey
    });
    setCreateForm({
      accountName: "",
      coupleName1: "",
      coupleName2: "",
      templateKey: createForm.templateKey
    });
    await loadList();
    await openEdit(created.id);
  };

  const handleVideoUploadForCategory = async (file: File | null) => {
    if (!file) return;
    const res = await api.uploadVideo(file);
    setCategoryForm((prev) => ({ ...prev, introVideoUrl: res.url, layoutType: "cinematic" }));
  };

  const handleVideoUploadForInvitation = async (file: File | null) => {
    if (!file) return;
    const res = await api.uploadVideo(file);
    updateField("introVideoUrl", res.url);
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCategory(true);
    try {
      await api.createTemplateCategory(categoryForm);
      setCategoryForm(defaultCategoryForm());
      await loadList();
    } finally {
      setSavingCategory(false);
    }
  };

  const setCategoryTheme = (key: keyof typeof DEFAULT_THEME_COLORS, value: string) => {
    setCategoryForm((prev) => ({
      ...prev,
      theme: { ...prev.theme, [key]: value }
    }));
  };

  const copyLink = async (id: string, path: string) => {
    await navigator.clipboard.writeText(toAbsoluteUrl(path));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openEdit = async (id: string) => {
    const detail = await api.getInvitation(id);
    const { rsvps: r, guestbook: g, links, link: _l, ...template } = detail;
    setEditing(template);
    setEditingLinks(links);
    setRsvps(r);
    setGuestbook(g);
    setView("edit");
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      await api.updateInvitation(editing.id, editing);
      await loadList();
      const detail = await api.getInvitation(editing.id);
      setEditingLinks(detail.links);
      setRsvps(detail.rsvps);
      setGuestbook(detail.guestbook);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("دڵنیایت لە سڕینەوەی ئەم ئەکاونتە؟")) return;
    await api.deleteInvitation(id);
    if (editing?.id === id) {
      setEditing(null);
      setEditingLinks(null);
      setView("list");
    }
    await loadList();
  };

  const updateField = <K extends keyof InvitationTemplate>(
    key: K,
    value: InvitationTemplate[K]
  ) => {
    setEditing((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const updateTimeline = (index: number, field: keyof TimelineItem, value: string) => {
    setEditing((prev) => {
      if (!prev) return prev;
      const timeline = [...prev.timeline];
      timeline[index] = { ...timeline[index], [field]: value };
      return { ...prev, timeline };
    });
  };

  const totalRsvps = list.reduce((s, i) => s + i.rsvpCount, 0);
  const totalWishes = list.reduce((s, i) => s + i.guestbookCount, 0);
  const totalNewOrders = orders.filter((o) => o.status === "new").length;

  if (authed === null) {
    return (
      <AdminShell>
        <div className="min-h-screen flex items-center justify-center">
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-14 h-14 rounded-full border-2 border-[#D4AF37]/40 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[#D4AF37] animate-spin-slow" />
            </div>
            <span className="font-serif text-lg tracking-[0.2em] text-[#CBB084]">
              چاوەڕوان بە...
            </span>
          </motion.div>
        </div>
      </AdminShell>
    );
  }

  if (!authed) {
    return (
      <AdminShell>
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#6D1520]/20 blur-[120px] pointer-events-none animate-pulse-glow" />
          <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-[#D4AF37]/8 blur-[100px] pointer-events-none" />

          <motion.form
            noValidate
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            onSubmit={handleLogin}
            className="glass-panel relative w-full max-w-[420px] rounded-2xl p-8 sm:p-10 space-y-6"
          >
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-[#6D1520] to-[#4D0A11] flex items-center justify-center border border-[#D4AF37]/30 shadow-lg shadow-[#6D1520]/30">
                <Heart className="w-7 h-7 text-[#D4AF37] fill-[#D4AF37]/20" />
              </div>
              <div>
                <h1 className="font-serif text-3xl font-light tracking-wide text-[#F3EFE9]">
                  داشبۆردی بەڕێوەبەر
                </h1>
                <p className="text-sm text-[#A39081] mt-2">
                  بەخێربێیتەوە — بانگهێشتنامەی دیجیتاڵی
                </p>
              </div>
              <div className="gold-divider w-24 mx-auto" />
            </div>

            <div className="space-y-4">
              <Field label="ناوی بەکارهێنەر" value={username} onChange={setUsername} />
              <Field
                label="وشەی نهێنی"
                value={password}
                onChange={setPassword}
                type="password"
                autoComplete="current-password"
              />
              {loginError && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-rose-300/90 text-xs text-center leading-relaxed bg-rose-950/40 border border-rose-800/30 rounded-xl px-3 py-2.5"
                >
                  {loginError}
                </motion.p>
              )}
            </div>

            <button
              type="submit"
              className="btn-wine w-full py-3.5 rounded-xl text-sm font-bold tracking-wider text-white"
            >
              چوونەژوورەوە
            </button>

            <button
              type="button"
              onClick={() => setShowForgotHint((v) => !v)}
              className="w-full text-xs text-[#A39081] hover:text-[#D4AF37] transition-colors"
            >
              وشەی نهێنیم بیرچووە؟
            </button>
            {showForgotHint && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="text-xs text-[#A39081] text-center leading-relaxed glass-panel rounded-xl p-4 !shadow-none"
              >
                لە <code className="text-[#D4AF37]">.env.local</code> بەهای{" "}
                <code className="text-[#D4AF37]">ADMIN_USERNAME</code> و{" "}
                <code className="text-[#D4AF37]">ADMIN_PASSWORD</code> بگۆڕە.
              </motion.p>
            )}
          </motion.form>
        </div>
      </AdminShell>
    );
  }

  if (view === "edit" && editing && editingLinks) {
    return (
      <AdminShell>
        <header className="sticky top-0 z-50 border-b border-[#D4AF37]/10 bg-[#0c0a09]/85 backdrop-blur-xl px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <button
            onClick={() => {
              setView("list");
              setEditing(null);
              setEditingLinks(null);
            }}
            className="btn-gold-outline flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
          >
            <ArrowRight className="w-4 h-4 rotate-180" /> گەڕانەوە
          </button>
          <h1 className="font-serif text-xl truncate text-[#F3EFE9]">
            {editing.accountName}
          </h1>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-wine flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50 text-white"
          >
            <Save className="w-4 h-4" />
            {saving ? "پاشەکەوت..." : "پاشەکەوت"}
          </button>
        </header>

        <div className="max-w-4xl mx-auto p-4 sm:p-6 pb-28 space-y-6 scrollbar-luxury">
          <LinksPanel links={editingLinks} id={editing.id} />

          <FormSection title="زانیاری ئەکاونت">
            <Field label="ناوی ئەکاونت (بۆ داشبۆرد)" value={editing.accountName} onChange={(v) => updateField("accountName", v)} />
            <Field label="Slug (لینک)" value={editing.slug} onChange={(v) => updateField("slug", v)} dir="ltr" />
            <div className="space-y-1.5">
              <label className="text-xs font-medium tracking-wide text-[#CBB084] block text-right">
                تێمپلەیت (دیزاین)
              </label>
              <select
                value={editing.templateKey ?? "royal"}
                onChange={(e) =>
                  updateField("templateKey", e.target.value)
                }
                className="input-luxury"
              >
                {templateCards.map((preset) => (
                  <option key={preset.key} value={preset.key}>
                    {preset.name} — {preset.subtitle}
                  </option>
                ))}
              </select>
            </div>
            {(editing.templateKey ?? "royal") === "cinematic" && (
              <div className="space-y-2">
                <label className="text-xs font-medium tracking-wide text-[#CBB084] block text-right">
                  ڤیدیۆی سەرەتا (فول سکرین) — تەنها upload فایل
                </label>
                <input
                  type="file"
                  accept="video/*"
                  className="input-luxury"
                  onChange={(e) => void handleVideoUploadForInvitation(e.target.files?.[0] ?? null)}
                />
                <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0c0a09]/60 px-3 py-2 text-xs text-[#CBB084]" dir="ltr">
                  {editing.introVideoUrl ?? DEFAULT_CINEMATIC_VIDEO}
                </div>
              </div>
            )}
            <Toggle label="چالاکە" checked={editing.isActive} onChange={(v) => updateField("isActive", v)} />
          </FormSection>

          <FormSection title="ناو و بەروار">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="ناوی یەکەم" value={editing.coupleName1} onChange={(v) => updateField("coupleName1", v)} />
              <Field label="ناوی دووەم" value={editing.coupleName2} onChange={(v) => updateField("coupleName2", v)} />
            </div>
            <Field label="مۆنۆگرام" value={editing.monogram} onChange={(v) => updateField("monogram", v)} />
            <Field label="بەروار (پیشاندان)" value={editing.dateDisplay} onChange={(v) => updateField("dateDisplay", v)} />
            <Field label="شوێن (کورت)" value={editing.locationShort} onChange={(v) => updateField("locationShort", v)} />
            <Field label="بەرواری countdown (ISO)" value={editing.countdownDate} onChange={(v) => updateField("countdownDate", v)} dir="ltr" />
          </FormSection>

          <FormSection title="ناوەڕۆکی بانگهێشت">
            <ImageUpload
              value={editing.coverImageUrl}
              onChange={(v) => updateField("coverImageUrl", v)}
            />
            <Field label="سڵاو" value={editing.inviteGreeting} onChange={(v) => updateField("inviteGreeting", v)} />
            <TextArea label="دەقی بانگهێشت" value={editing.inviteBody} onChange={(v) => updateField("inviteBody", v)} />
            <Field label="کات" value={editing.eventTime} onChange={(v) => updateField("eventTime", v)} />
          </FormSection>

          <FormSection title="شوێن و نەخشە">
            <Field label="ناوی شوێن" value={editing.venueName} onChange={(v) => updateField("venueName", v)} />
            <Field label="ناونیشان" value={editing.venueAddress} onChange={(v) => updateField("venueAddress", v)} />
            <Field label="کاتی پێشوازی / خوانی شێو" value={editing.scheduleDetails} onChange={(v) => updateField("scheduleDetails", v)} />
            <Field label="لینکی نەخشە" value={editing.mapUrl} onChange={(v) => updateField("mapUrl", v)} dir="ltr" />
            <Field label="دەقی نەخشە" value={editing.mapAddressLine} onChange={(v) => updateField("mapAddressLine", v)} />
          </FormSection>

          <FormSection title="بەرنامەی ڕۆژ">
            <Field label="سەردێڕی بەروار" value={editing.timelineDateLabel} onChange={(v) => updateField("timelineDateLabel", v)} />
            {editing.timeline.map((item, i) => (
              <div key={i} className="rounded-xl p-4 space-y-2 border border-[#D4AF37]/10 bg-[#0c0a09]/50">
                <p className="text-xs text-[#D4AF37] font-mono">بڕگە {i + 1}</p>
                <div className="grid grid-cols-[1fr,4rem] gap-2">
                  <Field label="ناونیشان" value={item.title} onChange={(v) => updateTimeline(i, "title", v)} />
                  <Field label="ئایکۆن" value={item.icon} onChange={(v) => updateTimeline(i, "icon", v)} />
                </div>
                <Field label="کات" value={item.time} onChange={(v) => updateTimeline(i, "time", v)} dir="ltr" />
                <TextArea label="وەسف" value={item.desc} onChange={(v) => updateTimeline(i, "desc", v)} rows={2} />
              </div>
            ))}
          </FormSection>

          <FormSection title="RSVP">
            <Field label="کۆتایی مۆڵەت" value={editing.rsvpDeadline} onChange={(v) => updateField("rsvpDeadline", v)} />
            <div className="flex items-center gap-2 text-sm text-[#CBB084]">
              <Users className="w-4 h-4" />
              <span>{rsvps.length} پشتڕاستکردنەوە</span>
            </div>
          </FormSection>

          <FormSection title="پیرۆزباییەکان">
            <div className="flex items-center gap-2 text-sm text-[#CBB084] mb-2">
              <MessageSquare className="w-4 h-4" />
              <span>{guestbook.length} نامە</span>
            </div>
            <div className="max-h-48 overflow-y-auto space-y-2 text-sm">
              {(guestbook as { name: string; message: string }[]).slice(0, 10).map((g, i) => (
                <div key={i} className="bg-[#11100F] p-3 rounded-lg border border-[#3E3C3A]/40">
                  <strong>{g.name}</strong>
                  <p className="text-[#A39081] mt-1 line-clamp-2">{g.message}</p>
                </div>
              ))}
            </div>
          </FormSection>

          <button
            onClick={() => handleDelete(editing.id)}
            className="w-full flex items-center justify-center gap-2 border border-rose-800/40 text-rose-300/90 py-3.5 rounded-xl hover:bg-rose-950/40 text-sm transition-colors"
          >
            <Trash2 className="w-4 h-4" /> سڕینەوەی ئەکاونت
          </button>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <main className="max-w-[1400px] mx-auto p-3 sm:p-5 lg:p-7">
        <div className="grid grid-cols-1 lg:grid-cols-[250px,1fr] gap-5 lg:gap-6">
          <aside className="glass-panel rounded-3xl p-5 h-fit lg:sticky lg:top-5">
            <div className="flex items-center gap-3 pb-4 border-b border-[#D4AF37]/15">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8a1f2e] to-[#4D0A11] border border-[#D4AF37]/30 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-[#F3EFE9] font-semibold">Invitation Admin</p>
                <p className="text-[11px] text-[#A39081]">Premium Dashboard</p>
              </div>
            </div>
            <div className="pt-4 space-y-2">
              <NavItem icon={<LayoutGrid className="w-4 h-4" />} label="Overview" active />
              <NavItem icon={<Plus className="w-4 h-4" />} label="Create Account" />
              <NavItem icon={<Layers3 className="w-4 h-4" />} label="Template Categories" />
              <NavItem icon={<ShoppingBag className="w-4 h-4" />} label="Orders" />
              <NavItem icon={<SlidersHorizontal className="w-4 h-4" />} label="Settings" />
            </div>
            <button
              onClick={handleLogout}
              className="btn-gold-outline w-full mt-5 flex items-center justify-center gap-2 text-sm px-4 py-2.5 rounded-xl"
            >
              <LogOut className="w-4 h-4" /> دەرچوون
            </button>
          </aside>

          <div className="space-y-6">
            <section className="glass-panel rounded-3xl p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl text-[#F3EFE9]">
                  داشبۆردی بەڕێوەبەر
                </h1>
                <p className="text-sm text-[#A39081] mt-1">
                  بەڕێوەبردنی بانگهێشتنامەکانی هاوسەرگیری بە شێوەیەکی ڕێکخراو
                </p>
              </div>
              <div className="text-xs text-[#CBB084] bg-[#0f0d0c]/70 border border-[#D4AF37]/15 rounded-xl px-4 py-2">
                {new Date().toLocaleDateString("ku")}
              </div>
            </section>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <StatCard icon={<LayoutGrid className="w-5 h-5" />} label="ئەکاونت" value={list.length} />
              <StatCard icon={<Users className="w-5 h-5" />} label="RSVP" value={totalRsvps} />
              <StatCard icon={<Mail className="w-5 h-5" />} label="پیرۆزبایی" value={totalWishes} />
              <StatCard icon={<Plus className="w-5 h-5" />} label="ئۆردەری نوێ" value={totalNewOrders} />
            </div>

            <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-3xl p-6 sm:p-8"
            >
          <h2 className="font-serif text-xl mb-1 flex items-center gap-2 text-[#F3EFE9]">
            <Plus className="w-5 h-5 text-[#D4AF37]" />
            ئەکاونتی نوێ
          </h2>
          <p className="text-xs text-[#A39081] mb-6">
            لینکی تایبەت خۆکار درووست دەبێت
          </p>
          <form onSubmit={handleCreate} className="grid sm:grid-cols-3 gap-4">
            <select
              value={createForm.templateKey}
              onChange={(e) =>
                setCreateForm({
                  ...createForm,
                  templateKey: e.target.value
                })
              }
              className="input-luxury sm:col-span-3"
            >
              {templateCards.map((preset) => (
                <option key={preset.key} value={preset.key}>
                  {preset.name} — {preset.subtitle}
                </option>
              ))}
            </select>
            <input
              required
              placeholder="ناوی ئەکاونت — هەور"
              value={createForm.accountName}
              onChange={(e) =>
                setCreateForm({ ...createForm, accountName: e.target.value })
              }
              className="input-luxury"
            />
            <input
              placeholder="ناوی یەکەم"
              value={createForm.coupleName1}
              onChange={(e) =>
                setCreateForm({ ...createForm, coupleName1: e.target.value })
              }
              className="input-luxury"
            />
            <input
              placeholder="ناوی دووەم"
              value={createForm.coupleName2}
              onChange={(e) =>
                setCreateForm({ ...createForm, coupleName2: e.target.value })
              }
              className="input-luxury"
            />
            <button
              type="submit"
              className="btn-wine sm:col-span-3 py-3.5 rounded-xl font-bold text-sm tracking-wider text-white"
            >
              درووستکردن و کردنەوەی دەستکاری
            </button>
          </form>
            </motion.section>

            <section className="glass-panel rounded-3xl p-6 sm:p-8 space-y-5">
          <h2 className="font-serif text-xl text-[#F3EFE9]">درووستکردنی کەتەگۆری تێمپلەیتی تایبەت</h2>
          <form onSubmit={handleCreateCategory} className="grid sm:grid-cols-2 gap-4">
            <input className="input-luxury" placeholder="ناوی کەتەگۆری" value={categoryForm.name} onChange={(e) => setCategoryForm((p) => ({ ...p, name: e.target.value }))} required />
            <input className="input-luxury" placeholder="key (unique)" value={categoryForm.key} onChange={(e) => setCategoryForm((p) => ({ ...p, key: e.target.value }))} dir="ltr" required />
            <input className="input-luxury sm:col-span-2" placeholder="subtitle" value={categoryForm.subtitle} onChange={(e) => setCategoryForm((p) => ({ ...p, subtitle: e.target.value }))} />
            <textarea className="input-luxury sm:col-span-2 min-h-[80px]" placeholder="description" value={categoryForm.description} onChange={(e) => setCategoryForm((p) => ({ ...p, description: e.target.value }))} />
            <Field label="Preview image URL" value={categoryForm.previewImageUrl} onChange={(v) => setCategoryForm((p) => ({ ...p, previewImageUrl: v }))} dir="ltr" />
            <div className="space-y-1.5">
              <label className="text-xs font-medium tracking-wide text-[#CBB084] block text-right">Layout</label>
              <select
                className="input-luxury"
                value={categoryForm.layoutType}
                onChange={(e) => setCategoryForm((p) => ({ ...p, layoutType: e.target.value as TemplateLayoutType }))}
              >
                <option value="luxury">Luxury</option>
                <option value="cinematic">Cinematic (video intro)</option>
              </select>
            </div>
            <div className="sm:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <ColorField label="Shell" value={categoryForm.theme.shell} onChange={(v) => setCategoryTheme("shell", v)} />
              <ColorField label="Accent" value={categoryForm.theme.accent} onChange={(v) => setCategoryTheme("accent", v)} />
              <ColorField label="Wine" value={categoryForm.theme.wine} onChange={(v) => setCategoryTheme("wine", v)} />
              <ColorField label="Card BG" value={categoryForm.theme.cardBg} onChange={(v) => setCategoryTheme("cardBg", v)} />
              <ColorField label="Text shell" value={categoryForm.theme.textOnShell} onChange={(v) => setCategoryTheme("textOnShell", v)} />
              <ColorField label="Text card" value={categoryForm.theme.textOnCard} onChange={(v) => setCategoryTheme("textOnCard", v)} />
            </div>
            <div className="sm:col-span-2 space-y-2">
              <label className="text-xs font-medium tracking-wide text-[#CBB084] block text-right">Upload intro video (file only)</label>
              <input
                type="file"
                accept="video/*"
                className="input-luxury"
                onChange={(e) => void handleVideoUploadForCategory(e.target.files?.[0] ?? null)}
              />
              <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0c0a09]/60 px-3 py-2 text-xs text-[#CBB084]" dir="ltr">
                {categoryForm.introVideoUrl || "No video uploaded yet"}
              </div>
            </div>
            <button type="submit" className="btn-wine sm:col-span-2 py-3 rounded-xl text-white font-bold" disabled={savingCategory}>
              {savingCategory ? "پاشەکەوت..." : "درووستکردنی کەتەگۆری"}
            </button>
          </form>
          <div className="grid gap-2">
            {categories.map((cat) => (
              <div key={cat.id} className="rounded-xl border border-[#D4AF37]/20 px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-[#F3EFE9] text-sm">{cat.name} <span className="text-xs text-[#A39081]">({cat.key})</span></p>
                  <p className="text-xs text-[#CBB084]">{cat.layoutType} {cat.introVideoUrl ? "• video" : ""}</p>
                </div>
                <button
                  onClick={async () => {
                    await api.deleteTemplateCategory(cat.id);
                    await loadList();
                  }}
                  className="p-2 rounded-lg border border-rose-800/40 text-rose-300 hover:bg-rose-950/40"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
            </section>

            <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg text-[#D4AF37]">
              ئەکاونتەکان
            </h2>
            <span className="text-xs font-mono text-[#A39081] tracking-wider">
              {list.length} تۆمار
            </span>
          </div>

          {list.length === 0 ? (
            <div className="glass-panel rounded-2xl p-12 text-center">
              <Heart className="w-10 h-10 text-[#D4AF37]/40 mx-auto mb-4" />
              <p className="text-[#A39081]">هێشتا ئەکاونت نییە — یەکەم بانگهێشت درووست بکە</p>
            </div>
          ) : (
            <div className="grid gap-4">
              <AnimatePresence mode="popLayout">
                {list.map((inv, idx) => (
                  <motion.article
                    key={inv.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ delay: idx * 0.04 }}
                    className="invite-card flex flex-col sm:flex-row gap-0 sm:gap-5"
                  >
                    <div className="sm:w-36 h-32 sm:h-auto shrink-0 relative overflow-hidden">
                      <img
                        src={mediaUrl(inv.coverImageUrl)}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-[#161412] via-transparent to-transparent" />
                    </div>
                    <div className="flex-1 p-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                      <div className="space-y-1.5">
                        <h3 className="font-serif text-xl text-[#F3EFE9]">
                          {inv.coupleName1}{" "}
                          <span className="text-[#D4AF37]/80">&</span>{" "}
                          {inv.coupleName2}
                        </h3>
                        <p className="text-sm text-[#A39081]">{inv.accountName}</p>
                        <p
                          className="text-xs font-mono text-[#D4AF37]/70"
                          dir="ltr"
                        >
                          /i/{inv.slug}
                        </p>
                        <div className="flex flex-wrap gap-2 pt-2">
                          <Badge>{inv.rsvpCount} RSVP</Badge>
                          <Badge>{inv.guestbookCount} پیرۆزبایی</Badge>
                          {!inv.isActive && (
                            <Badge variant="danger">ناچالاک</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 shrink-0">
                        <button
                          onClick={() => copyLink(inv.id, inv.links.main)}
                          title="بانگهێشت"
                          className="btn-gold-outline flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold"
                        >
                          {copiedId === inv.id ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          بانگهێشت
                        </button>
                        <button
                          onClick={() =>
                            copyLink(`${inv.id}-guest`, inv.links.guest)
                          }
                          title="بەشداری + پیرۆزبایی"
                          className="btn-wine flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white"
                        >
                          {copiedId === `${inv.id}-guest` ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <Heart className="w-3.5 h-3.5" />
                          )}
                          میوان
                        </button>
                        <button
                          onClick={() => openEdit(inv.id)}
                          className="btn-wine flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white"
                        >
                          <Pencil className="w-3.5 h-3.5" /> دەستکاری
                        </button>
                        <button
                          onClick={() => handleDelete(inv.id)}
                          className="p-2 rounded-xl border border-rose-800/40 text-rose-300 hover:bg-rose-950/40 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
          )}
            </section>

            <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg text-[#D4AF37]">ئۆردەرەکان</h2>
            <span className="text-xs font-mono text-[#A39081] tracking-wider">
              {orders.length} ئۆردەر
            </span>
          </div>
          {orders.length === 0 ? (
            <div className="glass-panel rounded-2xl p-6 text-sm text-[#A39081]">
              هێشتا هیچ ئۆردەرێک نییە.
            </div>
          ) : (
            <div className="grid gap-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="glass-panel rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <p className="text-[#F3EFE9] font-semibold">{order.customerName}</p>
                    <p className="text-xs text-[#A39081]">{order.phone}</p>
                    <p className="text-xs text-[#D4AF37]">{order.templateName}</p>
                    {order.notes && (
                      <p className="text-xs text-[#CBB084] line-clamp-2">{order.notes}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={order.status}
                      onChange={async (e) => {
                        await api.updateOrderStatus(
                          order.id,
                          e.target.value as TemplateOrder["status"]
                        );
                        await loadList();
                      }}
                      className="input-luxury text-xs min-w-[140px]"
                    >
                      <option value="new">نوێ</option>
                      <option value="confirmed">پەسەندکراو</option>
                      <option value="done">تەواوبوو</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
            </section>
          </div>
        </div>
      </main>
    </AdminShell>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div dir="rtl" className="admin-root relative min-h-screen">
      <div className="admin-noise" aria-hidden />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="stat-card flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl bg-[#6D1520]/30 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-serif text-[#F3EFE9]">{value}</p>
        <p className="text-xs text-[#A39081] tracking-wide">{label}</p>
      </div>
    </div>
  );
}

function NavItem({
  icon,
  label,
  active = false
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition ${
        active
          ? "bg-[#D4AF37]/12 border border-[#D4AF37]/35 text-[#F3EFE9]"
          : "border border-transparent text-[#A39081] hover:text-[#F3EFE9] hover:border-[#D4AF37]/20 hover:bg-[#1a1716]/70"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function Badge({
  children,
  variant = "default"
}: {
  children: React.ReactNode;
  variant?: "default" | "danger";
}) {
  return (
    <span
      className={`text-[10px] font-mono px-2.5 py-1 rounded-full border ${
        variant === "danger"
          ? "border-rose-700/50 text-rose-300 bg-rose-950/30"
          : "border-[#D4AF37]/25 text-[#CBB084] bg-[#D4AF37]/8"
      }`}
    >
      {children}
    </span>
  );
}

function FormSection({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="glass-panel rounded-2xl p-5 sm:p-6 space-y-4">
      <h2 className="font-serif text-lg text-[#D4AF37] flex items-center gap-2">
        <span className="w-1 h-5 rounded-full bg-[#D4AF37]/60" />
        {title}
      </h2>
      <div className="gold-divider" />
      <div className="space-y-4 pt-1">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  dir,
  type = "text",
  autoComplete
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  dir?: "ltr" | "rtl";
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium tracking-wide text-[#CBB084] block text-right">
        {label}
      </label>
      <input
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        dir={dir}
        className="input-luxury"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 4
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium tracking-wide text-[#CBB084] block text-right">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="input-luxury resize-y min-h-[88px]"
      />
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-1 block">
      <span className="text-xs text-[#CBB084]">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-12 rounded border border-[#D4AF37]/30 bg-transparent"
        />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input-luxury text-xs"
          dir="ltr"
        />
      </div>
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 cursor-pointer py-1">
      <span className="text-sm text-[#F3EFE9]">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`w-12 h-6 rounded-full transition-all relative shadow-inner ${
          checked
            ? "bg-gradient-to-r from-[#8a1f2e] to-[#6D1520]"
            : "bg-[#2a2624]"
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 rounded-full bg-[#F3EFE9] shadow transition-all ${
            checked ? "left-7" : "left-1"
          }`}
        />
      </button>
    </label>
  );
}
