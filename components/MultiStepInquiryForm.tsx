"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  inquirySchema,
  buyerTypeOptions,
  type InquiryFormValues,
} from "@/lib/validations/inquiry";
import { productInterestOptions as staticOptions } from "@/data/products";
import { cn } from "@/lib/utils";
import { InquiryUnavailable } from "@/components/InquiryUnavailable";

type MultiStepInquiryFormProps = {
  prefilledProduct?: string;
  variant?: "light" | "dark";
  className?: string;
  productInterestOptions?: { value: string; label: string }[];
  inquiryEnabled?: boolean;
};

export function MultiStepInquiryForm({
  prefilledProduct,
  variant = "light",
  className,
  productInterestOptions = staticOptions,
  inquiryEnabled = true,
}: MultiStepInquiryFormProps) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
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
  const labelClass = isDark ? "text-pearl/70" : undefined;
  const inputClass = isDark
    ? "border-pearl/20 bg-pearl/10 text-pearl placeholder:text-pearl/40"
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
      if (json.warning) {
        console.warn("Inquiry submitted with warning:", json.warning);
      }
      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    }
  }

  async function nextStep() {
    const valid = await trigger(["buyerType", "estimatedVolume", "targetMarket"]);
    if (valid) setStep(2);
  }

  if (!inquiryEnabled) {
    return <InquiryUnavailable className={className} variant={variant} />;
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
      onSubmit={handleSubmit(onSubmit)}
      className={cn("space-y-5", className)}
      noValidate
    >
      <div className="flex gap-2">
        {[1, 2].map((s) => (
          <div
            key={s}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              step >= s
                ? isDark
                  ? "bg-sage"
                  : "bg-sage-deep"
                : isDark
                  ? "bg-pearl/20"
                  : "bg-hairline",
            )}
          />
        ))}
      </div>

      {step === 1 && (
        <>
          <p
            className={cn(
              "font-body text-xs uppercase tracking-[0.22em]",
              isDark ? "text-sage" : "text-sage-deep",
            )}
          >
            Step 1 — Your Business
          </p>
          <div className="space-y-2">
            <Label htmlFor="buyerType" className={labelClass}>
              Buyer Type *
            </Label>
            <Select
              id="buyerType"
              {...register("buyerType")}
              className={inputClass}
              defaultValue=""
            >
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
              <p className={`text-xs ${errorClass}`}>{errors.buyerType.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="estimatedVolume" className={labelClass}>
              Estimated Volume *
            </Label>
            <Input
              id="estimatedVolume"
              {...register("estimatedVolume")}
              className={inputClass}
              placeholder="e.g. 5,000 bath towels / quarter"
            />
            {errors.estimatedVolume && (
              <p className={`text-xs ${errorClass}`}>
                {errors.estimatedVolume.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetMarket" className={labelClass}>
              Target Market *
            </Label>
            <Input
              id="targetMarket"
              {...register("targetMarket")}
              className={inputClass}
              placeholder="e.g. USA hospitality, Canada retail"
            />
            {errors.targetMarket && (
              <p className={`text-xs ${errorClass}`}>
                {errors.targetMarket.message}
              </p>
            )}
          </div>
          <Button type="button" onClick={nextStep} className="w-full sm:w-auto">
            Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {step === 2 && (
        <>
          <p
            className={cn(
              "font-body text-xs uppercase tracking-[0.22em]",
              isDark ? "text-sage" : "text-sage-deep",
            )}
          >
            Step 2 — Contact & Details
          </p>
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
              placeholder="Specifications, timeline, destination port..."
            />
            {errors.message && (
              <p className={`text-xs ${errorClass}`}>{errors.message.message}</p>
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

          {submitError && (
            <p className={`text-sm ${errorClass}`}>{submitError}</p>
          )}

          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(1)}
              className={isDark ? "border-pearl/30 text-pearl hover:bg-pearl/10" : undefined}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Submit Inquiry"
              )}
            </Button>
          </div>
        </>
      )}
    </form>
  );
}
