"use client";

import { MessageCircle } from "lucide-react";

export function WhatsAppButton({ number }: { number?: string | null }) {
  if (!number) return null;

  const cleanNumber = number.replace(/\D/g, "");
  const href = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
    "Hello, I'm interested in Mist & Haven Living textile products for export to USA/Canada.",
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-hairline bg-oat text-taupe shadow-lg transition-transform hover:scale-105 hover:bg-sage/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-6 w-6 text-sage-deep" />
    </a>
  );
}
