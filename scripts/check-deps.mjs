import { existsSync } from "fs";

if (!existsSync("node_modules/multer/package.json")) {
  console.error("\n❌ پاکێجی multer نەدۆزرایەوە.");
  console.error("   لە فۆڵدەری پرۆژەکە ئەمە بنووسە:\n");
  console.error("   npm.cmd install\n");
  process.exit(1);
}
