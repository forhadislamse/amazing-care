import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { AssignmentsFeedbackController } from "./AssignmentsFeedback.controller";
import { AssignmentsFeedbackValidation } from "./AssignmentsFeedback.validation";

const router = express.Router();

router.post(
  "/:id",
  auth(),
  // validateRequest(AssignmentsFeedbackValidation.createSchema),
  AssignmentsFeedbackController.createAssignmentsFeedback
);

router.get(
  "/",
  auth(),
  AssignmentsFeedbackController.getAssignmentsFeedbackList
);

router.get(
  "/:id",
  auth(),
  AssignmentsFeedbackController.getAssignmentsFeedbackById
);

router.put(
  "/:id",
  auth(),
  validateRequest(AssignmentsFeedbackValidation.updateSchema),
  AssignmentsFeedbackController.updateAssignmentsFeedback
);

router.delete(
  "/:id",
  auth(),
  AssignmentsFeedbackController.deleteAssignmentsFeedback
);

export const AssignmentsFeedbackRoutes = router;
