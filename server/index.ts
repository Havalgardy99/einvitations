import express from "express";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import {
  createDefaultTemplate,
  templateToPublic,
  type InvitationRecord,
  type InvitationTemplate,
  type RSVP,
  type GuestbookEntry,
  type OrderStatus,
  type TemplateOrder
} from "../shared/invitation.js";
import {
  TEMPLATE_PRESETS,
  getTemplatePreset
} from "../shared/templates.js";
import type { CustomTemplateCategory } from "../shared/templateCategories.js";
import { DEFAULT_THEME_COLORS } from "../shared/templateCategories.js";
import { DEFAULT_SITE_SETTINGS } from "../shared/siteSettings.js";
import type { SiteSettings } from "../shared/siteSettings.js";
import { resolveTemplateMeta } from "../shared/templateResolve.js";
import { readDb, writeDb } from "./db.js";
import { generateToken, hashToken, verifyAdmin } from "./auth.js";
import { uniqueSlug } from "./slug.js";
import {
  PORT,
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
  APP_URL,
  credentialsMatch
} from "./env.js";
import { buildLinks } from "./links.js";
import { UPLOADS_DIR } from "./uploads-dir.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,PATCH,OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});

app.use("/uploads", express.static(UPLOADS_DIR));
app.use(express.json({ limit: "2mb" }));

function requireAdmin(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const db = readDb();
  if (!verifyAdmin(req.headers.authorization, db.adminTokenHash, ADMIN_PASSWORD)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

function findBySlug(slug: string): InvitationRecord | undefined {
  return readDb().invitations.find((i) => i.slug === slug && i.isActive);
}

function findById(id: string): InvitationRecord | undefined {
  return readDb().invitations.find((i) => i.id === id);
}

function withLinks<T extends { slug: string }>(inv: T) {
  const links = buildLinks(inv.slug);
  return { ...inv, links, link: links.main };
}

function toTemplateKey(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function resolveTemplateDefaults(templateKey?: string): {
  key: string;
  defaults: Partial<InvitationTemplate>;
} {
  const db = readDb();
  const custom = db.customTemplateCategories.find((c) => c.key === templateKey && c.isActive);
  if (custom) {
    return {
      key: custom.key,
      defaults: {
        introVideoUrl: custom.introVideoUrl,
        themeOverrides: custom.theme
      }
    };
  }
  const preset = getTemplatePreset(templateKey);
  return { key: preset.key, defaults: preset.defaults };
}

function buildTemplateCatalog() {
  const db = readDb();
  const builtin = TEMPLATE_PRESETS.map((preset) => ({
    key: preset.key,
    name: preset.name,
    subtitle: preset.subtitle,
    description: preset.description,
    previewImageUrl: preset.previewImageUrl
  }));
  const custom = db.customTemplateCategories
    .filter((c) => c.isActive)
    .map((c) => ({
      key: c.key,
      name: c.name,
      subtitle: c.subtitle,
      description: c.description,
      previewImageUrl: c.previewImageUrl
    }));
  return [...builtin, ...custom];
}

// ——— Auth ———
function handleLogin(
  req: express.Request,
  res: express.Response
): void {
  const body = req.body as {
    username?: string;
    password?: string;
    email?: string;
  };
  const user = String(body.username ?? body.email ?? "").trim();
  const pass = String(body.password ?? "").trim();
  if (!pass || !credentialsMatch(user, pass)) {
    res.status(401).json({ error: "ناوی بەکارهێنەر یان وشەی نهێنی هەڵەیە" });
    return;
  }
  const token = generateToken();
  const db = readDb();
  db.adminTokenHash = hashToken(token);
  writeDb(db);
  res.json({ token });
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "digital-invitation-api" });
});

app.post("/api/auth/login", handleLogin);
app.post("/api/admin/login", handleLogin);

