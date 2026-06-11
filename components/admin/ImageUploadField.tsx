"use client";

import { useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getApiData, getApiErrorMessage } from "@/lib/api-response";
import { cmsImageSrc } from "@/lib/image-props";

type ImageUploadFieldProps = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
  /** e.g. `products/bath-towels` → public/uploads/products/bath-towels/ */
  uploadFolder?: string;
};

export function ImageUploadField({
  label,
  value,
  onChange,
  hint,
  uploadFolder,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    if (uploadFolder) formData.append("folder", uploadFolder);
    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const body = await res.json();
      if (!res.ok) {
        setError(getApiErrorMessage(body));
        return;
      }
      const { url } = getApiData<{ url: string }>(body);
      if (!url) {
        setError("Upload failed");
        return;
      }
      console.log("[ImageUploadField] upload success", { url, uploadFolder });
      onChange(url);
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <Label>{label}</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1"
        placeholder="/uploads/… or https://…"
      />
      {value ? (
        <div className="mt-2 overflow-hidden rounded-md border border-hairline bg-oat/40 p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cmsImageSrc(value)}
            alt=""
            className="max-h-24 max-w-full object-contain"
          />
        </div>
      ) : null}
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml,image/x-icon,.ico"
          className="sr-only"
          id={`upload-${label.replace(/\s+/g, "-")}`}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? "Uploading…" : "Upload image"}
        </Button>
        {value ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-muted"
            onClick={() => onChange("")}
          >
            Clear
          </Button>
        ) : null}
      </div>
      {error ? (
        <p className="mt-1 font-body text-xs text-red-600">{error}</p>
      ) : null}
      {hint ? (
        <p className="mt-1 font-body text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
}
