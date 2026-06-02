import crypto from "crypto";

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function verifyAdmin(
  authHeader: string | undefined,
  dbHash: string | null,
  envPassword: string
): boolean {
  if (!authHeader?.startsWith("Bearer ")) {
    return false;
  }
  const token = authHeader.slice(7);
  if (dbHash) {
    return hashToken(token) === dbHash;
  }
  return token === envPassword;
}
