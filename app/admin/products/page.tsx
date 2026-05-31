import Link from "next/link";
import { requireAdminPage } from "@/app/admin/layout";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { ProductsList } from "@/components/admin/ProductEditor";
import { getAllProductCategoriesAdmin } from "@/lib/data/products";

export default async function AdminProductsPage() {
  await requireAdminPage();
  const products = await getAllProductCategoriesAdmin();

  return (
    <>
      <AdminPageHeader
        title="Products"
        description={`Manage all ${products.length} product categories.`}
      />
      <ProductsList products={products} />
    </>
  );
}
