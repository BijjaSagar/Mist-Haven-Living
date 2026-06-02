"use client";

import { useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type PdfUploadFieldProps = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
  uploadFolder?: string;
};

export function PdfUploadField({
  label,
  value,
  onChange,
  hint,
  uploadFolder = "pdfs/private-label",
}: PdfUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("kind", "pdf");
    if (uploadFolder) formData.append("folder", uploadFolder);
    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const body = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !body.url) {
        setError(body.error ?? "Upload failed");
        return;
      }
      onChange(body.url);
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
        placeholder="/uploads/pdfs/…"
      />
      {value ? (
        <p className="mt-2 font-body text-xs text-muted">
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-sage-deep hover:underline">
            Preview PDF
          </a>
        </p>
      ) : null}
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="sr-only"
          id={`pdf-upload-${label.replace(/\s+/g, "-")}`}
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
          {uploading ? "Uploading…" : "Upload PDF"}
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
