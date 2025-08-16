import { DonationType, RecurringInterval, PaymentStatus } from "@prisma/client";

export interface IDonation {
  userId: string;
  amount: number;
  currency?: string; // default "USD"
  type: DonationType;
  recurringInterval?: RecurringInterval | null;
  paymentId?: string | null;
  status?: PaymentStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUpdateDonation {
  amount?: number;
  currency?: string;
  type?: DonationType;
  recurringInterval?: RecurringInterval | null;
//   status?: PaymentStatus;
//   paymentId?: string | null;
}

export type IDonationFilterRequest = {
  userId?: string;
  type?: DonationType;
  recurringInterval?: RecurringInterval;
  currency?: string;
  amount?: number;
//   status?: PaymentStatus;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};



