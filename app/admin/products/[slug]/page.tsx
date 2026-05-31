import { notFound } from "next/navigation";
import Link from "next/link";
import { requireAdminPage } from "@/app/admin/layout";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { ProductEditor } from "@/components/admin/ProductEditor";
import { getCategoryBySlug } from "@/lib/data/products";

type PageProps = { params: Promise<{ slug: string }> };

export default async function AdminProductEditPage({ params }: PageProps) {
  await requireAdminPage();
  const { slug } = await params;
  const product = await getCategoryBySlug(slug);
  if (!product) notFound();

  return (
    <>
      <Link
        href="/admin/products"
        className="mb-4 inline-block font-body text-sm text-sage-deep hover:underline"
      >
        ← Back to products
      </Link>
      <AdminPageHeader title={product.name} description={`Edit ${slug}`} />
      <ProductEditor product={product} />
    </>
  );
}
