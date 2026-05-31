"use client";

import { useState } from "react";
import type { NavigationItemData } from "@/lib/types/cms";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AdminSaveButton,
  AdminMessage,
  AdminCard,
} from "@/components/admin/AdminShell";

const LOCATIONS = [
  { value: "header", label: "Header" },
  { value: "footer_company", label: "Footer — Company" },
  { value: "footer_export", label: "Footer — Export" },
];

export function NavigationEditor({
  initial,
}: {
  initial: NavigationItemData[];
}) {
  const [items, setItems] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  function updateItem(
    id: string,
    field: keyof NavigationItemData,
    value: string | number | boolean,
  ) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    const res = await fetch("/api/admin/navigation", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    setMessage(
      res.ok
        ? { text: "Navigation saved.", type: "success" }
        : { text: "Failed to save.", type: "error" },
    );
    setSaving(false);
  }

  async function addItem() {
    const res = await fetch("/api/admin/navigation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        label: "New Link",
        href: "/",
        type: "link",
        sortOrder: items.length,
        visible: true,
        location: "header",
      }),
    });
    if (res.ok) {
      const item = await res.json();
      setItems((prev) => [...prev, item]);
    }
  }

  async function deleteItem(id: string) {
    const res = await fetch(`/api/admin/navigation/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  }

  const grouped = LOCATIONS.map((loc) => ({
    ...loc,
    items: items.filter((i) => i.location === loc.value),
  }));

  return (
    <div className="space-y-6">
      <AdminMessage
        message={message?.text ?? null}
        type={message?.type ?? "success"}
      />

      {grouped.map((group) => (
        <AdminCard key={group.value}>
          <h2 className="mb-4 font-display text-xl text-taupe">
            {group.label}
          </h2>
          <div className="space-y-4">
            {group.items.map((item) => (
              <div
                key={item.id}
                className="grid gap-3 border-b border-hairline pb-4 md:grid-cols-12 md:items-end"
              >
                <div className="md:col-span-3">
                  <Label>Label</Label>
                  <Input
                    value={item.label}
                    onChange={(e) =>
                      updateItem(item.id, "label", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
                <div className="md:col-span-4">
                  <Label>Href</Label>
                  <Input
                    value={item.href}
                    onChange={(e) =>
                      updateItem(item.id, "href", e.target.value)
                    }
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
                <div className="md:col-span-2 flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    checked={item.visible}
                    onChange={(e) =>
                      updateItem(item.id, "visible", e.target.checked)
                    }
                    id={`vis-${item.id}`}
                  />
                  <Label htmlFor={`vis-${item.id}`}>Visible</Label>
                </div>
                <div className="md:col-span-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600"
                    onClick={() => deleteItem(item.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
      ))}

      <div className="flex gap-3">
        <Button variant="outline" onClick={addItem}>
          Add link
        </Button>
        <AdminSaveButton saving={saving} onClick={handleSave} />
      </div>
    </div>
  );
}
