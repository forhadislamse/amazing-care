import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import { JwtPayload } from "jsonwebtoken";
import ApiError from "../../../errors/ApiErrors";
import { PlanType, SubscriptionType } from "@prisma/client";
import Stripe from "stripe";
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});


// const createIntoDb = async (data: { planId: string }, user: JwtPayload) => {
//   // const plan = await prisma.plan.findFirst({
//   const plan = await prisma.subscriptionPlan.findFirst({
//     where: { id: data.planId, isActive: true }, //isDeleted: false
//   });

//   if (!plan) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Plan not found');
//   }

//   const startDate = new Date();
//   const endDate = new Date();

//   // Determine endDate based on plan duration
//   if (plan.type === SubscriptionType.MONTHLY) {
//     endDate.setMonth(startDate.getMonth() + 1);
//   } else if (plan.type === SubscriptionType.YEARLY) {
//     endDate.setFullYear(startDate.getFullYear() + 1);
//   }
//   else {
//     // BASIC প্ল্যান default 1 মাস ধরে ধরা হলো
//     endDate.setMonth(endDate.getMonth() + 1);
//   }

//   // Prepare user update data
//   const userUpdateData: any = {
//     planType: plan.type,
//     isSubscribed: true,
//     scanCount: 0,
//   };

//   // // Set permissionScanCount based on plan type
//   // if (plan.type === PlanType.BASIC) {
//   //   userUpdateData.permissionScanCount = 5;
//   // } else if (
//   //   (plan.type === PlanType.PRO && plan.type === SubscriptionType.MONTHLY) ||
//   //   (plan.type === PlanType.PREMIUM && plan.type === SubscriptionType.YEARLY)
//   // ) {
//   //   userUpdateData.permissionScanCount = Number.MAX_SAFE_INTEGER; // unlimited
//   // }

  
// // Set permissionScanCount based on plan type
// if (plan.type === PlanType.BASIC) {
//   userUpdateData.permissionScanCount = 5;
// } else {
//   userUpdateData.permissionScanCount = Number.MAX_SAFE_INTEGER; // unlimited
// }

//   // Transaction to update user and create subscription
//   await prisma.$transaction([
//     prisma.user.update({
//       where: { id: user.id },
//       data: userUpdateData,
//     }),
//     prisma.subscription.create({
//       data: {
//         userId: user.id,
//         planId: plan.id,
//         startDate,
//         endDate,
//       },
//     }),
//   ]);
// };
// const createIntoDb = async (data: { planId: string }, user: JwtPayload) => {
//   const plan = await prisma.subscriptionPlan.findFirst({
//     where: { id: data.planId, isActive: true },
//   });

//   if (!plan) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Plan not found');
//   }

//   const startDate = new Date();
//   const endDate = new Date();

//   // trial days set from plan
//   if (plan.trialDays && plan.trialDays > 0) {
//     endDate.setDate(endDate.getDate() + plan.trialDays);
//   } else {
//     // যদি trial না থাকে তাহলে plan type অনুযায়ী সময় সেট করো
//     if (plan.type === SubscriptionType.MONTHLY) {
//       endDate.setMonth(startDate.getMonth() + 1);
//     } else if (plan.type === SubscriptionType.YEARLY) {
//       endDate.setFullYear(startDate.getFullYear() + 1);
//     } else {
//       endDate.setMonth(endDate.getMonth() + 1); // BASIC default 1 month
//     }
//   }


//   const userUpdateData: any = {
//     planType: plan.type,
//     isSubscribed: true,
//     scanCount: 0,
//   };


//   if (plan.type === PlanType.BASIC) {
//     userUpdateData.permissionScanCount = 5;
//   } else {
//     userUpdateData.permissionScanCount = Number.MAX_SAFE_INTEGER; // unlimited
//   }


//   await prisma.$transaction([
//     prisma.user.update({
//       where: { id: user.id },
//       data: userUpdateData,
//     }),
//     prisma.subscription.create({
//       data: {
//         userId: user.id,
//         planId: plan.id,
//         startDate,
//         endDate,
//         isTrial: plan.trialDays > 0, // trial থাকলে true
//         agreedToTerms: false,        // প্রথমে terms agree না
//         isRenewed: false,            // প্রথমে renewed false
//         paymentInfo: null            // payment info পরে আসবে
//       },
//     }),
//   ]);
// };
const createIntoDb = async (data: { planId: string }, user: JwtPayload) => {
  const plan = await prisma.subscriptionPlan.findFirst({
    where: { id: data.planId, isActive: true },
  });

  if (!plan) throw new ApiError(httpStatus.BAD_REQUEST, "Plan not found");

  const startDate = new Date();
  const endDate = new Date();

  // trial days
  if (plan.trialDays && plan.trialDays > 0) {
    endDate.setDate(endDate.getDate() + plan.trialDays);
  } else {
    if (plan.type === "MONTHLY") endDate.setMonth(startDate.getMonth() + 1);
    else if (plan.type === "YEARLY") endDate.setFullYear(startDate.getFullYear() + 1);
    else endDate.setMonth(endDate.getMonth() + 1);
  }

  const userUpdateData: any = {
    planType: plan.type,
    isSubscribed: true,
    scanCount: 0,
    permissionScanCount: plan.type === "BASIC" ? 5 : Number.MAX_SAFE_INTEGER,
  };

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
        isTrial: plan.trialDays > 0,
        agreedToTerms: false,
        isRenewed: false,
        paymentInfo: null,
      },
    }),
  ]);

  return await prisma.subscription.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
};

const confirmSubscriptionWithStripe = async (data: { planId: string }, user: JwtPayload) => {
  const plan = await prisma.subscriptionPlan.findUnique({ where: { id: data.planId } });
  if (!plan) throw new ApiError(httpStatus.NOT_FOUND, "Plan not found");

  let interval: "month" | "year";
  if (plan.type === "MONTHLY") interval = "month";
  else if (plan.type === "YEARLY") interval = "year";
  else throw new ApiError(httpStatus.BAD_REQUEST, "Invalid plan type");

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: plan.type, description: plan.description.join(", ") },
          unit_amount: Math.round(plan.price * 100),
          recurring: { interval },
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.FRONTEND_URL}/subscription/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
    customer_email: user.email,
    client_reference_id: user.id, // ✅ DB update এর জন্য
    
  });
  return { url: session.url };
};

// 3️⃣ Stripe Webhook
// const handleStripeWebhook = async (event: Stripe.Event) => {
//   switch (event.type) {
//     case "checkout.session.completed":
//       const session = event.data.object as Stripe.Checkout.Session;

//       // এখানে তুমি DB আপডেট করবে
//       await prisma.subscription.updateMany({
//         where: { userId: session.client_reference_id ?? "" },
//         data: { isTrial: false, isRenewed: true },
//       });

//       break;
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }
// };

const handleStripeWebhook = async (event: Stripe.Event) => {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (!session.client_reference_id) break;

      await prisma.subscription.updateMany({
        where: { userId: session.client_reference_id },
        data: { isTrial: false, isRenewed: true },
      });
      break;
    }

    case "invoice.paid": {
      // Event when the payment is successful (every subscription interval)
      console.log("Invoice paid");
      console.log(event.data);
      break;
    }

    case "invoice.payment_failed": {
      // Event when the payment failed due to card problems or insufficient funds
      console.log("Invoice payment failed!");
      console.log(event.data);
      break;
    }

    case "customer.subscription.updated": {
      // Event when subscription is updated
      console.log("Subscription updated!");
      console.log(event.data);
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }
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
  confirmSubscriptionWithStripe,
  handleStripeWebhook
};

