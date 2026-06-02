import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import {
  isUnauthorized,
  requireAdmin,
} from "@/lib/admin/api-helpers";
import { resolveUploadDir, sanitizeUploadSegment } from "@/lib/uploads";

const IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
  "image/x-icon",
  "image/vnd.microsoft.icon",
];

const PDF_TYPES = ["application/pdf"];

function safeFilename(original: string, fallbackExt: string): string {
  const ext = original.split(".").pop()?.toLowerCase() ?? fallbackExt;
  const safeExt = ext.replace(/[^a-z0-9]/g, "") || fallbackExt;
  return `${Date.now()}-${Math.random().toString(36).slice(2)}.${safeExt}`;
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const kind = (formData.get("kind") as string | null)?.toLowerCase() ?? "image";
    const folder = (formData.get("folder") as string | null)?.trim() || undefined;

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    const isIco = ext === "ico";
    const isPdf = ext === "pdf" || PDF_TYPES.includes(file.type);

    if (kind === "pdf" || isPdf) {
      if (!PDF_TYPES.includes(file.type) && ext !== "pdf") {
        return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
      }
      if (file.size > 15 * 1024 * 1024) {
        return NextResponse.json(
          { error: "File too large (max 15MB)" },
          { status: 400 },
        );
      }
      const pdfFolder =
        folder ?? `pdfs/${sanitizeUploadSegment(formData.get("label") as string ?? "documents")}`;
      const { diskPath, publicPrefix } = resolveUploadDir(pdfFolder);
      await mkdir(diskPath, { recursive: true });
      const filename = safeFilename(file.name, "pdf");
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(path.join(diskPath, filename), buffer);
      return NextResponse.json({ url: `${publicPrefix}/${filename}` });
    }

    if (
      !IMAGE_TYPES.includes(file.type) &&
      !(isIco && file.type === "application/octet-stream")
    ) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
    }

    const { diskPath, publicPrefix } = resolveUploadDir(folder);
    await mkdir(diskPath, { recursive: true });

    const filename = safeFilename(file.name, "png");
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(diskPath, filename), buffer);

    return NextResponse.json({ url: `${publicPrefix}/${filename}` });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
