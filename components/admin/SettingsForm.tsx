"use client";

import { useState } from "react";
import type { SiteSettingsData } from "@/lib/types/cms";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AdminSaveButton,
  AdminMessage,
  AdminCard,
} from "@/components/admin/AdminShell";

export function SettingsForm({ initial }: { initial: SiteSettingsData }) {
  const [data, setData] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  async function uploadLogo(file: File, field: "logoUrl" | "logoLightUrl") {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      const { url } = await res.json();
      setData((d) => ({ ...d, [field]: url }));
    }
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setMessage({ text: "Settings saved successfully.", type: "success" });
    } else {
      setMessage({ text: "Failed to save settings.", type: "error" });
    }
    setSaving(false);
  }

  const colorFields = [
    { key: "pearl" as const, label: "Pearl" },
    { key: "oat" as const, label: "Oat" },
    { key: "taupe" as const, label: "Taupe" },
    { key: "muted" as const, label: "Muted" },
    { key: "sage" as const, label: "Sage" },
    { key: "sageDeep" as const, label: "Sage Deep" },
    { key: "hairline" as const, label: "Hairline" },
  ];

  return (
    <div className="space-y-6">
      <AdminMessage
        message={message?.text ?? null}
        type={message?.type ?? "success"}
      />

      <AdminCard>
        <h2 className="mb-4 font-display text-xl text-taupe">Branding</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>Logo (default)</Label>
            <Input
              value={data.logoUrl}
              onChange={(e) => setData({ ...data, logoUrl: e.target.value })}
              className="mt-1"
            />
            <input
              type="file"
              accept="image/*"
              className="mt-2 font-body text-sm"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadLogo(f, "logoUrl");
              }}
            />
          </div>
          <div>
            <Label>Logo (light / footer)</Label>
            <Input
              value={data.logoLightUrl}
              onChange={(e) =>
                setData({ ...data, logoLightUrl: e.target.value })
              }
              className="mt-1"
            />
            <input
              type="file"
              accept="image/*"
              className="mt-2 font-body text-sm"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadLogo(f, "logoLightUrl");
              }}
            />
          </div>
          <div>
            <Label>Site name</Label>
            <Input
              value={data.siteName}
              onChange={(e) => setData({ ...data, siteName: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Legal name</Label>
            <Input
              value={data.legalName}
              onChange={(e) => setData({ ...data, legalName: e.target.value })}
              className="mt-1"
            />
          </div>
          <div className="md:col-span-2">
            <Label>Tagline</Label>
            <Input
              value={data.tagline}
              onChange={(e) => setData({ ...data, tagline: e.target.value })}
              className="mt-1"
            />
          </div>
        </div>
      </AdminCard>

      <AdminCard>
        <h2 className="mb-4 font-display text-xl text-taupe">Colors</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {colorFields.map(({ key, label }) => (
            <div key={key}>
              <Label>{label}</Label>
              <div className="mt-1 flex gap-2">
                <input
                  type="color"
                  value={data.colors[key]}
                  onChange={(e) =>
                    setData({
                      ...data,
                      colors: { ...data.colors, [key]: e.target.value },
                    })
                  }
                  className="h-10 w-12 cursor-pointer rounded border border-hairline"
                />
                <Input
                  value={data.colors[key]}
                  onChange={(e) =>
                    setData({
                      ...data,
                      colors: { ...data.colors, [key]: e.target.value },
                    })
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </AdminCard>

      <AdminCard>
        <h2 className="mb-4 font-display text-xl text-taupe">Contact</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>Email</Label>
            <Input
              value={data.contactEmail}
              onChange={(e) =>
                setData({ ...data, contactEmail: e.target.value })
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label>Phone</Label>
            <Input
              value={data.contactPhone}
              onChange={(e) =>
                setData({ ...data, contactPhone: e.target.value })
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label>WhatsApp</Label>
            <Input
              value={data.whatsappNumber ?? ""}
              onChange={(e) =>
                setData({ ...data, whatsappNumber: e.target.value || null })
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label>Calendly URL</Label>
            <Input
              value={data.calendlyUrl ?? ""}
              onChange={(e) =>
                setData({ ...data, calendlyUrl: e.target.value || null })
              }
              className="mt-1"
            />
          </div>
        </div>
      </AdminCard>

      <AdminCard>
        <h2 className="mb-4 font-display text-xl text-taupe">Footer & Address</h2>
        <div className="space-y-4">
          <div>
            <Label>Footer blurb</Label>
            <Textarea
              value={data.footerBlurb}
              onChange={(e) =>
                setData({ ...data, footerBlurb: e.target.value })
              }
              className="mt-1"
              rows={3}
            />
          </div>
          <div>
            <Label>Export markets</Label>
            <Input
              value={data.exportMarkets}
              onChange={(e) =>
                setData({ ...data, exportMarkets: e.target.value })
              }
              className="mt-1"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Street</Label>
              <Input
                value={data.address.street}
                onChange={(e) =>
                  setData({
                    ...data,
                    address: { ...data.address, street: e.target.value },
                  })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label>City</Label>
              <Input
                value={data.address.city}
                onChange={(e) =>
                  setData({
                    ...data,
                    address: { ...data.address, city: e.target.value },
                  })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label>Region</Label>
              <Input
                value={data.address.region}
                onChange={(e) =>
                  setData({
                    ...data,
                    address: { ...data.address, region: e.target.value },
                  })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label>Postal code</Label>
              <Input
                value={data.address.postalCode}
                onChange={(e) =>
                  setData({
                    ...data,
                    address: { ...data.address, postalCode: e.target.value },
                  })
                }
                className="mt-1"
              />
            </div>
          </div>
        </div>
      </AdminCard>

      <AdminSaveButton saving={saving} onClick={handleSave} />
    </div>
  );
}