app.get("/api/auth/me", requireAdmin, (_req, res) => {
  res.json({ ok: true });
});
app.get("/api/admin/me", requireAdmin, (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/admin/upload", requireAdmin, (req, res, next) => {
  import("./upload.js")
    .then(({ imageUpload }) => {
      imageUpload.single("image")(req, res, (err) => {
        if (err) {
          next(err);
          return;
        }
        if (!req.file) {
          res.status(400).json({ error: "وێنە هەڵبژێرە" });
          return;
        }
        res.json({ url: `/uploads/${req.file.filename}` });
      });
    })
    .catch((err: NodeJS.ErrnoException) => {
      if (err.code === "ERR_MODULE_NOT_FOUND") {
        res.status(503).json({
          error: "پاکێجی multer نەدۆزرایەوە — لە تێرمیناڵ: npm.cmd install"
        });
        return;
      }
      next(err);
    });
});

app.post("/api/admin/upload-video", requireAdmin, (req, res, next) => {
  import("./upload.js")
    .then(({ videoUpload }) => {
      videoUpload.single("video")(req, res, (err) => {
        if (err) {
          next(err);
          return;
        }
        if (!req.file) {
          res.status(400).json({ error: "ڤیدیۆ هەڵبژێرە" });
          return;
        }
        res.json({ url: `/uploads/${req.file.filename}` });
      });
    })
    .catch((err: NodeJS.ErrnoException) => {
      if (err.code === "ERR_MODULE_NOT_FOUND") {
        res.status(503).json({
          error: "پاکێجی multer نەدۆزرایەوە — لە تێرمیناڵ: npm.cmd install"
        });
        return;
      }
      next(err);
    });
});

// ——— Admin: custom template categories ———
app.get("/api/admin/template-categories", requireAdmin, (_req, res) => {
  const db = readDb();
  res.json(db.customTemplateCategories);
});

app.post("/api/admin/template-categories", requireAdmin, (req, res) => {
  const body = req.body as Partial<CustomTemplateCategory>;
  const db = readDb();
  const key = toTemplateKey(String(body.key ?? body.name ?? ""));
  if (!key) {
    res.status(400).json({ error: "کلیلی کەتەگۆری پێویستە" });
    return;
  }
  const usedBuiltin = TEMPLATE_PRESETS.some((p) => p.key === key);
  const usedCustom = db.customTemplateCategories.some((c) => c.key === key);
  if (usedBuiltin || usedCustom) {
    res.status(409).json({ error: "ئەم کلیلی تێمپلەیتە پێشتر هەیە" });
    return;
  }
  const now = new Date().toISOString();
  const row: CustomTemplateCategory = {
    id: crypto.randomUUID(),
    key,
    name: String(body.name ?? "").trim() || key,
    subtitle: String(body.subtitle ?? "").trim() || "تێمپلەیتی تایبەت",
    description: String(body.description ?? "").trim() || "تێمپلەیتی درووستکراوی داشبۆرد",
    previewImageUrl: String(body.previewImageUrl ?? "").trim(),
    layoutType: body.layoutType === "cinematic" ? "cinematic" : "luxury",
    introVideoUrl: String(body.introVideoUrl ?? "").trim() || undefined,
    theme: {
      ...DEFAULT_THEME_COLORS,
      ...(body.theme ?? {})
    },
    isActive: body.isActive !== false,
    createdAt: now,
    updatedAt: now
  };
  db.customTemplateCategories.unshift(row);
  writeDb(db);
  res.status(201).json(row);
});

