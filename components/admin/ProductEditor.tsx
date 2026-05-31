"use client";

import { useState } from "react";
import Link from "next/link";
import type { ProductCategoryData } from "@/lib/types/cms";
import { AdminCard } from "@/components/admin/AdminShell";

export function ProductsList({ products }: { products: ProductCategoryData[] }) {
  return (
    <AdminCard>
      <div className="divide-y divide-hairline">
        {products.map((product) => (
          <Link
            key={product.slug}
            href={`/admin/products/${product.slug}`}
            className="flex items-center justify-between py-4 transition-colors hover:bg-oat/50"
          >
            <div>
              <p className="font-display text-lg text-taupe">{product.name}</p>
              <p className="font-body text-sm text-muted">{product.slug}</p>
            </div>
            <span className="font-body text-sm text-sage-deep">Edit →</span>
          </Link>
        ))}
      </div>
    </AdminCard>
  );
}

export function ProductEditor({ product }: { product: ProductCategoryData }) {
  const [data, setData] = useState(product);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    const res = await fetch(`/api/admin/products/${product.slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setMessage(res.ok ? "Product saved." : "Failed to save.");
    setSaving(false);
  }

  function setArrayField(
    field: keyof Pick<
      ProductCategoryData,
      "features" | "materials" | "customization" | "packaging" | "idealFor"
    >,
    value: string,
  ) {
    setData({
      ...data,
      [field]: value.split("\n").filter((l) => l.trim()),
    });
  }

  return (
    <div className="space-y-6">
      {message && (
        <p className="rounded-md bg-sage/20 px-4 py-2 font-body text-sm text-sage-deep">
          {message}
        </p>
      )}

      <AdminCard>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Name" value={data.name} onChange={(v) => setData({ ...data, name: v })} />
          <Field label="Eyebrow" value={data.eyebrow} onChange={(v) => setData({ ...data, eyebrow: v })} />
          <Field label="GSM Range" value={data.gsmRange} onChange={(v) => setData({ ...data, gsmRange: v })} />
          <Field label="MOQ" value={data.moq} onChange={(v) => setData({ ...data, moq: v })} />
          <Field label="Lead Time" value={data.leadTime} onChange={(v) => setData({ ...data, leadTime: v })} />
          <Field label="Hero Image URL" value={data.heroImage} onChange={(v) => setData({ ...data, heroImage: v })} />
          <Field label="Card Image URL" value={data.cardImage} onChange={(v) => setData({ ...data, cardImage: v })} />
        </div>
        <div className="mt-4">
          <label className="font-body text-sm text-taupe">Short description</label>
          <textarea
            className="mt-1 w-full rounded-md border border-hairline px-3 py-2 font-body text-sm"
            rows={2}
            value={data.shortDescription}
            onChange={(e) => setData({ ...data, shortDescription: e.target.value })}
          />
        </div>
        <div className="mt-4">
          <label className="font-body text-sm text-taupe">Description</label>
          <textarea
            className="mt-1 w-full rounded-md border border-hairline px-3 py-2 font-body text-sm"
            rows={4}
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
          />
        </div>
      </AdminCard>

      {(["features", "materials", "customization", "packaging", "idealFor"] as const).map(
        (field) => (
          <AdminCard key={field}>
            <label className="font-display text-lg capitalize text-taupe">
              {field.replace(/([A-Z])/g, " $1")}
            </label>
            <textarea
              className="mt-2 w-full rounded-md border border-hairline px-3 py-2 font-body text-sm"
              rows={4}
              value={data[field].join("\n")}
              onChange={(e) => setArrayField(field, e.target.value)}
              placeholder="One item per line"
            />
          </AdminCard>
        ),
      )}

      <AdminCard>
        <label className="font-display text-lg text-taupe">Sizes (JSON)</label>
        <textarea
          className="mt-2 w-full rounded-md border border-hairline px-3 py-2 font-mono text-sm"
          rows={6}
          value={JSON.stringify(data.sizes, null, 2)}
          onChange={(e) => {
            try {
              setData({ ...data, sizes: JSON.parse(e.target.value) });
            } catch {
              // ignore invalid JSON while typing
            }
          }}
        />
      </AdminCard>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="rounded-md bg-taupe px-6 py-2 font-body text-sm text-pearl disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save product"}
      </button>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="font-body text-sm text-taupe">{label}</label>
      <input
        className="mt-1 w-full rounded-md border border-hairline px-3 py-2 font-body text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
