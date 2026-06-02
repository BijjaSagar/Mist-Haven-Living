"use client";

import { useState } from "react";
import type { FaqItem, HeroSlide, PageContentData } from "@/lib/types/cms";
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
import { HeroSlidesEditor } from "@/components/admin/HeroSlidesEditor";
import { FaqItemsEditor } from "@/components/admin/FaqItemsEditor";
import { getApiErrorMessage } from "@/lib/api-response";

const HERO_IMAGE_PAGES = new Set([
  "about",
  "manufacturing",
  "private-label",
  "faq",
  "contact",
  "products",
]);

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

  function getSection<T extends Record<string, unknown>>(key: string): T {
    return (active?.sections[key] ?? {}) as T;
  }

  function updateSection(key: string, patch: Record<string, unknown>) {
    const sections = {
      ...active.sections,
      [key]: { ...getSection(key), ...patch },
    };
    updateActive("sections", sections);
  }

  function updateHeroField(key: string, value: string) {
    updateSection("hero", { [key]: value });
  }

  function updateSectionImage(sectionKey: string, imageUrl: string) {
    updateSection(sectionKey, { imageUrl });
  }

  function updateTopLevelArray<T>(key: string, value: T[]) {
    updateActive("sections", { ...active.sections, [key]: value });
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
    const json = await res.json().catch(() => null);
    setMessage(
      res.ok
        ? { text: "Page saved.", type: "success" }
        : { text: getApiErrorMessage(json), type: "error" },
    );
    setSaving(false);
  }

  const hero = getSection<Record<string, unknown>>("hero");
  const heritage = getSection<Record<string, string>>("heritage");
  const intro = getSection<Record<string, string>>("intro");
  const manufacturing = getSection<Record<string, string>>("manufacturing");
  const facility = getSection<Record<string, string>>("facility");
  const packaging = getSection<Record<string, string>>("packaging");
  const specs = getSection<Record<string, string>>("specs");
  const catalog = getSection<Record<string, string>>("catalog");
  const heroSlides = (hero.slides as HeroSlide[] | undefined) ?? [];
  const faqItems = (active?.sections.faqItems ?? []) as FaqItem[];

  const showHeroText =
    activeSlug === "home" ||
    activeSlug === "about" ||
    HERO_IMAGE_PAGES.has(activeSlug);

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
              </div>
            </div>
          </AdminCard>

          {showHeroText && (
            <AdminCard>
              <h2 className="mb-4 font-display text-xl text-taupe">Hero</h2>
              <div className="space-y-4">
                <div>
                  <Label>Eyebrow</Label>
                  <Input
                    value={(hero.eyebrow as string) ?? ""}
                    onChange={(e) => updateHeroField("eyebrow", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Title</Label>
                  <Input
                    value={(hero.title as string) ?? ""}
                    onChange={(e) => updateHeroField("title", e.target.value)}
                    className="mt-1"
                  />
                </div>
                {(hero.subtitle !== undefined || activeSlug === "home") && (
                  <div>
                    <Label>Subtitle</Label>
                    <Textarea
                      value={(hero.subtitle as string) ?? ""}
                      onChange={(e) =>
                        updateHeroField("subtitle", e.target.value)
                      }
                      className="mt-1"
                      rows={2}
                    />
                  </div>
                )}
                {(hero.description !== undefined ||
                  HERO_IMAGE_PAGES.has(activeSlug)) && (
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={(hero.description as string) ?? ""}
                      onChange={(e) =>
                        updateHeroField("description", e.target.value)
                      }
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                )}
                {HERO_IMAGE_PAGES.has(activeSlug) && (
                  <ImageUploadField
                    label="Hero background image"
                    value={(hero.imageUrl as string) ?? ""}
                    onChange={(url) => updateSectionImage("hero", url)}
                    uploadFolder={`pages/${activeSlug}-hero`}
                    hint="Full-width hero background. Save page after upload."
                  />
                )}
              </div>
            </AdminCard>
          )}

          {activeSlug === "home" && (
            <>
              <AdminCard>
                <HeroSlidesEditor
                  slides={heroSlides}
                  onChange={(slides) => updateSection("hero", { slides })}
                />
              </AdminCard>
              <AdminCard>
                <h2 className="mb-4 font-display text-xl text-taupe">
                  Heritage block
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label>Eyebrow</Label>
                    <Input
                      value={heritage.eyebrow ?? ""}
                      onChange={(e) =>
                        updateSection("heritage", { eyebrow: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={heritage.title ?? ""}
                      onChange={(e) =>
                        updateSection("heritage", { title: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={heritage.description ?? ""}
                      onChange={(e) =>
                        updateSection("heritage", {
                          description: e.target.value,
                        })
                      }
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                  <ImageUploadField
                    label="Heritage image"
                    value={heritage.imageUrl ?? ""}
                    onChange={(url) => updateSectionImage("heritage", url)}
                    uploadFolder="pages/home-heritage"
                  />
                </div>
              </AdminCard>
              <AdminCard>
                <h2 className="mb-4 font-display text-xl text-taupe">
                  Manufacturing preview
                </h2>
                <ImageUploadField
                  label="Manufacturing section image"
                  value={manufacturing.imageUrl ?? ""}
                  onChange={(url) => updateSectionImage("manufacturing", url)}
                  uploadFolder="pages/home-manufacturing"
                  hint="Image in the homepage manufacturing block."
                />
              </AdminCard>
            </>
          )}

          {activeSlug === "about" && (
            <AdminCard>
              <h2 className="mb-4 font-display text-xl text-taupe">
                Intro section
              </h2>
              <div className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={intro.title ?? ""}
                    onChange={(e) =>
                      updateSection("intro", { title: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Body</Label>
                  <Textarea
                    value={intro.body ?? ""}
                    onChange={(e) =>
                      updateSection("intro", { body: e.target.value })
                    }
                    className="mt-1"
                    rows={4}
                  />
                </div>
                <ImageUploadField
                  label="Heritage / team image"
                  value={intro.imageUrl ?? ""}
                  onChange={(url) => updateSectionImage("intro", url)}
                  uploadFolder="pages/about-intro"
                />
              </div>
            </AdminCard>
          )}

          {activeSlug === "manufacturing" && (
            <AdminCard>
              <h2 className="mb-4 font-display text-xl text-taupe">
                Facility banner
              </h2>
              <ImageUploadField
                label="Wide facility image"
                value={facility.imageUrl ?? ""}
                onChange={(url) => updateSectionImage("facility", url)}
                uploadFolder="pages/manufacturing-facility"
                hint="Full-width banner below the hero."
              />
            </AdminCard>
          )}

          {activeSlug === "private-label" && (
            <>
              <AdminCard>
                <h2 className="mb-4 font-display text-xl text-taupe">
                  Packaging image
                </h2>
                <ImageUploadField
                  label="Private label packaging photo"
                  value={packaging.imageUrl ?? ""}
                  onChange={(url) => updateSectionImage("packaging", url)}
                  uploadFolder="pages/private-label-packaging"
                />
              </AdminCard>
              <AdminCard>
                <h2 className="mb-4 font-display text-xl text-taupe">
                  Specifications & download
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label>Section title</Label>
                    <Input
                      value={specs.title ?? ""}
                      onChange={(e) =>
                        updateSection("specs", { title: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={specs.description ?? ""}
                      onChange={(e) =>
                        updateSection("specs", { description: e.target.value })
                      }
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                  <PdfUploadField
                    label="Specification PDF"
                    value={specs.pdfUrl ?? ""}
                    onChange={(url) => updateSection("specs", { pdfUrl: url })}
                    uploadFolder="pdfs/private-label"
                  />
                  <div>
                    <Label>Download button label</Label>
                    <Input
                      value={specs.pdfLabel ?? ""}
                      onChange={(e) =>
                        updateSection("specs", { pdfLabel: e.target.value })
                      }
                      className="mt-1"
                      placeholder="Download specification sheet (PDF)"
                    />
                  </div>
                </div>
              </AdminCard>
            </>
          )}

          {activeSlug === "faq" && (
            <AdminCard>
              <FaqItemsEditor
                items={faqItems}
                onChange={(items) => updateTopLevelArray("faqItems", items)}
              />
            </AdminCard>
          )}

          {activeSlug === "contact" && (
            <AdminCard>
              <h2 className="mb-4 font-display text-xl text-taupe">
                Product catalog download
              </h2>
              <div className="space-y-4">
                <PdfUploadField
                  label="Product catalog PDF"
                  value={catalog.pdfUrl ?? ""}
                  onChange={(url) => updateSection("catalog", { pdfUrl: url })}
                  uploadFolder="pdfs/product-catalog"
                />
                <div>
                  <Label>Download button label</Label>
                  <Input
                    value={catalog.pdfLabel ?? ""}
                    onChange={(e) =>
                      updateSection("catalog", { pdfLabel: e.target.value })
                    }
                    className="mt-1"
                    placeholder="Download Product Catalog"
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
