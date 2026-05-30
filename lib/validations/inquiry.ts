import { z } from "zod";

export const buyerTypeOptions = [
  { value: "hospitality", label: "Hospitality & Hotels" },
  { value: "retailer", label: "Retailer or Brand" },
  { value: "distributor", label: "Distributor or Wholesaler" },
  { value: "importer", label: "Importer" },
  { value: "other", label: "Other" },
] as const;

export const inquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  company: z.string().min(2, "Company name is required"),
  country: z.enum(["US", "Canada", "Other"], {
    message: "Please select a country",
  }),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  productInterest: z.string().min(1, "Please select a product interest"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  buyerType: z.enum(
    ["hospitality", "retailer", "distributor", "importer", "other"],
    { message: "Please select buyer type" },
  ),
  estimatedVolume: z.string().min(1, "Estimated volume is required"),
  targetMarket: z.string().min(1, "Target market is required"),
  website: z.string().max(0, "Invalid submission").optional(),
});

export const catalogLeadSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  company: z.string().min(2, "Company name is required"),
  buyerType: z.enum([
    "hospitality",
    "retailer",
    "distributor",
    "importer",
    "other",
  ], { message: "Please select buyer type" }),
  website: z.string().max(0, "Invalid submission").optional(),
});

export type InquiryFormValues = z.infer<typeof inquirySchema>;
export type CatalogLeadValues = z.infer<typeof catalogLeadSchema>;
