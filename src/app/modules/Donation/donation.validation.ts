
import { z } from "zod";

// IDonation validation schema
export const createDonationSchema = z.object({
  userId: z.string().nonempty("User ID is required"),
  amount: z.number().positive("Amount must be positive"),
  currency: z.string().optional().default("USD"),
  paymentId: z.string().nullable().optional(),

});

// IUpdateDonation validation schema (all fields optional)
const updateDonationSchema = z.object({
  amount: z.number().positive().optional(),
  currency: z.string().optional(),
  paymentId: z.string().nullable().optional(),
});

export const DonationValidation = {
  createDonationSchema,
  updateDonationSchema,
};
