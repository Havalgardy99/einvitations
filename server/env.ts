import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

dotenv.config({ path: path.join(rootDir, ".env.local") });
dotenv.config({ path: path.join(rootDir, ".env") });

function clean(value: string | undefined, fallback: string): string {
  return String(value ?? fallback)
    .replace(/^\uFEFF/, "")
    .trim()
    .replace(/^["']|["']$/g, "");
}

export const PORT = Number(process.env.PORT) || 3001;
export const ADMIN_USERNAME = clean(process.env.ADMIN_USERNAME, "admin");
export const ADMIN_PASSWORD = clean(process.env.ADMIN_PASSWORD, "admin123");
export const APP_URL = clean(process.env.APP_URL, "http://localhost:3000");

export function credentialsMatch(username: string, password: string): boolean {
  const user = username.trim().toLowerCase();
  const pass = password.trim();
  const expectedUser = ADMIN_USERNAME.toLowerCase();
  const expectedPass = ADMIN_PASSWORD;

  if (pass !== expectedPass) {
    return false;
  }
  if (!user) {
    return true;
  }
  return user === expectedUser;
}
