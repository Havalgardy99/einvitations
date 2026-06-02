import React, { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { api } from "../../api/client";
import { mediaUrl } from "../../api/base";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({
  value,
  onChange,
  label = "وێنەی سەرپەڕە"
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("تەنها فایلی وێنە");
      return;
    }
    setError("");
    setUploading(true);
    try {
      const { url } = await api.uploadImage(file);
      onChange(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "ئەپلۆد سەرکەوتوو نەبوو");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-xs font-medium tracking-wide text-[#CBB084] block text-right">
        {label}
      </label>

      {value && (
        <div className="relative rounded-xl overflow-hidden border border-[#D4AF37]/25 aspect-[4/3] max-h-48">
          <img
            src={mediaUrl(value)}
            alt=""
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 left-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleFile(f);
          e.target.value = "";
        }}
      />

      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="w-full flex flex-col items-center justify-center gap-2 py-8 rounded-xl border-2 border-dashed border-[#D4AF37]/30 bg-[#0c0a09]/50 hover:border-[#D4AF37]/50 hover:bg-[#6D1520]/10 transition-all disabled:opacity-50"
      >
        {uploading ? (
          <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
        ) : (
          <ImagePlus className="w-8 h-8 text-[#D4AF37]/70" />
        )}
        <span className="text-sm text-[#A39081]">
          {uploading ? "بارکردن..." : "کلیک بکە و وێنە هەڵبژێرە"}
        </span>
        <span className="text-[10px] text-[#A39081]/70">JPG, PNG, WebP — تا 8MB</span>
      </button>

      {error && <p className="text-rose-400 text-xs text-center">{error}</p>}
    </div>
  );
}
