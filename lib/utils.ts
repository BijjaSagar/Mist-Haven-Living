import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const siteConfig = {
  name: "Mist & Haven Living",
  legalName: "Deepam Textiles",
  tagline: "Luxury In Every Thread.",
  description:
    "Premium B2B textile manufacturing for hospitality, retail, and private label buyers across the USA and Canada.",
  url: "https://mistandhaven.com",
  email: "export@mistandhaven.com",
  phone: "+91 98765 43210",
  address: {
    street: "Industrial Area, MIDC",
    city: "Solapur",
    region: "Maharashtra",
    country: "India",
    postalCode: "413001",
  },
  exportMarkets: ["United States", "Canada"],
} as const;
