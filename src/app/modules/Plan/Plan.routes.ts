import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { PlanController } from './Plan.controller';
import { PlanValidation } from './Plan.validation';

const router = express.Router();

router.post(
'/',
auth(),
// validateRequest(PlanValidation.createSchema),
PlanController.createPlan,
);

router.get('/', auth(), PlanController.getPlanList);

router.get('/:id', auth(), PlanController.getPlanById);

router.put(
'/:id',
auth(),
validateRequest(PlanValidation.updateSchema),
PlanController.updatePlan,
);

router.delete('/:id', auth(), PlanController.deletePlan);

export const PlanRoutes = router;