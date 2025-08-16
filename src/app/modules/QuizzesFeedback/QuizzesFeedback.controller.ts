import httpStatus from "http-status";

import { QuizzesFeedbackService } from "./QuizzesFeedback.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { IQuizzesFeedback } from "./QuizzesFeedBack.interface";

const createQuizzesFeedback = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const courseId = req.params.id;
    const { title, documentUrl } = req.body;

    if (!userId) throw new Error("Unauthorized access.");
    if (userRole !== "STUDENT")
      throw new Error("Only students can give quiz feedback.");

    const quizzesFeedbackData: IQuizzesFeedback = {
      title,
      documentUrl,
      userId,
      courseId,
    };

    const result = await QuizzesFeedbackService.createIntoDb(
      quizzesFeedbackData,
      userId,
      courseId
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "QuizzesFeedback created successfully",
      data: result,
    });
  }
);

const getQuizzesFeedbackList = catchAsync(
  async (req: Request, res: Response) => {
    const result = await QuizzesFeedbackService.getListFromDb();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "QuizzesFeedback list retrieved successfully",
      data: result,
    });
  }
);

const getQuizzesFeedbackById = catchAsync(
  async (req: Request, res: Response) => {
    const result = await QuizzesFeedbackService.getByIdFromDb(req.params.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "QuizzesFeedback details retrieved successfully",
      data: result,
    });
  }
);

const updateQuizzesFeedback = catchAsync(
  async (req: Request, res: Response) => {
    const result = await QuizzesFeedbackService.updateIntoDb(
      req.params.id,
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "QuizzesFeedback updated successfully",
      data: result,
    });
  }
);

const deleteQuizzesFeedback = catchAsync(
  async (req: Request, res: Response) => {
    const result = await QuizzesFeedbackService.deleteItemFromDb(req.params.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "QuizzesFeedback deleted successfully",
      data: result,
    });
  }
);

export const QuizzesFeedbackController = {
  createQuizzesFeedback,
  getQuizzesFeedbackList,
  getQuizzesFeedbackById,
  updateQuizzesFeedback,
  deleteQuizzesFeedback,
};
