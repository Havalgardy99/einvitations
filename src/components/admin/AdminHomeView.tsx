import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Check,
  Copy,
  Heart,
  Pencil,
  Plus,
  Trash2
} from "lucide-react";
import type { TemplateOrder } from "../../../shared/invitation";
import type { CustomTemplateCategory } from "../../../shared/templateCategories";
import type { TemplateLayoutType } from "../../../shared/templateCategories";
import type { SiteSettings } from "../../../shared/siteSettings";
import { api, type AdminInvitationListItem } from "../../api/client";
import { mediaUrl } from "../../api/base";
import { AdminDesktopSidebar, AdminMobileNav, type AdminTab } from "./AdminSidebar";
import AdminOverviewGrid from "./AdminOverviewGrid";
import AdminSettingsPanel from "./AdminSettingsPanel";
import { ColorField, DashBadge, DashField } from "./adminUi";

interface Props {
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;
  tabTitles: Record<AdminTab, string>;
  siteSettings: SiteSettings;
  setSiteSettings: (s: SiteSettings) => void;
  onLogout: () => void;
  list: AdminInvitationListItem[];
  orders: TemplateOrder[];
  categories: CustomTemplateCategory[];
  templateCards: { key: string; name: string; subtitle: string }[];
  totalRsvps: number;
  totalWishes: number;
  totalNewOrders: number;
  createForm: {
    accountName: string;
    coupleName1: string;
    coupleName2: string;
    templateKey: string;
  };
  setCreateForm: React.Dispatch<
    React.SetStateAction<{
      accountName: string;
      coupleName1: string;
      coupleName2: string;
      templateKey: string;
    }>
  >;
  categoryForm: ReturnType<typeof import("../../../shared/templateCategories").defaultCategoryForm>;
  setCategoryForm: React.Dispatch<React.SetStateAction<ReturnType<typeof import("../../../shared/templateCategories").defaultCategoryForm>>>;
  savingCategory: boolean;
  copiedId: string | null;
  onCreate: (e: React.FormEvent) => void;
  onCreateCategory: (e: React.FormEvent) => void;
  onCategoryTheme: (key: string, value: string) => void;
  onVideoUploadCategory: (file: File | null) => void;
  onOpenEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onCopyLink: (id: string, path: string) => void;
  loadList: () => Promise<void>;
}

