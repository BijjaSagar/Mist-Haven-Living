"use client";

import { useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api-response";

type ProductGalleryFieldProps = {
  images: string[];
  onChange: (images: string[]) => void;
  productSlug: string;
};

export function ProductGalleryField({
  images,
  onChange,
  productSlug,
}: ProductGalleryFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const uploadFolder = `products/${productSlug}`;

  async function handleFiles(fileList: FileList) {
    setUploading(true);
    setError(null);
    const added: string[] = [];
    try {
      for (const file of Array.from(fileList)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", uploadFolder);
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        const body = (await res.json()) as { url?: string };
        if (!res.ok || !body.url) {
          setError(getApiErrorMessage(body));
          break;
        }
        added.push(body.url);
      }
      if (added.length > 0) {
        onChange([...images, ...added]);
      }
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeAt(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  function move(index: number, direction: -1 | 1) {
    const next = index + direction;
    if (next < 0 || next >= images.length) return;
    const copy = [...images];
    [copy[index], copy[next]] = [copy[next], copy[index]];
    onChange(copy);
  }

  return (
    <div>
      <Label>Gallery images</Label>
      <p className="mt-1 font-body text-xs text-muted">
        Additional photos on the product page. Stored under{" "}
        <code className="text-taupe">public/uploads/products/{productSlug}/</code>.
        Save product after uploading.
      </p>
      {images.length > 0 ? (
        <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((url, index) => (
            <li
              key={`${url}-${index}`}
              className="overflow-hidden rounded-md border border-hairline bg-oat/40 p-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="aspect-[4/3] w-full object-cover" />
              <div className="mt-2 flex flex-wrap gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                >
                  ↑
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={index === images.length - 1}
                  onClick={() => move(index, 1)}
                >
                  ↓
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-red-600"
                  onClick={() => removeAt(index)}
                >
                  Remove
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          multiple
          className="sr-only"
          id={`gallery-upload-${productSlug}`}
          onChange={(e) => {
            const files = e.target.files;
            if (files?.length) void handleFiles(files);
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? "Uploading…" : "Add gallery images"}
        </Button>
      </div>
      {error ? (
        <p className="mt-1 font-body text-xs text-red-600">{error}</p>
      ) : null}
    </div>
  );
}
