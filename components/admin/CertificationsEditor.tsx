"use client";

import { useState } from "react";
import type { CertificationData } from "@/lib/types/cms";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  AdminSaveButton,
  AdminMessage,
  AdminCard,
} from "@/components/admin/AdminShell";

export function CertificationsEditor({
  initial,
}: {
  initial: CertificationData[];
}) {
  const [items, setItems] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  function updateItem(
    id: string,
    field: keyof CertificationData,
    value: string | number | boolean | null,
  ) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    const res = await fetch("/api/admin/certifications", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    setMessage(
      res.ok
        ? { text: "Certifications saved.", type: "success" }
        : { text: "Failed to save.", type: "error" },
    );
    setSaving(false);
  }

  async function addCert() {
    const res = await fetch("/api/admin/certifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "New Certification",
        code: null,
        description: "",
        pdfUrl: null,
        sortOrder: items.length,
        visible: true,
      }),
    });
    if (res.ok) {
      const cert = await res.json();
      setItems((prev) => [...prev, cert]);
    }
  }

  async function deleteCert(id: string) {
    if (id.startsWith("static-")) return;
    const res = await fetch(`/api/admin/certifications/${id}`, {
      method: "DELETE",
    });
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
      {items.map((item) => (
        <AdminCard key={item.id}>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Name</Label>
              <Input
                value={item.name}
                onChange={(e) => updateItem(item.id, "name", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Code / Ref</Label>
              <Input
                value={item.code ?? ""}
                onChange={(e) =>
                  updateItem(item.id, "code", e.target.value || null)
                }
                className="mt-1"
              />
            </div>
            <div className="md:col-span-2">
              <Label>Description</Label>
              <Textarea
                value={item.description}
                onChange={(e) =>
                  updateItem(item.id, "description", e.target.value)
                }
                className="mt-1"
                rows={2}
              />
            </div>
            <div>
              <Label>PDF URL</Label>
              <Input
                value={item.pdfUrl ?? ""}
                onChange={(e) =>
                  updateItem(item.id, "pdfUrl", e.target.value || null)
                }
                className="mt-1"
              />
            </div>
            <div className="flex items-end gap-3">
              <div>
                <Label>Order</Label>
                <Input
                  type="number"
                  value={item.sortOrder}
                  onChange={(e) =>
                    updateItem(item.id, "sortOrder", Number(e.target.value))
                  }
                  className="mt-1 w-24"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600"
                onClick={() => deleteCert(item.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        </AdminCard>
      ))}
      <div className="flex gap-3">
        <Button variant="outline" onClick={addCert}>
          Add certification
        </Button>
        <AdminSaveButton saving={saving} onClick={handleSave} />
      </div>
    </div>
  );
}
