import { prisma } from "@/lib/db";
import type { Inquiry } from "@prisma/client";

export type InquiryRecord = Inquiry;

export async function createInquiry(data: {
  name: string;
  company: string;
  country: string;
  email: string;
  phone: string;
  productInterest: string;
  message: string;
  buyerType: string;
  estimatedVolume?: string | null;
  targetMarket?: string | null;
  source?: string;
}): Promise<InquiryRecord> {
  return prisma.inquiry.create({
    data: {
      name: data.name,
      company: data.company,
      country: data.country,
      email: data.email,
      phone: data.phone,
      productInterest: data.productInterest,
      message: data.message,
      buyerType: data.buyerType,
      estimatedVolume: data.estimatedVolume ?? null,
      targetMarket: data.targetMarket ?? null,
      source: data.source ?? "web",
    },
  });
}

export async function markInquiryEmailResult(
  id: string,
  emailSent: boolean,
  emailError?: string | null,
): Promise<void> {
  await prisma.inquiry.update({
    where: { id },
    data: {
      emailSent,
      emailError: emailError ?? null,
    },
  });
}

export async function getAllInquiriesAdmin(): Promise<InquiryRecord[]> {
  return prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getInquiryById(id: string): Promise<InquiryRecord | null> {
  return prisma.inquiry.findUnique({ where: { id } });
}

export async function markInquiryRead(id: string): Promise<InquiryRecord> {
  return prisma.inquiry.update({
    where: { id },
    data: { readAt: new Date() },
  });
}

export async function markInquiryUnread(id: string): Promise<InquiryRecord> {
  return prisma.inquiry.update({
    where: { id },
    data: { readAt: null },
  });
}
