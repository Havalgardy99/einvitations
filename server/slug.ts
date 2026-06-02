import crypto from "crypto";

const KURDISH_MAP: Record<string, string> = {
  ا: "a",
  ب: "b",
  پ: "p",
  ت: "t",
  ج: "j",
  چ: "ch",
  ح: "h",
  خ: "kh",
  د: "d",
  ر: "r",
  ز: "z",
  ژ: "zh",
  س: "s",
  ش: "sh",
  ع: "a",
  غ: "gh",
  ف: "f",
  ق: "q",
  ک: "k",
  گ: "g",
  ل: "l",
  م: "m",
  ن: "n",
  ه: "h",
  و: "w",
  ی: "y",
  ێ: "e",
  ە: "e",
  ئ: "",
  ء: "",
  ـ: ""
};

export function slugify(text: string): string {
  let result = text.trim().toLowerCase();

  for (const [ku, lat] of Object.entries(KURDISH_MAP)) {
    result = result.split(ku).join(lat);
  }

  result = result
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);

  if (!result) {
    result = "invite";
  }

  return result;
}

export function uniqueSlug(base: string, existing: string[]): string {
  const root = slugify(base) || "invite";
  if (!existing.includes(root)) {
    return root;
  }
  const suffix = crypto.randomBytes(3).toString("hex");
  const candidate = `${root}-${suffix}`;
  if (!existing.includes(candidate)) {
    return candidate;
  }
  return `${root}-${Date.now().toString(36)}`;
}
