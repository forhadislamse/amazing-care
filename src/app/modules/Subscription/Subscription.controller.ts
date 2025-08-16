import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import { subscriptionService } from './Subscription.service';
import sendResponse from '../../../shared/sendResponse';
import { Request, Response } from 'express';
import Stripe from 'stripe';
import ApiError from '../../../errors/ApiErrors';
import prisma from '../../../shared/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

const createSubscription = catchAsync(async (req, res) => {
  const result = await subscriptionService.createIntoDb(req.body, req.user);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Subscription created successfully',
    data: result,
  });
});

const confirmSubscriptionWithStripe = catchAsync(async (req, res) => {
  const result = await subscriptionService.confirmSubscriptionWithStripe(req.body, req.user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Stripe Checkout session created",
    data: result,
  });
});

const handlePaymentSuccess = async (req: Request, res: Response) => {
  const sessionId = req.query.session_id as string;

  if (!sessionId) throw new ApiError(httpStatus.BAD_REQUEST, "Session ID is required");

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (!session) throw new ApiError(httpStatus.NOT_FOUND, "Session not found");

  // ✅ Subscription update
  await prisma.subscription.updateMany({
    where: { userId: session.client_reference_id as string },
    data: { isTrial: false, isRenewed: true },
  });
  res.redirect(`${process.env.FRONTEND_URL}/subscription/payment-success`);
  res.json({
    success: true,
    message: "Payment successful",
    session,
  });
};


const stripeWebhook = catchAsync(async (req: Request, res: Response) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2024-06-20",
  });

  // const sig = req.headers["stripe-signature"] as string;
  let event: Stripe.Event;

  if (process.env.NODE_ENV === "development") {
    // লোকাল টেস্টের জন্য: signature verify বাদ
    event = req.body;
  } else {
    // প্রোডাকশন: signature verify করা হবে
    const sig = req.headers["stripe-signature"] as string;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  await subscriptionService.handleStripeWebhook(event);
  res.json({ received: true });
}});

const getSubscriptionList = catchAsync(async (req, res) => {
  const result = await subscriptionService.getListFromDb();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Subscription list retrieved successfully',
    data: result,
  });
});

const getSubscriptionById = catchAsync(async (req, res) => {
  const result = await subscriptionService.getByIdFromDb(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Subscription details retrieved successfully',
    data: result,
  });
});

const updateSubscription = catchAsync(async (req, res) => {
  const result = await subscriptionService.updateIntoDb(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Subscription updated successfully',
    data: result,
  });
});

const deleteSubscription = catchAsync(async (req, res) => {
  const result = await subscriptionService.deleteItemFromDb(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Subscription deleted successfully',
    data: result,
  });
});







export const SubscriptionController = {
  createSubscription,
  getSubscriptionList,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
  confirmSubscriptionWithStripe,
  stripeWebhook,
  handlePaymentSuccess
};