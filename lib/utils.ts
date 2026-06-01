import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const siteConfig = {
  name: "Mist & Haven Living",
  legalName: "Mist & Haven Living",
  tagline: "Luxury In Every Thread.",
  description:
    "Premium B2B textile manufacturing for hospitality, retail, and private label buyers across the USA and Canada.",
  url: "https://mistandhaven.com",
  email: "kalash@mistandhaven.com",
  emailSecondary: "abhiraj@mistandhaven.com",
  leadsEmail: "export@mistandhaven.com",
  phone: "+91-7420-902500",
  address: {
    street: "Industrial Area, MIDC",
    city: "Solapur",
    region: "Maharashtra",
    country: "India",
    postalCode: "413001",
  },
  exportMarkets: ["United States", "Canada"],
} as const;
