"use client";

import { useState } from "react";
import type { StatData } from "@/lib/types/cms";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AdminSaveButton,
  AdminMessage,
  AdminCard,
} from "@/components/admin/AdminShell";
import { getApiData, getApiErrorMessage } from "@/lib/api-response";

export function StatsEditor({ initial }: { initial: StatData[] }) {
  const [items, setItems] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  function updateItem(
    id: string,
    field: keyof StatData,
    value: string | number | boolean,
  ) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    const res = await fetch("/api/admin/stats", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    const json = await res.json().catch(() => null);
    setMessage(
      res.ok
        ? { text: "Stats saved.", type: "success" }
        : { text: getApiErrorMessage(json), type: "error" },
    );
    setSaving(false);
  }

  async function addStat() {
    const res = await fetch("/api/admin/stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        value: "0",
        label: "New stat",
        sortOrder: items.length,
        visible: true,
      }),
    });
    if (res.ok) {
      const json = await res.json();
      setItems((prev) => [...prev, getApiData<StatData>(json)]);
    }
  }

  async function deleteStat(id: string) {
    if (id.startsWith("static-")) return;
    const res = await fetch(`/api/admin/stats/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  }

  return (
    <div className="space-y-6">
      <AdminMessage
        message={message?.text ?? null}
        type={message?.type ?? "success"}
      />
      <AdminCard>
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="grid gap-3 border-b border-hairline pb-4 md:grid-cols-12 md:items-end"
            >
              <div className="md:col-span-3">
                <Label>Value</Label>
                <Input
                  value={item.value}
                  onChange={(e) => updateItem(item.id, "value", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="md:col-span-5">
                <Label>Label</Label>
                <Input
                  value={item.label}
                  onChange={(e) => updateItem(item.id, "label", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="md:col-span-2">
                <Label>Order</Label>
                <Input
                  type="number"
                  value={item.sortOrder}
                  onChange={(e) =>
                    updateItem(item.id, "sortOrder", Number(e.target.value))
                  }
                  className="mt-1"
                />
              </div>
              <div className="md:col-span-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600"
                  onClick={() => deleteStat(item.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </AdminCard>
      <div className="flex gap-3">
        <Button variant="outline" onClick={addStat}>
          Add stat
        </Button>
        <AdminSaveButton saving={saving} onClick={handleSave} />
      </div>
    </div>
  );
}
