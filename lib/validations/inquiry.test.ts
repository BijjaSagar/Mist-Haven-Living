import { describe, expect, it } from "vitest";
import { inquirySchema } from "./inquiry";

const validInquiry = {
  name: "Jane Buyer",
  company: "Acme Hotels",
  country: "US" as const,
  email: "jane@acme.example",
  phone: "+1 555 0100",
  productInterest: "Bath linens",
  message: "We need a catalog for Q4 rollout.",
  buyerType: "hospitality" as const,
  estimatedVolume: "5000 units/year",
  targetMarket: "US West Coast",
};

describe("inquirySchema", () => {
  it("accepts a valid B2B inquiry", () => {
    expect(inquirySchema.safeParse(validInquiry).success).toBe(true);
  });

  it("rejects honeypot website field", () => {
    const result = inquirySchema.safeParse({
      ...validInquiry,
      website: "https://spam.example",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short message", () => {
    const result = inquirySchema.safeParse({
      ...validInquiry,
      message: "Hi",
    });
    expect(result.success).toBe(false);
  });
});