app.put("/api/admin/template-categories/:id", requireAdmin, (req, res) => {
  const db = readDb();
  const idx = db.customTemplateCategories.findIndex((c) => c.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  const current = db.customTemplateCategories[idx];
  const body = req.body as Partial<CustomTemplateCategory>;
  const key = toTemplateKey(String(body.key ?? current.key));
  const usedBuiltin = TEMPLATE_PRESETS.some((p) => p.key === key);
  const usedByOther = db.customTemplateCategories.some((c) => c.id !== current.id && c.key === key);
  if (usedBuiltin || usedByOther) {
    res.status(409).json({ error: "ئەم کلیلی تێمپلەیتە پێشتر هەیە" });
    return;
  }
  const updated: CustomTemplateCategory = {
    ...current,
    ...body,
    key,
    theme: { ...current.theme, ...(body.theme ?? {}) },
    updatedAt: new Date().toISOString()
  };
  db.customTemplateCategories[idx] = updated;
  writeDb(db);
  res.json(updated);
});

app.delete("/api/admin/template-categories/:id", requireAdmin, (req, res) => {
  const db = readDb();
  const before = db.customTemplateCategories.length;
  db.customTemplateCategories = db.customTemplateCategories.filter((c) => c.id !== req.params.id);
  if (before === db.customTemplateCategories.length) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  writeDb(db);
  res.json({ ok: true });
});

// ——— Admin: invitations ———
app.get("/api/admin/invitations", requireAdmin, (_req, res) => {
  const db = readDb();
  const list = db.invitations.map((inv) => ({
    ...withLinks(templateToPublic(inv)),
    rsvpCount: inv.rsvps.length,
    guestbookCount: inv.guestbook.length
  }));
  res.json(list);
});

app.post("/api/admin/invitations", requireAdmin, (req, res) => {
  const { accountName, coupleName1, coupleName2, templateKey } = req.body as {
    accountName?: string;
    coupleName1?: string;
    coupleName2?: string;
    templateKey?: string;
  };

  const db = readDb();
  const existingSlugs = db.invitations.map((i) => i.slug);
  const nameForSlug =
    accountName ||
    [coupleName1, coupleName2].filter(Boolean).join("-") ||
    "invite";
  const slug = uniqueSlug(nameForSlug, existingSlugs);
  const now = new Date().toISOString();
  const selected = resolveTemplateDefaults(templateKey);

  const template = createDefaultTemplate({
    id: crypto.randomUUID(),
    slug,
    templateKey: selected.key,
    accountName: accountName || nameForSlug,
    coupleName1: coupleName1 || "ناوی یەکەم",
    coupleName2: coupleName2 || "ناوی دووەم",
    monogram:
      coupleName1 && coupleName2
        ? `${coupleName1[0]} & ${coupleName2[0]}`
        : "♥",
    ...selected.defaults,
    createdAt: now,
    updatedAt: now
  });

  const record: InvitationRecord = {
    ...template,
    rsvps: [],
    guestbook: []
  };

  db.invitations.unshift(record);
  writeDb(db);

  res.status(201).json(withLinks(templateToPublic(record)));
});

app.get("/api/admin/invitations/:id", requireAdmin, (req, res) => {
  const inv = findById(req.params.id);
  if (!inv) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(withLinks(inv));
});

app.put("/api/admin/invitations/:id", requireAdmin, (req, res) => {
  const db = readDb();
  const idx = db.invitations.findIndex((i) => i.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  const current = db.invitations[idx];
  const body = req.body as Partial<InvitationTemplate>;

  if (body.slug && body.slug !== current.slug) {
    const taken = db.invitations.some(
      (i) => i.slug === body.slug && i.id !== current.id
    );
    if (taken) {
      res.status(409).json({ error: "ئەم slug ـە پێشتر بەکارهاتووە" });
      return;
    }
  }

  const updated: InvitationRecord = {
    ...current,
    ...body,
    id: current.id,
    rsvps: current.rsvps,
    guestbook: current.guestbook,
    updatedAt: new Date().toISOString()
  };

  db.invitations[idx] = updated;
  writeDb(db);

  res.json(withLinks(updated));
});

app.delete("/api/admin/invitations/:id", requireAdmin, (req, res) => {
  const db = readDb();
  const before = db.invitations.length;
  db.invitations = db.invitations.filter((i) => i.id !== req.params.id);
  if (db.invitations.length === before) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  writeDb(db);
  res.json({ ok: true });
});

app.get("/api/admin/invitations/:id/rsvps", requireAdmin, (req, res) => {
  const inv = findById(req.params.id);
  if (!inv) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(inv.rsvps);
});

app.get("/api/admin/invitations/:id/guestbook", requireAdmin, (req, res) => {
  const inv = findById(req.params.id);
  if (!inv) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(inv.guestbook);
});

app.get("/api/admin/orders", requireAdmin, (_req, res) => {
  const db = readDb();
  res.json(db.orders);
});

app.patch("/api/admin/orders/:id/status", requireAdmin, (req, res) => {
  const body = req.body as { status?: OrderStatus };
  if (!body.status || !["new", "confirmed", "done"].includes(body.status)) {
    res.status(400).json({ error: "status نادروستە" });
    return;
  }

  const db = readDb();
  const idx = db.orders.findIndex((o) => o.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  db.orders[idx].status = body.status;
  writeDb(db);
  res.json(db.orders[idx]);
});

// ——— Site settings ———
app.get("/api/settings", (_req, res) => {
  const db = readDb();
  res.json({ ...DEFAULT_SITE_SETTINGS, ...db.siteSettings });
});

app.get("/api/admin/settings", requireAdmin, (_req, res) => {
  const db = readDb();
  res.json({ ...DEFAULT_SITE_SETTINGS, ...db.siteSettings });
});

app.put("/api/admin/settings", requireAdmin, (req, res) => {
  const body = req.body as Partial<SiteSettings>;
  const db = readDb();
  db.siteSettings = {
    ...DEFAULT_SITE_SETTINGS,
    ...db.siteSettings,
    ...body
  };
  writeDb(db);
  res.json(db.siteSettings);
});

// ——— Public: invitation by slug ———
app.get("/api/templates", (_req, res) => {
  res.json(buildTemplateCatalog());
});

app.get("/api/templates/:key/demo", (req, res) => {
  const key = req.params.key;
  const db = readDb();
  const custom = db.customTemplateCategories.find((c) => c.key === key && c.isActive);
  const preset = getTemplatePreset(key);
  const isBuiltin = preset.key === key;

  if (!custom && !isBuiltin) {
    res.status(404).json({ error: "تێمپلەیت نەدۆزرایەوە" });
    return;
  }

  const layoutType = custom?.layoutType ?? (key === "cinematic" ? "cinematic" : "luxury");
  const renderKey = layoutType === "cinematic" ? "cinematic" : isBuiltin ? key : "royal";

  const config = createDefaultTemplate({
    id: "demo-id",
    slug: `demo-${key}`,
    accountName: custom ? `Demo - ${custom.name}` : `Demo - ${preset.name}`,
    templateKey: renderKey,
    coupleName1: "ئاوات",
    coupleName2: "ڕۆژین",
    ...(custom
      ? {
          introVideoUrl: custom.introVideoUrl,
          themeOverrides: custom.theme,
          coverImageUrl: custom.previewImageUrl || undefined
        }
      : preset.defaults)
  });

  res.json({
    config: {
      ...config,
      templateKey: renderKey,
      introVideoUrl: custom?.introVideoUrl ?? preset.defaults.introVideoUrl,
      themeOverrides: custom?.theme
    },
    layoutType,
    catalogKey: key
  });
});

app.post("/api/orders", (req, res) => {
  const body = req.body as {
    templateKey?: string;
    customerName?: string;
    phone?: string;
    notes?: string;
  };

  const customerName = String(body.customerName ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const notes = String(body.notes ?? "").trim();
  if (!customerName || !phone) {
    res.status(400).json({ error: "ناو و مۆبایل پێویستن" });
    return;
  }

  const db = readDb();
  const custom = db.customTemplateCategories.find(
    (c) => c.key === body.templateKey && c.isActive
  );
  const preset = getTemplatePreset(body.templateKey);
  const order: TemplateOrder = {
    id: crypto.randomUUID(),
    templateKey: custom?.key ?? preset.key,
    templateName: custom?.name ?? preset.name,
    customerName,
    phone,
    notes,
    status: "new",
    createdAt: new Date().toISOString()
  };

  db.orders.unshift(order);
  writeDb(db);
  res.status(201).json(order);
});

app.get("/api/invitations/:slug", (req, res) => {
  const inv = findBySlug(req.params.slug);
  if (!inv) {
    res.status(404).json({ error: "بانگهێشتنامەکە نەدۆزرایەوە" });
    return;
  }
  const db = readDb();
  const meta = resolveTemplateMeta(inv, db.customTemplateCategories);
  const view = templateToPublic(inv);
  const decorated: InvitationTemplate = {
    ...view,
    templateKey:
      meta.layoutType === "cinematic"
        ? "cinematic"
        : (meta.presetKey ?? "royal"),
    introVideoUrl: meta.introVideoUrl,
    themeOverrides: meta.theme ?? view.themeOverrides
  };
  res.json(decorated);
});

app.get("/api/invitations/:slug/rsvps", (req, res) => {
  const inv = findBySlug(req.params.slug);
  if (!inv) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(inv.rsvps.filter((r) => r.isAttending).map((r) => ({ name: r.name })));
});

app.post("/api/invitations/:slug/rsvps", (req, res) => {
  const db = readDb();
  const idx = db.invitations.findIndex(
    (i) => i.slug === req.params.slug && i.isActive
  );
  if (idx === -1) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  const body = req.body as Omit<RSVP, "id" | "timestamp">;
  if (!body.name?.trim()) {
    res.status(400).json({ error: "ناو پێویستە" });
    return;
  }

  const entry: RSVP = {
    id: crypto.randomUUID(),
    name: body.name.trim(),
    isAttending: Boolean(body.isAttending),
    guestsCount: body.isAttending ? Number(body.guestsCount) || 1 : 0,
    dietaryRestrictions: body.dietaryRestrictions?.trim() || "",
    favoriteSong: body.favoriteSong?.trim() || "",
    timestamp: new Date().toLocaleDateString("ku", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  };

  db.invitations[idx].rsvps.unshift(entry);
  writeDb(db);
  res.status(201).json(entry);
});

app.get("/api/invitations/:slug/guestbook", (req, res) => {
  const inv = findBySlug(req.params.slug);
  if (!inv) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(inv.guestbook);
});

app.post("/api/invitations/:slug/guestbook", (req, res) => {
  const db = readDb();
  const idx = db.invitations.findIndex(
    (i) => i.slug === req.params.slug && i.isActive
  );
  if (idx === -1) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  const body = req.body as Omit<GuestbookEntry, "id" | "timestamp">;
  if (!body.name?.trim() || !body.message?.trim()) {
    res.status(400).json({ error: "ناو و پەیام پێویستن" });
    return;
  }

  const entry: GuestbookEntry = {
    id: crypto.randomUUID(),
    name: body.name.trim(),
    message: body.message.trim(),
    emoji: body.emoji || "❤️",
    timestamp: new Date().toLocaleDateString("ku", {
      month: "short",
      day: "numeric",
      year: "numeric"
    })
  };

  db.invitations[idx].guestbook.unshift(entry);
  writeDb(db);
  res.status(201).json(entry);
});

// Production static files (when dist exists after `npm run build`)
const distPath = path.resolve(__dirname, "../dist");
const serveStatic =
  process.env.NODE_ENV === "production" || fs.existsSync(path.join(distPath, "index.html"));
if (serveStatic) {
  app.use(express.static(distPath));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      next();
      return;
    }
    res.sendFile(path.join(distPath, "index.html"));
  });
}

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`API server: http://localhost:${PORT}`);
  console.log(`Admin login: ${ADMIN_USERNAME} / (see ADMIN_PASSWORD in .env.local)`);
  console.log(`Admin dashboard: ${APP_URL}/admin`);
});

server.on("error", (err: NodeJS.ErrnoException) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `\nپۆرتی ${PORT} پێشتر بەکارهاتووە. لە PowerShell:\n` +
        `  netstat -ano | findstr :${PORT}\n` +
        `  taskkill /PID <ژمارە> /F\n` +
        `یان PORT=3002 لە .env.local بنووسە و دووبارە dev بکەرەوە.\n`
    );
    process.exit(1);
  }
  throw err;
});
