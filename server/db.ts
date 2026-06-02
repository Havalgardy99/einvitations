import fs from "fs";
import path from "path";
import crypto from "crypto";
import {
  createDefaultTemplate,
  type DatabaseSchema,
  type InvitationRecord
} from "../shared/invitation.js";
import { DEFAULT_SITE_SETTINGS } from "../shared/siteSettings.js";

const DATA_DIR = path.resolve(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "db.json");

function ensureDb(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_PATH)) {
    const seed = seedDatabase();
    writeDb(seed);
    return seed;
  }

  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return normalizeDb(JSON.parse(raw) as Partial<DatabaseSchema>);
}

function seedDatabase(): DatabaseSchema {
  const now = new Date().toISOString();
  const template = createDefaultTemplate({
    id: crypto.randomUUID(),
    slug: "daniel-elira",
    accountName: "دانیال و ئیلیرا",
    createdAt: now,
    updatedAt: now
  });

  const invitation: InvitationRecord = {
    ...template,
    rsvps: [],
    guestbook: []
  };

  return {
    adminTokenHash: null,
    invitations: [invitation],
    orders: [],
    customTemplateCategories: [],
    siteSettings: { ...DEFAULT_SITE_SETTINGS }
  };
}

function normalizeDb(raw: Partial<DatabaseSchema>): DatabaseSchema {
  return {
    adminTokenHash: raw.adminTokenHash ?? null,
    invitations: Array.isArray(raw.invitations) ? raw.invitations : [],
    orders: Array.isArray(raw.orders) ? raw.orders : [],
    customTemplateCategories: Array.isArray(raw.customTemplateCategories)
      ? raw.customTemplateCategories
      : [],
    siteSettings: raw.siteSettings
      ? { ...DEFAULT_SITE_SETTINGS, ...raw.siteSettings }
      : { ...DEFAULT_SITE_SETTINGS }
  };
}

let cache: DatabaseSchema | null = null;

export function readDb(): DatabaseSchema {
  if (!cache) {
    cache = ensureDb();
  }
  return cache;
}

export function writeDb(data: DatabaseSchema): void {
  cache = data;
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export function refreshDb(): DatabaseSchema {
  cache = null;
  return readDb();
}
