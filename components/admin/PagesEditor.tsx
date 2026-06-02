"use client";

import { useState } from "react";
import type { PageContentData } from "@/lib/types/cms";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AdminSaveButton,
  AdminMessage,
  AdminCard,
} from "@/components/admin/AdminShell";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { PdfUploadField } from "@/components/admin/PdfUploadField";

export function PagesEditor({ initial }: { initial: PageContentData[] }) {
  const [pages, setPages] = useState(initial);
  const [activeSlug, setActiveSlug] = useState(initial[0]?.slug ?? "home");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const active = pages.find((p) => p.slug === activeSlug) ?? pages[0];

  function updateActive(field: keyof PageContentData, value: unknown) {
    setPages((prev) =>
      prev.map((p) => (p.slug === activeSlug ? { ...p, [field]: value } : p)),
    );
  }

  function updateHeroField(key: string, value: string) {
    const sections = {
      ...active.sections,
      hero: {
        ...(active.sections.hero as Record<string, string>),
        [key]: value,
      },
    };
    updateActive("sections", sections);
  }

  function updateSectionImage(
    sectionKey: "hero" | "heritage",
    imageUrl: string,
  ) {
    const section = (active.sections[sectionKey] ?? {}) as Record<string, string>;
    const sections = {
      ...active.sections,
      [sectionKey]: { ...section, imageUrl },
    };
    updateActive("sections", sections);
  }

  async function handleSave() {
    if (!active) return;
    setSaving(true);
    setMessage(null);
    const res = await fetch("/api/admin/pages", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(active),
    });
    setMessage(
      res.ok
        ? { text: "Page saved.", type: "success" }
        : { text: "Failed to save.", type: "error" },
    );
    setSaving(false);
  }

  const hero = (active?.sections.hero ?? {}) as Record<string, string>;
  const heritage = (active?.sections.heritage ?? {}) as Record<string, string>;
  const specs = (active?.sections.specs ?? {}) as Record<string, string>;
  const catalog = (active?.sections.catalog ?? {}) as Record<string, string>;

  function updateSpecsField(key: string, value: string) {
    const sections = {
      ...active.sections,
      specs: { ...specs, [key]: value },
    };
    updateActive("sections", sections);
  }

  function updateCatalogField(key: string, value: string) {
    const sections = {
      ...active.sections,
      catalog: { ...catalog, [key]: value },
    };
    updateActive("sections", sections);
  }

  return (
    <div className="space-y-6">
      <AdminMessage
        message={message?.text ?? null}
        type={message?.type ?? "success"}
      />

      <div className="flex flex-wrap gap-2">
        {pages.map((p) => (
          <button
            key={p.slug}
            type="button"
            onClick={() => setActiveSlug(p.slug)}
            className={`rounded-md px-4 py-2 font-body text-sm ${
              activeSlug === p.slug
                ? "bg-taupe text-pearl"
                : "bg-pearl text-taupe border border-hairline"
            }`}
          >
            {p.slug}
          </button>
        ))}
      </div>

      {active && (
        <>
          <AdminCard>
            <h2 className="mb-4 font-display text-xl text-taupe">SEO</h2>
            <div className="space-y-4">
              <div>
                <Label>Meta title</Label>
                <Input
                  value={active.metaTitle ?? ""}
                  onChange={(e) => updateActive("metaTitle", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Meta description</Label>
                <Textarea
                  value={active.metaDescription ?? ""}
                  onChange={(e) =>
                    updateActive("metaDescription", e.target.value)
                  }
                  className="mt-1"
                  rows={2}
                />
                <p className="mt-1 font-body text-xs text-muted">
                  Focus phrases for your reference (not shown to Google as
                  keywords tag)
                </p>
              </div>
            </div>
          </AdminCard>

          {(activeSlug === "home" || activeSlug === "about") && (
            <AdminCard>
              <h2 className="mb-4 font-display text-xl text-taupe">Hero</h2>
              <div className="space-y-4">
                <div>
                  <Label>Eyebrow</Label>
                  <Input
                    value={hero.eyebrow ?? ""}
                    onChange={(e) => updateHeroField("eyebrow", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Title</Label>
                  <Input
                    value={hero.title ?? ""}
                    onChange={(e) => updateHeroField("title", e.target.value)}
                    className="mt-1"
                  />
                </div>
                {hero.subtitle !== undefined && (
                  <div>
                    <Label>Subtitle</Label>
                    <Textarea
                      value={hero.subtitle ?? ""}
                      onChange={(e) =>
                        updateHeroField("subtitle", e.target.value)
                      }
                      className="mt-1"
                      rows={2}
                    />
                  </div>
                )}
                {hero.imageUrl !== undefined && (
                  <ImageUploadField
                    label="Hero image"
                    value={hero.imageUrl ?? ""}
                    onChange={(url) => updateSectionImage("hero", url)}
                    hint="Homepage hero background. Save page after upload."
                  />
                )}
              </div>
            </AdminCard>
          )}

          {activeSlug === "home" && heritage.imageUrl !== undefined && (
            <AdminCard>
              <h2 className="mb-4 font-display text-xl text-taupe">Heritage</h2>
              <ImageUploadField
                label="Heritage image"
                value={heritage.imageUrl ?? ""}
                onChange={(url) => updateSectionImage("heritage", url)}
                hint="Manufacturing / heritage block on homepage. Save page after upload."
              />
            </AdminCard>
          )}

          {activeSlug === "contact" && (
            <AdminCard>
              <h2 className="mb-4 font-display text-xl text-taupe">
                Product catalog download
              </h2>
              <p className="mb-4 font-body text-sm text-muted">
                Shown on the contact page after a visitor completes the catalog
                lead form. Save page after uploading the PDF.
              </p>
              <div className="space-y-4">
                <PdfUploadField
                  label="Product catalog PDF"
                  value={catalog.pdfUrl ?? ""}
                  onChange={(url) => updateCatalogField("pdfUrl", url)}
                  uploadFolder="pdfs/product-catalog"
                  hint="Download link on /contact (and catalog CTAs site-wide)"
                />
                <div>
                  <Label>Download button label</Label>
                  <Input
                    value={catalog.pdfLabel ?? ""}
                    onChange={(e) => updateCatalogField("pdfLabel", e.target.value)}
                    className="mt-1"
                    placeholder="Download Product Catalog"
                  />
                </div>
              </div>
            </AdminCard>
          )}

          {activeSlug === "private-label" && (
            <AdminCard>
              <h2 className="mb-4 font-display text-xl text-taupe">
                Specifications & download
              </h2>
              <p className="mb-4 font-body text-sm text-muted">
                Shown on the private label page as the specification download block.
                Save page after uploading the PDF.
              </p>
              <div className="space-y-4">
                <div>
                  <Label>Section title</Label>
                  <Input
                    value={specs.title ?? ""}
                    onChange={(e) => updateSpecsField("title", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={specs.description ?? ""}
                    onChange={(e) => updateSpecsField("description", e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>
                <PdfUploadField
                  label="Specification PDF"
                  value={specs.pdfUrl ?? ""}
                  onChange={(url) => updateSpecsField("pdfUrl", url)}
                  uploadFolder="pdfs/private-label"
                  hint="Download link on /private-label"
                />
                <div>
                  <Label>Download button label</Label>
                  <Input
                    value={specs.pdfLabel ?? ""}
                    onChange={(e) => updateSpecsField("pdfLabel", e.target.value)}
                    className="mt-1"
                    placeholder="Download specification sheet (PDF)"
                  />
                </div>
              </div>
            </AdminCard>
          )}

          <AdminCard>
            <h2 className="mb-4 font-display text-xl text-taupe">
              Sections (JSON)
            </h2>
            <Textarea
              value={JSON.stringify(active.sections, null, 2)}
              onChange={(e) => {
                try {
                  updateActive("sections", JSON.parse(e.target.value));
                } catch {
                  // ignore while typing
                }
              }}
              className="font-mono text-sm"
              rows={12}
            />
          </AdminCard>

          <AdminSaveButton saving={saving} onClick={handleSave} />
        </>
      )}
    </div>
  );
}
