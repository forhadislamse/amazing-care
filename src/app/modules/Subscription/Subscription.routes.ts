import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { SubscriptionController } from './Subscription.controller';
import { SubscriptionValidation } from './Subscription.validation';


const router = express.Router();

router.post(
'/',
auth(),
// validateRequest(SubscriptionValidation.createSchema),
SubscriptionController.createSubscription,
);

router.post("/confirm-stripe", auth(), SubscriptionController.confirmSubscriptionWithStripe);
router.get('/payment-success', SubscriptionController.handlePaymentSuccess);

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  SubscriptionController.stripeWebhook
);

router.get('/', auth(), SubscriptionController.getSubscriptionList);

router.get('/:id', auth(), SubscriptionController.getSubscriptionById);

router.put(
'/:id',
auth(),
validateRequest(SubscriptionValidation.updateSchema),
SubscriptionController.updateSubscription,
);

router.delete('/:id', auth(), SubscriptionController.deleteSubscription);

export const SubscriptionRoutes = router;