import { prisma, isDbConfigured } from "@/lib/db";
import { companyStats as staticStats } from "@/data/products";
import type { StatData } from "@/lib/types/cms";

export async function getStats(): Promise<{ value: string; label: string }[]> {
  if (!isDbConfigured()) return staticStats;
  try {
    const rows = await prisma.stat.findMany({
      where: { visible: true },
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length === 0) return staticStats;
    return rows.map((r) => ({ value: r.value, label: r.label }));
  } catch {
    return staticStats;
  }
}

export async function getAllStatsAdmin(): Promise<StatData[]> {
  if (!isDbConfigured()) {
    return staticStats.map((s, i) => ({
      id: `static-${i}`,
      value: s.value,
      label: s.label,
      sortOrder: i,
      visible: true,
    }));
  }
  try {
    const rows = await prisma.stat.findMany({ orderBy: { sortOrder: "asc" } });
    return rows;
  } catch {
    return staticStats.map((s, i) => ({
      id: `static-${i}`,
      value: s.value,
      label: s.label,
      sortOrder: i,
      visible: true,
    }));
  }
}
