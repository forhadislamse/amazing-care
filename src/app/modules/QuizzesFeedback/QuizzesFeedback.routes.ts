import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { QuizzesFeedbackController } from "./QuizzesFeedback.controller";
import { QuizzesFeedbackValidation } from "./QuizzesFeedback.validation";

const router = express.Router();

router.post(
  "/:id",
  auth(),
  // validateRequest(QuizzesFeedbackValidation.createSchema),
  QuizzesFeedbackController.createQuizzesFeedback
);

router.get("/", auth(), QuizzesFeedbackController.getQuizzesFeedbackList);

router.get("/:id", auth(), QuizzesFeedbackController.getQuizzesFeedbackById);

router.put(
  "/:id",
  auth(),
  validateRequest(QuizzesFeedbackValidation.updateSchema),
  QuizzesFeedbackController.updateQuizzesFeedback
);

router.delete("/:id", auth(), QuizzesFeedbackController.deleteQuizzesFeedback);

export const QuizzesFeedbackRoutes = router;
