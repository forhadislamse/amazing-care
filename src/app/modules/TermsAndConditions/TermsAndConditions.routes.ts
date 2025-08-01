import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { TermsAndConditionsController } from './TermsAndConditions.controller';
import { TermsAndConditionsValidation } from './TermsAndConditions.validation';

const router = express.Router();

router.post(
'/',
auth(),
validateRequest(TermsAndConditionsValidation.createSchema),
TermsAndConditionsController.createTermsAndConditions,
);

router.get('/', auth(), TermsAndConditionsController.getTermsAndConditionsList);

router.get('/:id', auth(), TermsAndConditionsController.getTermsAndConditionsById);

router.put(
'/:id',
auth(),
validateRequest(TermsAndConditionsValidation.updateSchema),
TermsAndConditionsController.updateTermsAndConditions,
);

router.delete('/:id', auth(), TermsAndConditionsController.deleteTermsAndConditions);

export const TermsAndConditionsRoutes = router;