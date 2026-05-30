"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  inquirySchema,
  type InquiryFormValues,
} from "@/lib/validations/inquiry";
import { productInterestOptions } from "@/data/products";
import { cn } from "@/lib/utils";

type InquiryFormProps = {
  prefilledProduct?: string;
  variant?: "light" | "dark";
  className?: string;
};

export function InquiryForm({
  prefilledProduct,
  variant = "light",
  className,
}: InquiryFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      productInterest: prefilledProduct ?? "",
      country: undefined,
      website: "",
    },
  });

  const isDark = variant === "dark";
  const labelClass = isDark ? "text-white/70" : undefined;
  const inputClass = isDark
    ? "border-white/20 bg-white/10 text-white placeholder:text-white/40"
    : undefined;
  const errorClass = isDark ? "text-red-300" : "text-red-600";

  async function onSubmit(data: InquiryFormValues) {
    setSubmitError(null);
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error ?? "Submission failed");
      }
      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    }
  }

  if (submitted) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center py-12 text-center",
          className,
        )}
      >
        <CheckCircle2
          className={cn("h-12 w-12", isDark ? "text-sage" : "text-sage-deep")}
        />
        <p
          className={cn(
            "mt-4 font-display text-xl",
            isDark ? "text-pearl" : "text-taupe",
          )}
        >
          Thank you — our export team will respond within 1 business day
        </p>
      </div>
    );
  }

  return (
    <form
      id="inquiry"
      onSubmit={handleSubmit(onSubmit)}
      className={cn("space-y-5", className)}
      noValidate
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name" className={labelClass}>
            Name *
          </Label>
          <Input
            id="name"
            {...register("name")}
            className={inputClass}
            aria-invalid={!!errors.name}
          />
          {errors.name && (
            <p className={`text-xs ${errorClass}`}>{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="company" className={labelClass}>
            Company *
          </Label>
          <Input
            id="company"
            {...register("company")}
            className={inputClass}
            aria-invalid={!!errors.company}
          />
          {errors.company && (
            <p className={`text-xs ${errorClass}`}>{errors.company.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="country" className={labelClass}>
            Country *
          </Label>
          <Select
            id="country"
            {...register("country")}
            className={inputClass}
            defaultValue=""
            aria-invalid={!!errors.country}
          >
            <option value="" disabled>
              Select country
            </option>
            <option value="US">United States</option>
            <option value="Canada">Canada</option>
            <option value="Other">Other</option>
          </Select>
          {errors.country && (
            <p className={`text-xs ${errorClass}`}>{errors.country.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="productInterest" className={labelClass}>
            Product Interest *
          </Label>
          <Select
            id="productInterest"
            {...register("productInterest")}
            className={inputClass}
            aria-invalid={!!errors.productInterest}
          >
            <option value="" disabled>
              Select product
            </option>
            {productInterestOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
          {errors.productInterest && (
            <p className={`text-xs ${errorClass}`}>
              {errors.productInterest.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email" className={labelClass}>
            Email *
          </Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            className={inputClass}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className={`text-xs ${errorClass}`}>{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" className={labelClass}>
            Phone *
          </Label>
          <Input
            id="phone"
            type="tel"
            {...register("phone")}
            className={inputClass}
            aria-invalid={!!errors.phone}
          />
          {errors.phone && (
            <p className={`text-xs ${errorClass}`}>{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className={labelClass}>
          Message *
        </Label>
        <Textarea
          id="message"
          rows={4}
          {...register("message")}
          className={inputClass}
          placeholder="Tell us about quantities, specifications, timeline, and destination port..."
          aria-invalid={!!errors.message}
        />
        {errors.message && (
          <p className={`text-xs ${errorClass}`}>{errors.message.message}</p>
        )}
      </div>

      {/* Honeypot */}
      <input
        type="text"
        {...register("website")}
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      {submitError && (
        <p className={`text-sm ${errorClass}`}>{submitError}</p>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        variant="default"
        className="w-full sm:w-auto"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Submit Inquiry"
        )}
      </Button>
    </form>
  );
}
