"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Download, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { getApiErrorMessage } from "@/lib/api-response";
import {
  catalogLeadSchema,
  buyerTypeOptions,
  type CatalogLeadValues,
} from "@/lib/validations/inquiry";

type CatalogGateModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  catalogPdfUrl: string;
  catalogPdfLabel?: string;
};

export function CatalogGateModal({
  open,
  onOpenChange,
  catalogPdfUrl,
  catalogPdfLabel = "Download Product Catalog",
}: CatalogGateModalProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CatalogLeadValues>({
    resolver: zodResolver(catalogLeadSchema),
    defaultValues: { website: "" },
  });

  async function onSubmit(data: CatalogLeadValues) {
    setError(null);
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          company: data.company,
          buyerType: data.buyerType,
          country: "Other",
          phone: "N/A",
          productInterest: "catalog-download",
          estimatedVolume: "Catalog download request",
          targetMarket: "Not specified",
          message: `Product catalog download request. Buyer type: ${data.buyerType}.`,
          website: data.website,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(getApiErrorMessage(json));
      setUnlocked(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    }
  }

  function handleClose(nextOpen: boolean) {
    if (!nextOpen) {
      reset();
      setUnlocked(false);
      setError(null);
    }
    onOpenChange(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md border-hairline bg-pearl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-taupe">
            Get Product Catalog
          </DialogTitle>
          <DialogDescription className="font-body text-muted">
            Enter your details to download our full export product catalog (PDF).
          </DialogDescription>
        </DialogHeader>

        {unlocked ? (
          <div className="py-6 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-sage-deep" />
            <p className="mt-4 font-display text-lg text-taupe">
              Your catalog is ready
            </p>
            <Button asChild className="mt-6">
              <a
                href={catalogPdfUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="h-4 w-4" />
                {catalogPdfLabel}
              </a>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="catalog-name">Name *</Label>
              <Input id="catalog-name" {...register("name")} />
              {errors.name && (
                <p className="text-xs text-red-600">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="catalog-email">Email *</Label>
              <Input id="catalog-email" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="catalog-company">Company *</Label>
              <Input id="catalog-company" {...register("company")} />
              {errors.company && (
                <p className="text-xs text-red-600">{errors.company.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="catalog-buyerType">Buyer Type *</Label>
              <Select id="catalog-buyerType" {...register("buyerType")} defaultValue="">
                <option value="" disabled>
                  Select buyer type
                </option>
                {buyerTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
              {errors.buyerType && (
                <p className="text-xs text-red-600">{errors.buyerType.message}</p>
              )}
            </div>
            <input
              type="text"
              {...register("website")}
              tabIndex={-1}
              autoComplete="off"
              className="absolute -left-[9999px] h-0 w-0 opacity-0"
              aria-hidden="true"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Unlock Catalog Download"
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

type CatalogCTAProps = {
  className?: string;
  /** Use mockup-style btn-ghost instead of shadcn Button */
  appearance?: "button" | "ghost";
  catalogPdfUrl: string;
  catalogPdfLabel?: string;
};

export function CatalogCTA({
  className,
  appearance = "button",
  catalogPdfUrl,
  catalogPdfLabel,
}: CatalogCTAProps) {
  const [open, setOpen] = useState(false);

  if (!catalogPdfUrl) return null;

  return (
    <>
      {appearance === "ghost" ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn("btn-ghost", className)}
        >
          Get the Catalog
        </button>
      ) : (
        <Button variant="outline" onClick={() => setOpen(true)} className={className}>
          Get Product Catalog
        </Button>
      )}
      <CatalogGateModal
        open={open}
        onOpenChange={setOpen}
        catalogPdfUrl={catalogPdfUrl}
        catalogPdfLabel={catalogPdfLabel}
      />
    </>
  );
}
