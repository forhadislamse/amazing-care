import httpStatus from "http-status";
import { AssignmentsFeedbackService } from "./AssignmentsFeedback.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { IAssignmentsFeedback } from "./AssignmentsFeedback.interface";

const createAssignmentsFeedback = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const courseId = req.params.id;
    const { title, documentUrl } = req.body;

    if (!userId) throw new Error("Unauthorized access.");
    if (userRole !== "STUDENT")
      throw new Error("Only students can create notes.");

    const assignmentsFeedbackData: IAssignmentsFeedback = {
      title,
      documentUrl,
      userId,
      courseId,
    };

    const result = await AssignmentsFeedbackService.createIntoDb(
      assignmentsFeedbackData,
      userId,
      courseId
    );
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "AssignmentsFeedback created successfully",
      data: result,
    });
  }
);

const getAssignmentsFeedbackList = catchAsync(async (req, res) => {
  const result = await AssignmentsFeedbackService.getListFromDb();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "AssignmentsFeedback list retrieved successfully",
    data: result,
  });
});

const getAssignmentsFeedbackById = catchAsync(async (req, res) => {
  const result = await AssignmentsFeedbackService.getByIdFromDb(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "AssignmentsFeedback details retrieved successfully",
    data: result,
  });
});

const updateAssignmentsFeedback = catchAsync(async (req, res) => {
  const result = await AssignmentsFeedbackService.updateIntoDb(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "AssignmentsFeedback updated successfully",
    data: result,
  });
});

const deleteAssignmentsFeedback = catchAsync(async (req, res) => {
  const result = await AssignmentsFeedbackService.deleteItemFromDb(
    req.params.id
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "AssignmentsFeedback deleted successfully",
    data: result,
  });
});

export const AssignmentsFeedbackController = {
  createAssignmentsFeedback,
  getAssignmentsFeedbackList,
  getAssignmentsFeedbackById,
  updateAssignmentsFeedback,
  deleteAssignmentsFeedback,
};
