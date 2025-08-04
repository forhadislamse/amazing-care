import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { QuizzesController } from "./Quizzes.controller";
import { QuizzesValidation } from "./Quizzes.validation";

const router = express.Router();

router.post(
  "/:id",
  auth(),
  // validateRequest(QuizzesValidation.createSchema),
  QuizzesController.createQuizzes
);

router.get("/", auth(), QuizzesController.getQuizzesList);

router.get("/:id", auth(), QuizzesController.getQuizzesById);

router.put(
  "/:id",
  auth(),
  validateRequest(QuizzesValidation.updateSchema),
  QuizzesController.updateQuizzes
);

router.delete("/:id", auth(), QuizzesController.deleteQuizzes);

export const QuizzesRoutes = router;
