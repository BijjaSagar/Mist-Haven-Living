"use client";

import { useEffect, useState } from "react";
import type { InquiryRecord } from "@/lib/data/inquiries";
import { buyerTypeOptions } from "@/lib/validations/inquiry";
import { Button } from "@/components/ui/button";
import {
  AdminCard,
  AdminMessage,
} from "@/components/admin/AdminShell";
import { cn } from "@/lib/utils";
import {
  Mail,
  MailX,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const buyerTypeLabels = Object.fromEntries(
  buyerTypeOptions.map((o) => [o.value, o.label]),
);

function formatDate(value: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function sourceLabel(source: string): string {
  switch (source) {
    case "contact":
      return "Contact page";
    case "home":
      return "Home page";
    case "catalog":
      return "Catalog download";
    default:
      return source;
  }
}

export function InquiriesEditor({ initial }: { initial: InquiryRecord[] }) {
  const [items, setItems] = useState(initial);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [emailStatus, setEmailStatus] = useState<{
    configured: boolean;
    hasResendKey: boolean;
    hasLeadsEmail: boolean;
    issues: { code: string; message: string }[];
  } | null>(null);

  useEffect(() => {
    fetch("/api/admin/inquiries/email-status")
      .then((r) => r.json())
      .then(setEmailStatus)
      .catch(() => null);
  }, []);

  async function toggleRead(id: string, read: boolean) {
    setMessage(null);
    const res = await fetch(`/api/admin/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read }),
    });

    if (!res.ok) {
      setMessage({ text: "Failed to update inquiry.", type: "error" });
      return;
    }

    const updated = (await res.json()) as InquiryRecord;
    setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
    setMessage({
      text: read ? "Marked as read." : "Marked as unread.",
      type: "success",
    });
  }

  const unreadCount = items.filter((i) => !i.readAt).length;

  return (
    <div className="space-y-6">
      <AdminMessage
        message={message?.text ?? null}
        type={message?.type ?? "success"}
      />

      {emailStatus && !emailStatus.configured && (
        <AdminCard className="border-amber-200 bg-amber-50">
          <h3 className="font-display text-lg text-taupe">Email notifications</h3>
          <p className="mt-2 font-body text-sm text-muted">
            Inquiries are saved to the database even when email is not configured.
            To receive email alerts:
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 font-body text-sm text-muted">
            {!emailStatus.hasResendKey && (
              <li>
                Set <code className="text-xs">RESEND_API_KEY</code> in server
                environment (hPanel)
              </li>
            )}
            {!emailStatus.hasLeadsEmail && (
              <li>
                Set <strong>Leads inbox email</strong> in Admin → Settings
              </li>
            )}
          </ul>
        </AdminCard>
      )}

      <AdminCard>
        <div className="mb-4 flex items-center justify-between">
          <p className="font-body text-sm text-muted">
            {items.length} submission{items.length === 1 ? "" : "s"}
            {unreadCount > 0 && (
              <span className="ml-2 rounded-full bg-sage/30 px-2 py-0.5 text-xs text-sage-deep">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>

        {items.length === 0 ? (
          <p className="py-8 text-center font-body text-sm text-muted">
            No inquiries yet. Submissions from the contact form will appear here.
          </p>
        ) : (
          <div className="divide-y divide-hairline">
            {items.map((inquiry) => {
              const expanded = expandedId === inquiry.id;
              const isUnread = !inquiry.readAt;

              return (
                <div key={inquiry.id} className="py-4">
                  <button
                    type="button"
                    className="flex w-full items-start gap-3 text-left"
                    onClick={() =>
                      setExpandedId(expanded ? null : inquiry.id)
                    }
                  >
                    <span className="mt-1 shrink-0">
                      {isUnread ? (
                        <Circle className="h-3 w-3 fill-sage-deep text-sage-deep" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-muted" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={cn(
                            "font-body text-sm",
                            isUnread ? "font-medium text-taupe" : "text-muted",
                          )}
                        >
                          {inquiry.company}
                        </span>
                        <span className="font-body text-xs text-muted">
                          {inquiry.name}
                        </span>
                        {inquiry.emailSent ? (
                          <span title="Email sent">
                            <Mail className="h-3.5 w-3.5 text-sage-deep" />
                          </span>
                        ) : (
                          <span title="Email not sent">
                            <MailX className="h-3.5 w-3.5 text-amber-600" />
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 truncate font-body text-xs text-muted">
                        {inquiry.productInterest === "catalog-download"
                          ? "Catalog download"
                          : inquiry.productInterest}{" "}
                        · {sourceLabel(inquiry.source)} ·{" "}
                        {formatDate(inquiry.createdAt)}
                      </p>
                    </div>
                    {expanded ? (
                      <ChevronUp className="h-4 w-4 shrink-0 text-muted" />
                    ) : (
                      <ChevronDown className="h-4 w-4 shrink-0 text-muted" />
                    )}
                  </button>

                  {expanded && (
                    <div className="ml-7 mt-4 space-y-4 border-l border-hairline pl-4">
                      <dl className="grid gap-3 sm:grid-cols-2">
                        <Detail label="Email" value={inquiry.email} />
                        <Detail label="Phone" value={inquiry.phone} />
                        <Detail label="Country" value={inquiry.country} />
                        <Detail
                          label="Buyer type"
                          value={
                            buyerTypeLabels[inquiry.buyerType] ??
                            inquiry.buyerType
                          }
                        />
                        <Detail
                          label="Estimated volume"
                          value={inquiry.estimatedVolume ?? "—"}
                        />
                        <Detail
                          label="Target market"
                          value={inquiry.targetMarket ?? "—"}
                        />
                        <Detail
                          label="Product interest"
                          value={
                            inquiry.productInterest === "catalog-download"
                              ? "Product Catalog Download"
                              : inquiry.productInterest
                          }
                        />
                        <Detail label="Source" value={sourceLabel(inquiry.source)} />
                        <Detail
                          label="Email notification"
                          value={
                            inquiry.emailSent
                              ? "Sent"
                              : inquiry.emailError ?? "Not sent"
                          }
                        />
                      </dl>
                      <div>
                        <p className="font-body text-xs uppercase tracking-wide text-muted">
                          Message
                        </p>
                        <p className="mt-1 whitespace-pre-wrap font-body text-sm text-taupe">
                          {inquiry.message}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {isUnread ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleRead(inquiry.id, true)}
                          >
                            Mark as read
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleRead(inquiry.id, false)}
                          >
                            Mark as unread
                          </Button>
                        )}
                        <Button size="sm" variant="outline" asChild>
                          <a href={`mailto:${inquiry.email}`}>Reply by email</a>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </AdminCard>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-body text-xs uppercase tracking-wide text-muted">
        {label}
      </dt>
      <dd className="mt-0.5 font-body text-sm text-taupe">{value}</dd>
    </div>
  );
}
