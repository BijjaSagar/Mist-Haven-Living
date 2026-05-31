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
    const sections = { ...active.sections, hero: { ...(active.sections.hero as Record<string, string>), [key]: value } };
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
