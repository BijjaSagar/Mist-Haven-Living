"use client";

import { useEffect, useState } from "react";
import type { SiteSettingsData } from "@/lib/types/cms";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AdminSaveButton,
  AdminMessage,
  AdminCard,
} from "@/components/admin/AdminShell";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { getApiData, getApiErrorMessage } from "@/lib/api-response";

export function SettingsForm({ initial }: { initial: SiteSettingsData }) {
  const [data, setData] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [emailStatus, setEmailStatus] = useState<{
    hasResendKey: boolean;
    hasLeadsEmail: boolean;
    configured: boolean;
  } | null>(null);

  useEffect(() => {
    fetch("/api/admin/inquiries/email-status")
      .then((r) => r.json())
      .then((json) => setEmailStatus(getApiData(json)))
      .catch(() => null);
  }, []);

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
      const body = await res.json().catch(() => null);
      setMessage({
        text: getApiErrorMessage(body),
        type: "error",
      });
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
          <ImageUploadField
            label="Logo (default)"
            value={data.logoUrl}
            onChange={(logoUrl) => setData({ ...data, logoUrl })}
            hint="Used in header on light backgrounds. Save settings after upload."
          />
          <ImageUploadField
            label="Logo (light / footer)"
            value={data.logoLightUrl}
            onChange={(logoLightUrl) => setData({ ...data, logoLightUrl })}
            hint="Used on dark footer. Save settings after upload."
          />
          <ImageUploadField
            label="Favicon"
            value={data.faviconUrl ?? ""}
            onChange={(faviconUrl) =>
              setData({ ...data, faviconUrl: faviconUrl || null })
            }
            hint="Optional .ico or PNG. Save settings after upload."
          />
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
            <Label>Public contact email (primary)</Label>
            <Input
              type="email"
              value={data.contactEmail}
              onChange={(e) =>
                setData({ ...data, contactEmail: e.target.value })
              }
              className="mt-1"
            />
            <p className="mt-1 font-body text-xs text-muted">
              Shown on the contact page, footer, and home inquiry section.
            </p>
          </div>
          <div>
            <Label>Public contact email (secondary)</Label>
            <Input
              type="email"
              value={data.contactEmailSecondary ?? ""}
              onChange={(e) =>
                setData({
                  ...data,
                  contactEmailSecondary: e.target.value.trim() || null,
                })
              }
              className="mt-1"
            />
            <p className="mt-1 font-body text-xs text-muted">
              Optional second address shown alongside the primary contact email.
            </p>
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
              type="url"
              value={data.calendlyUrl ?? ""}
              onChange={(e) =>
                setData({ ...data, calendlyUrl: e.target.value || null })
              }
              className="mt-1"
            />
            <p className="mt-1 font-body text-xs text-muted">
              Embeds on the contact page. Leave empty to show a link to the inquiry
              form instead.
            </p>
          </div>
        </div>
      </AdminCard>

      <AdminCard>
        <h2 className="mb-4 font-display text-xl text-taupe">
          Request Quote / inquiries
        </h2>
        <p className="mb-4 font-body text-sm text-muted">
          Configure where B2B leads and catalog downloads are sent. All
          submissions are saved under Admin → Inquiries even if email fails. The
          Resend API key must stay in server environment variables (
          <code className="text-xs">RESEND_API_KEY</code>) — never commit it to the
          database.
        </p>
        {emailStatus && (
          <div
            className={`mb-4 rounded-md px-4 py-3 font-body text-sm ${
              emailStatus.configured
                ? "bg-sage/20 text-sage-deep"
                : "bg-amber-50 text-amber-900"
            }`}
          >
            {emailStatus.configured ? (
              <p>Email notifications are configured and ready.</p>
            ) : (
              <ul className="list-inside list-disc space-y-1">
                {!emailStatus.hasResendKey && (
                  <li>
                    Add <code className="text-xs">RESEND_API_KEY</code> in hPanel
                    environment variables
                  </li>
                )}
                {!emailStatus.hasLeadsEmail && (
                  <li>Set the leads inbox email below (required for notifications)</li>
                )}
              </ul>
            )}
          </div>
        )}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="flex cursor-pointer items-center gap-2 font-body text-sm text-taupe">
              <input
                type="checkbox"
                checked={data.inquiryEnabled}
                onChange={(e) =>
                  setData({ ...data, inquiryEnabled: e.target.checked })
                }
                className="h-4 w-4 rounded border-hairline"
              />
              Enable inquiry &amp; catalog forms
            </label>
          </div>
          <div>
            <Label>Leads inbox email</Label>
            <Input
              type="email"
              value={data.leadsToEmail ?? ""}
              onChange={(e) =>
                setData({
                  ...data,
                  leadsToEmail: e.target.value.trim() || null,
                })
              }
              className="mt-1"
              placeholder={data.leadsToEmail ?? "export@mistandhaven.com"}
            />
            <p className="mt-1 font-body text-xs text-muted">
              Destination for Request Quote submissions. Separate from public contact
              emails. Falls back to <code className="text-xs">LEADS_TO_EMAIL</code> env
              if empty.
            </p>
          </div>
          <div>
            <Label>Resend &quot;from&quot; address</Label>
            <Input
              value={data.resendFromEmail ?? ""}
              onChange={(e) =>
                setData({
                  ...data,
                  resendFromEmail: e.target.value.trim() || null,
                })
              }
              className="mt-1"
              placeholder="Mist & Haven <noreply@yourdomain.com>"
            />
            <p className="mt-1 font-body text-xs text-muted">
              Must use a domain verified in Resend. Defaults to onboarding address
              or <code className="text-xs">RESEND_FROM_EMAIL</code> env.
            </p>
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
