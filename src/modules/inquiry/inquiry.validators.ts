import { z } from "zod";
import {
  InquiryRequestStatus,
  InquiryRequestType,
} from "./inquiry.types.js";

// ============================ objectIdSchema ============================
const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/);

// ============================ inquiryIdSchema ============================
const inquiryIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "validation.invalidInquiryId");

// ============================ inquiryPhoneSchema ============================
const inquiryPhoneSchema = z.string().min(8).max(20).trim();

// ============================ adminResponseSchema ============================
const adminResponseSchema = z
  .object({
    paymentMethod: z.string().max(500).trim().optional(),
    deliveryEstimate: z.string().max(500).trim().optional(),
    productPrice: z.number().nonnegative().optional(),
    shippingPrice: z.number().nonnegative().optional(),
    totalPrice: z.number().nonnegative().optional(),
  })
  .strict()
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "inquiry.fieldsRequired",
  });

// ============================ createInquirySchema ============================
export const createInquirySchema = z
  .object({
    customerName: z.string().min(2).max(100).trim().optional(),
    phone: z.array(inquiryPhoneSchema).min(1).max(5),
    email: z.email("validation.emailInvalid").toLowerCase().trim().optional(),
    productId: objectIdSchema,
    quantity: z.number().int().positive(),
    requestType: z
      .enum(Object.values(InquiryRequestType))
      .default(InquiryRequestType.purchaseRequest),
    locationLink: z.url().max(500).trim().optional(),
    locationDescription: z.string().max(1000).trim().optional(),
    message: z.string().min(5).max(3000).trim().optional(),
  })
  .strict();

// ============================ createInquiryWithResponseSchema ============================
export const createInquiryWithResponseSchema = z
  .object({
    userId: objectIdSchema,
    productId: objectIdSchema,
    quantity: z.number().int().positive(),
    requestType: z
      .enum(Object.values(InquiryRequestType))
      .default(InquiryRequestType.purchaseRequest),
    message: z.string().min(5).max(3000).trim().optional(),
    adminResponse: adminResponseSchema,
    adminNotes: z.string().max(3000).trim().optional(),
  })
  .strict();

// ============================ updateInquirySchema ============================
export const updateInquirySchema = z
  .object({
    requestStatus: z.enum(Object.values(InquiryRequestStatus)).optional(),
    adminResponse: adminResponseSchema.nullable().optional(),
    adminNotes: z.string().max(3000).trim().nullable().optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "inquiry.fieldsRequired",
  });

// ============================ inquiryIdParamSchema ============================
export const inquiryIdParamSchema = z.object({
  id: inquiryIdSchema,
});

// ============================ listInquiriesQuerySchema ============================
export const listInquiriesQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).optional(),
  limit: z.string().regex(/^\d+$/).optional(),
  search: z.string().trim().max(100).optional(),
  sort: z
    .enum([
      "created_at_asc",
      "created_at_desc",
      "updated_at_asc",
      "updated_at_desc",
      "newest",
      "oldest",
      "name_asc",
      "name_desc",
    ])
    .optional(),
  requestStatus: z.enum(Object.values(InquiryRequestStatus)).optional(),
  requestType: z.enum(Object.values(InquiryRequestType)).optional(),
  productId: objectIdSchema.optional(),
});

export type CreateInquiryDTO = z.infer<typeof createInquirySchema>;
export type CreateInquiryWithResponseDTO = z.infer<
  typeof createInquiryWithResponseSchema
>;
export type UpdateInquiryDTO = z.infer<typeof updateInquirySchema>;
export type ListInquiriesQueryDTO = z.infer<typeof listInquiriesQuerySchema>;