export default function AdminHomeView(props: Props) {
  const {
    adminTab,
    setAdminTab,
    tabTitles,
    siteSettings,
    setSiteSettings,
    onLogout,
    list,
    orders,
    categories,
    templateCards,
    totalRsvps,
    totalWishes,
    totalNewOrders,
    createForm,
    setCreateForm,
    categoryForm,
    setCategoryForm,
    savingCategory,
    copiedId,
    onCreate,
    onCreateCategory,
    onCategoryTheme,
    onVideoUploadCategory,
    onOpenEdit,
    onDelete,
    onCopyLink,
    loadList
  } = props;

  const sidebarProps = {
    active: adminTab,
    onChange: setAdminTab,
    onLogout,
    onCreate: () => setAdminTab("create"),
    stats: {
      accounts: list.length,
      rsvps: totalRsvps,
      wishes: totalWishes,
      newOrders: totalNewOrders
    },
    siteSettings
  };

  return (
    <div className="min-h-screen p-3 sm:p-4 lg:p-5 overflow-x-hidden">
      <div className="max-w-[1600px] mx-auto">
        <AdminMobileNav {...sidebarProps} />

        <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-5 lg:items-start">
          <div className="hidden lg:block lg:sticky lg:top-5 lg:h-[calc(100dvh-2.5rem)]">
            <AdminDesktopSidebar {...sidebarProps} />
          </div>

          <div className="min-w-0 space-y-5 pb-8">
          <header className="flex items-center justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1d1f]">
              {tabTitles[adminTab]}
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#6b7280] bg-white border border-[#eef1f4] rounded-xl px-3 py-2 hidden sm:inline">
                {new Date().toLocaleDateString("ku")}
              </span>
              <button
                type="button"
                onClick={() => setAdminTab("create")}
                className="btn-dash-primary w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </header>

          {adminTab === "overview" && (
            <AdminOverviewGrid
              list={list}
              orders={orders}
              totalRsvps={totalRsvps}
              totalWishes={totalWishes}
              totalNewOrders={totalNewOrders}
              onOpenAccount={onOpenEdit}
              onGoOrders={() => setAdminTab("orders")}
            />
          )}

          {adminTab === "create" && (
            <motion.section
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="dash-card p-6 sm:p-8"
            >
              <h2 className="text-xl font-semibold text-[#1a1d1f] mb-1 flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#22c55e]" />
                ئەکاونتی نوێ
              </h2>
              <p className="text-xs text-[#6b7280] mb-6">لینکی تایبەت خۆکار درووست دەبێت</p>
              <form onSubmit={onCreate} className="grid sm:grid-cols-3 gap-4">
                <select
                  value={createForm.templateKey}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, templateKey: e.target.value })
                  }
                  className="dash-input sm:col-span-3"
                >
                  {templateCards.map((preset) => (
                    <option key={preset.key} value={preset.key}>
                      {preset.name} — {preset.subtitle}
                    </option>
                  ))}
                </select>
                <input
                  required
                  placeholder="ناوی ئەکاونت"
                  value={createForm.accountName}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, accountName: e.target.value })
                  }
                  className="dash-input"
                />
                <input
                  placeholder="ناوی یەکەم"
                  value={createForm.coupleName1}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, coupleName1: e.target.value })
                  }
                  className="dash-input"
                />
                <input
                  placeholder="ناوی دووەم"
                  value={createForm.coupleName2}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, coupleName2: e.target.value })
                  }
                  className="dash-input"
                />
                <button
                  type="submit"
                  className="btn-dash-primary sm:col-span-3 py-3.5 rounded-xl font-bold text-sm"
                >
                  درووستکردن و کردنەوەی دەستکاری
                </button>
              </form>
            </motion.section>
          )}

          {adminTab === "categories" && (
            <section className="dash-card p-6 sm:p-8 space-y-5">
              <h2 className="text-xl font-semibold text-[#1a1d1f]">
                درووستکردنی کەتەگۆری تێمپلەیتی تایبەت
              </h2>
              <form onSubmit={onCreateCategory} className="grid sm:grid-cols-2 gap-4">
                <input
                  className="dash-input"
                  placeholder="ناوی کەتەگۆری"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm((p) => ({ ...p, name: e.target.value }))}
                  required
                />
                <input
                  className="dash-input"
                  placeholder="key (unique)"
                  value={categoryForm.key}
                  onChange={(e) => setCategoryForm((p) => ({ ...p, key: e.target.value }))}
                  dir="ltr"
                  required
                />
                <input
                  className="dash-input sm:col-span-2"
                  placeholder="subtitle"
                  value={categoryForm.subtitle}
                  onChange={(e) => setCategoryForm((p) => ({ ...p, subtitle: e.target.value }))}
                />
                <textarea
                  className="dash-input sm:col-span-2 min-h-[80px]"
                  placeholder="description"
                  value={categoryForm.description}
                  onChange={(e) =>
                    setCategoryForm((p) => ({ ...p, description: e.target.value }))
                  }
                />
                <DashField
                  label="Preview image URL"
                  value={categoryForm.previewImageUrl}
                  onChange={(v) => setCategoryForm((p) => ({ ...p, previewImageUrl: v }))}
                  dir="ltr"
                />
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#6b7280] block text-right">
                    Layout
                  </label>
                  <select
                    className="dash-input"
                    value={categoryForm.layoutType}
                    onChange={(e) =>
                      setCategoryForm((p) => ({
                        ...p,
                        layoutType: e.target.value as TemplateLayoutType
                      }))
                    }
                  >
                    <option value="luxury">Luxury</option>
                    <option value="cinematic">Cinematic (video intro)</option>
                  </select>
                </div>
                <div className="sm:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <ColorField
                    label="Shell"
                    value={categoryForm.theme.shell}
                    onChange={(v) => onCategoryTheme("shell", v)}
                  />
                  <ColorField
                    label="Accent"
                    value={categoryForm.theme.accent}
                    onChange={(v) => onCategoryTheme("accent", v)}
                  />
                  <ColorField
                    label="Wine"
                    value={categoryForm.theme.wine}
                    onChange={(v) => onCategoryTheme("wine", v)}
                  />
                  <ColorField
                    label="Card BG"
                    value={categoryForm.theme.cardBg}
                    onChange={(v) => onCategoryTheme("cardBg", v)}
                  />
                  <ColorField
                    label="Text shell"
                    value={categoryForm.theme.textOnShell}
                    onChange={(v) => onCategoryTheme("textOnShell", v)}
                  />
                  <ColorField
                    label="Text card"
                    value={categoryForm.theme.textOnCard}
                    onChange={(v) => onCategoryTheme("textOnCard", v)}
                  />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-xs font-medium text-[#6b7280] block text-right">
                    Upload intro video
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    className="dash-input"
                    onChange={(e) => void onVideoUploadCategory(e.target.files?.[0] ?? null)}
                  />
                  <div
                    className="rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-3 py-2 text-xs text-[#6b7280]"
                    dir="ltr"
                  >
                    {categoryForm.introVideoUrl || "No video uploaded yet"}
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn-dash-primary sm:col-span-2 py-3 rounded-xl font-bold disabled:opacity-60"
                  disabled={savingCategory}
                >
                  {savingCategory ? "پاشەکەوت..." : "درووستکردنی کەتەگۆری"}
                </button>
              </form>
              <div className="grid gap-2">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="rounded-xl border border-[#eef1f4] px-4 py-3 flex items-center justify-between bg-[#f9fafb]"
                  >
                    <div>
                      <p className="text-[#1a1d1f] text-sm">
                        {cat.name}{" "}
                        <span className="text-xs text-[#9ca3af]">({cat.key})</span>
                      </p>
                      <p className="text-xs text-[#6b7280]">
                        {cat.layoutType} {cat.introVideoUrl ? "• video" : ""}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        await api.deleteTemplateCategory(cat.id);
                        await loadList();
                      }}
                      className="p-2 rounded-lg border border-rose-200 text-rose-500 hover:bg-rose-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {adminTab === "accounts" && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#9ca3af]">{list.length} تۆمار</span>
              </div>
              {list.length === 0 ? (
                <div className="dash-card p-12 text-center">
                  <Heart className="w-10 h-10 text-[#22c55e]/40 mx-auto mb-4" />
                  <p className="text-[#6b7280]">هێشتا ئەکاونت نییە — یەکەم بانگهێشت درووست بکە</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  <AnimatePresence mode="popLayout">
                    {list.map((inv, idx) => (
                      <motion.article
                        key={inv.id}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ delay: idx * 0.03 }}
                        className="dash-card flex flex-col sm:flex-row gap-0 overflow-hidden"
                      >
                        <div className="sm:w-36 h-32 sm:h-auto shrink-0 relative">
                          <img
                            src={mediaUrl(inv.coverImageUrl)}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 p-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                          <div className="space-y-1.5">
                            <h3 className="font-serif text-xl text-[#1a1d1f]">
                              {inv.coupleName1} & {inv.coupleName2}
                            </h3>
                            <p className="text-sm text-[#6b7280]">{inv.accountName}</p>
                            <p className="text-xs font-mono text-[#22c55e]" dir="ltr">
                              /i/{inv.slug}
                            </p>
                            <div className="flex flex-wrap gap-2 pt-2">
                              <DashBadge>{inv.rsvpCount} RSVP</DashBadge>
                              <DashBadge>{inv.guestbookCount} پیرۆزبایی</DashBadge>
                              {!inv.isActive && <DashBadge variant="danger">ناچالاک</DashBadge>}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 shrink-0 sm:flex-nowrap">
                            <button
                              type="button"
                              onClick={() => onCopyLink(inv.id, inv.links.main)}
                              className="btn-dash-outline flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold"
                            >
                              {copiedId === inv.id ? (
                                <Check className="w-3.5 h-3.5" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                              بانگهێشت
                            </button>
                            <button
                              type="button"
                              onClick={() => onCopyLink(`${inv.id}-guest`, inv.links.guest)}
                              className="btn-dash-primary flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold"
                            >
                              {copiedId === `${inv.id}-guest` ? (
                                <Check className="w-3.5 h-3.5" />
                              ) : (
                                <Heart className="w-3.5 h-3.5" />
                              )}
                              میوان
                            </button>
                            <button
                              type="button"
                              onClick={() => onOpenEdit(inv.id)}
                              className="btn-dash-primary flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold"
                            >
                              <Pencil className="w-3.5 h-3.5" /> دەستکاری
                            </button>
                            <button
                              type="button"
                              onClick={() => onDelete(inv.id)}
                              className="p-2 rounded-xl border border-rose-200 text-rose-500 hover:bg-rose-50"
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
          )}

          {adminTab === "orders" && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#9ca3af]">{orders.length} ئۆردەر</span>
              </div>
              {orders.length === 0 ? (
                <div className="dash-card p-6 text-sm text-[#6b7280]">هێشتا هیچ ئۆردەرێک نییە.</div>
              ) : (
                <div className="grid gap-3">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="dash-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <p className="text-[#1a1d1f] font-semibold">{order.customerName}</p>
                        <p className="text-xs text-[#6b7280]">{order.phone}</p>
                        <p className="text-xs text-[#22c55e]">{order.templateName}</p>
                        {order.notes && (
                          <p className="text-xs text-[#9ca3af] line-clamp-2">{order.notes}</p>
                        )}
                      </div>
                      <select
                        value={order.status}
                        onChange={async (e) => {
                          await api.updateOrderStatus(
                            order.id,
                            e.target.value as TemplateOrder["status"]
                          );
                          await loadList();
                        }}
                        className="dash-input text-xs min-w-[140px]"
                      >
                        <option value="new">نوێ</option>
                        <option value="confirmed">پەسەندکراو</option>
                        <option value="done">تەواوبوو</option>
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {adminTab === "settings" && (
            <AdminSettingsPanel onSaved={setSiteSettings} />
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
