import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import { JwtPayload } from "jsonwebtoken";
import ApiError from "../../../errors/ApiErrors";
import { PlanType, SubscriptionType } from "@prisma/client";

// const createIntoDb = async (data: any, user: JwtPayload) => {
//   const isExistPlan = await prisma.plan.findFirst({
//     where: { id: data.planId },
//   });
//   if (!isExistPlan) {
//     throw new ApiError(httpStatus.BAD_REQUEST, "Plan not found");
//   }
//   let startDate = new Date();
//   let endDate = new Date();

//   if (isExistPlan.type === PlanType.BASIC) {
//     await prisma.user.update({
//       where: { id: user.id },
//       data: {
//         permissionScanCount: 5,
//         scanCount: 0,
//         planType: PlanType.BASIC,
//       },
//     });

//     endDate.setMonth(startDate.getMonth() + 1);
//   }
//   if (isExistPlan.type == PlanType.PRO) {
//     await prisma.user.update({
//       where: { id: user.id },
//       data: {
//         permissionScanCount: 500000000000,
//         planType: PlanType.PRO,
//       },
//     });

//     if (isExistPlan.time === SubscriptionType.MONTHLY) {
//       endDate.setMonth(startDate.getMonth() + 1);
//     } else if (isExistPlan.time === SubscriptionType.YEARLY) {
//       endDate.setFullYear(startDate.getFullYear() + 1000);
//     }
//   }
//   await prisma.subscription.create({
//     data: { userId: user.id, planId: data.planId, startDate, endDate },
//   });
//   await prisma.user.update({
//     where: { id: user.id },
//     data: { isSubscribed: true },
//   });
// };


const createIntoDb = async (data: { planId: string }, user: JwtPayload) => {
  const plan = await prisma.plan.findFirst({
    where: { id: data.planId, isDeleted: false },
  });

  if (!plan) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Plan not found');
  }

  const startDate = new Date();
  const endDate = new Date();

  // Determine endDate based on plan duration
  if (plan.time === SubscriptionType.MONTHLY) {
    endDate.setMonth(startDate.getMonth() + 1);
  } else if (plan.time === SubscriptionType.YEARLY) {
    endDate.setFullYear(startDate.getFullYear() + 1);
  }

  // Prepare user update data
  const userUpdateData: any = {
    planType: plan.type,
    isSubscribed: true,
    scanCount: 0,
  };

  // Set permissionScanCount based on plan type
  if (plan.type === PlanType.BASIC) {
    userUpdateData.permissionScanCount = 5;
  } else if (
    (plan.type === PlanType.PRO && plan.time === SubscriptionType.MONTHLY) ||
    (plan.type === PlanType.PREMIUM && plan.time === SubscriptionType.YEARLY)
  ) {
    userUpdateData.permissionScanCount = Number.MAX_SAFE_INTEGER; // unlimited
  }

  // Transaction to update user and create subscription
  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: userUpdateData,
    }),
    prisma.subscription.create({
      data: {
        userId: user.id,
        planId: plan.id,
        startDate,
        endDate,
      },
    }),
  ]);
};

const getListFromDb = async () => {
  const result = await prisma.subscription.findMany();
  return result;
};

const getByIdFromDb = async (id: string) => {
  const result = await prisma.subscription.findUnique({ where: { id } });
  if (!result) {
    throw new Error("subscription not found");
  }
  return result;
};

const updateIntoDb = async (id: string, data: any) => {
  const transaction = await prisma.$transaction(async (prisma) => {
    const result = await prisma.subscription.update({
      where: { id },
      data,
    });
    return result;
  });

  return transaction;
};

const deleteItemFromDb = async (id: string) => {
  const transaction = await prisma.$transaction(async (prisma) => {
    const deletedItem = await prisma.subscription.delete({
      where: { id },
    });

    // Add any additional logic if necessary, e.g., cascading deletes
    return deletedItem;
  });

  return transaction;
};
export const subscriptionService = {
  createIntoDb,
  getListFromDb,
  getByIdFromDb,
  updateIntoDb,
  deleteItemFromDb,
};

