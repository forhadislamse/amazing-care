import express from 'express';
import auth from '../../middlewares/auth';
import { DonationValidation } from './donation.validation';
import validateRequest from '../../middlewares/validateRequest';
import { DonationController } from './donation.controller';

const router = express.Router();

router.post(
  '/',
  auth(),
  validateRequest(DonationValidation.createDonationSchema),
  DonationController.createDonation
);

router.get(
  '/',
  auth(),
  DonationController.getAllDonations
);

router.get(
  '/:id',
  auth(),
  DonationController.getSingleDonation
);

router.patch(
  '/:id',
  auth(),
  validateRequest(DonationValidation.updateDonationSchema),
  DonationController.updateDonation
);

router.delete(
  '/:id',
  auth(),
  DonationController.deleteDonation
);



export const DonationRoutes = router;