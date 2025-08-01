import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { PrivacyPolicyController } from './PrivacyPolicy.controller';
import { PrivacyPolicyValidation } from './PrivacyPolicy.validation';

const router = express.Router();

router.post(
'/',
auth(),
// validateRequest(PrivacyPolicyValidation.createSchema),
PrivacyPolicyController.createPrivacyPolicy,
);

router.get('/', auth(), PrivacyPolicyController.getPrivacyPolicyList);

router.get('/:id', auth(), PrivacyPolicyController.getPrivacyPolicyById);

router.put(
'/:id',
auth(),
validateRequest(PrivacyPolicyValidation.updateSchema),
PrivacyPolicyController.updatePrivacyPolicy,
);

router.delete('/:id', auth(), PrivacyPolicyController.deletePrivacyPolicy);

export const PrivacyPolicyRoutes = router;