import type {
  CustomTemplateCategory,
  GuestbookEntry,
  InvitationLinks,
  InvitationTemplate,
  RSVP,
  TemplateOrder
} from "../../shared/invitation";
import type { TemplateLayoutType } from "../../shared/templateCategories";
import type { SiteSettings } from "../../shared/siteSettings";
import { apiUrl } from "./base";

function authHeaders(): HeadersInit {
  const token = localStorage.getItem("admin_token");
  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(apiUrl(url), options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    const message =
      (err as { error?: string }).error ||
      `HTTP ${res.status}: ${res.statusText}`;
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export type AdminInvitationListItem = InvitationTemplate & {
  links: InvitationLinks;
  link: string;
  rsvpCount: number;
  guestbookCount: number;
};

export type AdminInvitationDetail = InvitationTemplate & {
  links: InvitationLinks;
  link: string;
  rsvps: RSVP[];
  guestbook: GuestbookEntry[];
};

export interface PublicTemplateCard {
  key: string;
  name: string;
  subtitle: string;
  description: string;
  previewImageUrl: string;
}

export const api = {
  login(username: string, password: string) {
    return request<{ token: string }>("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
  },

  checkAuth() {
    return request<{ ok: boolean }>("/api/auth/me", { headers: authHeaders() });
  },

  listInvitations() {
    return request<AdminInvitationListItem[]>("/api/admin/invitations", {
      headers: authHeaders()
    });
  },

  createInvitation(data: {
    accountName: string;
    coupleName1?: string;
    coupleName2?: string;
    templateKey?: string;
  }) {
    return request<AdminInvitationListItem & { link: string }>(
      "/api/admin/invitations",
      {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data)
      }
    );
  },

  getInvitation(id: string) {
    return request<AdminInvitationDetail>(`/api/admin/invitations/${id}`, {
      headers: authHeaders()
    });
  },

  updateInvitation(id: string, data: Partial<InvitationTemplate>) {
    return request<AdminInvitationDetail>(`/api/admin/invitations/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(data)
    });
  },

  deleteInvitation(id: string) {
    return request<{ ok: boolean }>(`/api/admin/invitations/${id}`, {
      method: "DELETE",
      headers: authHeaders()
    });
  },

  uploadImage(file: File) {
    const form = new FormData();
    form.append("image", file);
    const token = localStorage.getItem("admin_token");
    return fetch(apiUrl("/api/admin/upload"), {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form
    }).then(async (res) => {
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error((err as { error?: string }).error || "Upload failed");
      }
      return res.json() as Promise<{ url: string }>;
    });
  },

  uploadVideo(file: File) {
    const form = new FormData();
    form.append("video", file);
    const token = localStorage.getItem("admin_token");
    return fetch(apiUrl("/api/admin/upload-video"), {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form
    }).then(async (res) => {
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error((err as { error?: string }).error || "Upload failed");
      }
      return res.json() as Promise<{ url: string }>;
    });
  },

  getPublicInvitation(slug: string) {
    return request<InvitationTemplate>(`/api/invitations/${slug}`);
  },

  submitRsvp(
    slug: string,
    data: Omit<RSVP, "id" | "timestamp">
  ) {
    return request<RSVP>(`/api/invitations/${slug}/rsvps`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  },

  getGuestbook(slug: string) {
    return request<GuestbookEntry[]>(`/api/invitations/${slug}/guestbook`);
  },

  submitGuestbook(
    slug: string,
    data: Omit<GuestbookEntry, "id" | "timestamp">
  ) {
    return request<GuestbookEntry>(`/api/invitations/${slug}/guestbook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  },

  listTemplateCards() {
    return request<PublicTemplateCard[]>("/api/templates");
  },

  getTemplateDemo(key: string) {
    return request<{
      config: InvitationTemplate;
      layoutType: TemplateLayoutType;
      catalogKey: string;
    }>(`/api/templates/${encodeURIComponent(key)}/demo`);
  },

  createOrder(data: {
    templateKey: string;
    customerName: string;
    phone: string;
    notes?: string;
  }) {
    return request<TemplateOrder>("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  },

  listOrders() {
    return request<TemplateOrder[]>("/api/admin/orders", { headers: authHeaders() });
  },

  updateOrderStatus(id: string, status: TemplateOrder["status"]) {
    return request<TemplateOrder>(`/api/admin/orders/${id}/status`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({ status })
    });
  },

  listTemplateCategories() {
    return request<CustomTemplateCategory[]>("/api/admin/template-categories", {
      headers: authHeaders()
    });
  },

  createTemplateCategory(data: Partial<CustomTemplateCategory>) {
    return request<CustomTemplateCategory>("/api/admin/template-categories", {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data)
    });
  },

  updateTemplateCategory(id: string, data: Partial<CustomTemplateCategory>) {
    return request<CustomTemplateCategory>(`/api/admin/template-categories/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(data)
    });
  },

  deleteTemplateCategory(id: string) {
    return request<{ ok: boolean }>(`/api/admin/template-categories/${id}`, {
      method: "DELETE",
      headers: authHeaders()
    });
  },

  getSiteSettings() {
    return request<SiteSettings>("/api/settings");
  },

  getAdminSettings() {
    return request<SiteSettings>("/api/admin/settings", { headers: authHeaders() });
  },

  updateSiteSettings(data: Partial<SiteSettings>) {
    return request<SiteSettings>("/api/admin/settings", {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(data)
    });
  }
};
