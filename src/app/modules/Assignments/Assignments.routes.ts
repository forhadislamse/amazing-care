import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { AssignmentsController } from "./Assignments.controller";
import { AssignmentsValidation } from "./Assignments.validation";

const router = express.Router();

router.post(
  "/:id",
  auth(),
  // validateRequest(AssignmentsValidation.createSchema),
  AssignmentsController.createAssignments
);

router.get("/", auth(), AssignmentsController.getAssignmentsList);

router.get("/:id", auth(), AssignmentsController.getAssignmentsById);

router.put(
  "/:id",
  auth(),
  validateRequest(AssignmentsValidation.updateSchema),
  AssignmentsController.updateAssignments
);

router.delete("/:id", auth(), AssignmentsController.deleteAssignments);

export const AssignmentsRoutes = router;
