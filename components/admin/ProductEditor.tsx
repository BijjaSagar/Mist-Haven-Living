"use client";

import { useState } from "react";
import Link from "next/link";
import type { ProductCategoryData } from "@/lib/types/cms";
import {
  AdminCard,
  AdminMessage,
  AdminSaveButton,
} from "@/components/admin/AdminShell";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { ProductGalleryField } from "@/components/admin/ProductGalleryField";
import { getApiErrorMessage, getApiData } from "@/lib/api-response";
import { resolveProductCardImage } from "@/lib/image-props";

const productUploadFolder = (slug: string) => `products/${slug}`;

export function ProductsList({ products }: { products: ProductCategoryData[] }) {
  if (products.length === 0) {
    return (
      <AdminCard>
        <p className="font-body text-sm text-muted">
          No product categories yet. Seed data or add categories via the database.
        </p>
      </AdminCard>
    );
  }

  return (
    <AdminCard className="p-0">
      <ul className="divide-y divide-hairline">
        {products.map((product) => (
          <li key={product.slug}>
            <Link
              href={`/admin/products/${product.slug}`}
              className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-oat/50"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-base text-taupe">
                  {product.name}
                </p>
                <p className="truncate font-body text-xs text-muted">
                  {product.slug}
                </p>
              </div>
              <span className="shrink-0 font-body text-sm text-sage-deep">
                Edit →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </AdminCard>
  );
}

export function ProductEditor({ product }: { product: ProductCategoryData }) {
  const [data, setData] = useState({
    ...product,
    galleryImages: product.galleryImages ?? [],
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const folder = productUploadFolder(product.slug);
  const listingCardPreview = resolveProductCardImage({
    cardImage: data.cardImage,
    heroImage: data.heroImage,
    galleryImages: data.galleryImages,
  });

  console.log("[ProductEditor] listing card preview", {
    slug: product.slug,
    listingCardPreview,
    cardImage: data.cardImage,
    galleryCount: data.galleryImages.length,
  });

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    const res = await fetch(`/api/admin/products/${product.slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const body = await res.json().catch(() => null);
    if (res.ok) {
      const saved = getApiData<ProductCategoryData>(body);
      if (saved) {
        console.log("[ProductEditor] saved product", {
          slug: saved.slug,
          cardImage: saved.cardImage,
          updatedAt: saved.updatedAt,
        });
        setData({
          ...saved,
          galleryImages: saved.galleryImages ?? [],
        });
      }
      setMessage({ text: "Product saved.", type: "success" });
    } else {
      setMessage({
        text: getApiErrorMessage(body),
        type: "error",
      });
    }
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
      <AdminMessage
        message={message?.text ?? null}
        type={message?.type ?? "success"}
      />

      <AdminCard>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Name" value={data.name} onChange={(v) => setData({ ...data, name: v })} />
          <Field label="Eyebrow" value={data.eyebrow} onChange={(v) => setData({ ...data, eyebrow: v })} />
          <Field label="GSM Range" value={data.gsmRange} onChange={(v) => setData({ ...data, gsmRange: v })} />
          <Field label="MOQ" value={data.moq} onChange={(v) => setData({ ...data, moq: v })} />
          <Field label="Lead Time" value={data.leadTime} onChange={(v) => setData({ ...data, leadTime: v })} />
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <ImageUploadField
            label="Hero image"
            value={data.heroImage}
            onChange={(heroImage) => setData({ ...data, heroImage })}
            uploadFolder={folder}
            hint="Product detail hero. Save after upload."
          />
          <ImageUploadField
            label="Card image (listing thumbnail)"
            value={data.cardImage}
            onChange={(cardImage) => setData({ ...data, cardImage })}
            uploadFolder={folder}
            hint="Shown on /products and homepage Product Portfolio. Optional if hero or gallery has uploads — those are used automatically on save."
          />
        </div>
        <p className="mt-3 font-body text-xs text-muted">
          Listing preview uses:{" "}
          <span className="font-mono text-taupe">{listingCardPreview}</span>
          {listingCardPreview !== data.cardImage ? (
            <span className="ml-1 text-sage-deep">
              (from hero/gallery until you upload a dedicated card image)
            </span>
          ) : null}
        </p>
        <div className="mt-4">
          <ProductGalleryField
            images={data.galleryImages}
            onChange={(galleryImages) => setData({ ...data, galleryImages })}
            productSlug={product.slug}
          />
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
        <h2 className="mb-4 font-display text-xl text-taupe">SEO</h2>
        <div className="space-y-4">
          <Field
            label="Meta title"
            value={data.metaTitle ?? ""}
            onChange={(v) => setData({ ...data, metaTitle: v || null })}
            placeholder={data.name}
          />
          <div>
            <label className="font-body text-sm text-taupe">Meta description</label>
            <textarea
              className="mt-1 w-full rounded-md border border-hairline px-3 py-2 font-body text-sm"
              rows={2}
              value={data.metaDescription ?? ""}
              onChange={(e) =>
                setData({ ...data, metaDescription: e.target.value || null })
              }
              placeholder={data.shortDescription}
            />
            <p className="mt-1 font-body text-xs text-muted">
              Focus phrases for your reference (not shown to Google as keywords
              tag). Leave blank to use short description.
            </p>
          </div>
        </div>
      </AdminCard>

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

      <AdminSaveButton saving={saving} onClick={handleSave} label="Save product" />
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="font-body text-sm text-taupe">{label}</label>
      <input
        className="mt-1 w-full rounded-md border border-hairline px-3 py-2 font-body text-sm"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
