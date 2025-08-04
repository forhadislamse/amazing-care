import httpStatus from "http-status";
import { QuizzesService } from "./Quizzes.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { IQuizzes } from "./Quizzes.interface";

const createQuizzes = catchAsync(async (req: Request, res: Response) => {
  const teacherId = req.user?.id;
  const userRole = req.user?.role;
  const courseId = req.params.id;
  const { title, documentUrl } = req.body;

  if (!teacherId) throw new Error("Unauthorized access.");
  if (userRole !== "TEACHER")
    throw new Error("Only teachers can create notes.");

  const quizzesData: IQuizzes = {
    title,
    documentUrl,
    teacherId,
    courseId,
  };

  const result = await QuizzesService.createIntoDb(
    quizzesData,
    teacherId,
    courseId
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Quizzes created successfully",
    data: result,
  });
});

const getQuizzesList = catchAsync(async (req: Request, res: Response) => {
  const result = await QuizzesService.getListFromDb();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Quizzes list retrieved successfully",
    data: result,
  });
});

const getQuizzesById = catchAsync(async (req: Request, res: Response) => {
  const result = await QuizzesService.getByIdFromDb(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Quizzes details retrieved successfully",
    data: result,
  });
});

const updateQuizzes = catchAsync(async (req: Request, res: Response) => {
  const result = await QuizzesService.updateIntoDb(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Quizzes updated successfully",
    data: result,
  });
});

const deleteQuizzes = catchAsync(async (req: Request, res: Response) => {
  const result = await QuizzesService.deleteItemFromDb(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Quizzes deleted successfully",
    data: result,
  });
});

export const QuizzesController = {
  createQuizzes,
  getQuizzesList,
  getQuizzesById,
  updateQuizzes,
  deleteQuizzes,
};
