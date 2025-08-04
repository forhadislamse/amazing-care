import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { NotesController } from "./Notes.controller";
import { NotesValidation } from "./Notes.validation";

const router = express.Router();

router.post(
  "/:id",
  auth(),
  // validateRequest(NotesValidation.createSchema),
  NotesController.createNotes
);

router.get("/", auth(), NotesController.getNotesList);

router.get("/:id", auth(), NotesController.getNotesById);

router.put(
  "/:id",
  auth(),
  validateRequest(NotesValidation.updateSchema),
  NotesController.updateNotes
);

router.delete("/:id", auth(), NotesController.deleteNotes);

export const NotesRoutes = router;
