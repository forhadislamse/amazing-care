import httpStatus from 'http-status';
import { AssignmentsService } from './Assignments.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { Request, Response } from 'express';
import { IAssignments } from './Assignments.interface';

const createAssignments = catchAsync(async (req: Request, res: Response) => {
  const teacherId = req.user?.id;
    const userRole = req.user?.role;
    const courseId = req.params.id;
    const { title, documentUrl } = req.body;
  
    if (!teacherId) throw new Error("Unauthorized access.");
    if (userRole !== "TEACHER")
      throw new Error("Only teachers can create notes.");
  
    const assignmentsData: IAssignments = {
      title,
      documentUrl,
      teacherId,
      courseId,
    };
  
    const result = await AssignmentsService.createIntoDb(
      assignmentsData,
      teacherId,
      courseId
    );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Assignments created successfully',
    data: result,
  });
});

const getAssignmentsList = catchAsync(async (req, res) => {
  const result = await AssignmentsService.getListFromDb();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Assignments list retrieved successfully',
    data: result,
  });
});

const getAssignmentsById = catchAsync(async (req, res) => {
  const result = await AssignmentsService.getByIdFromDb(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Assignments details retrieved successfully',
    data: result,
  });
});

const updateAssignments = catchAsync(async (req, res) => {
  const result = await AssignmentsService.updateIntoDb(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Assignments updated successfully',
    data: result,
  });
});

const deleteAssignments = catchAsync(async (req, res) => {
  const result = await AssignmentsService.deleteItemFromDb(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Assignments deleted successfully',
    data: result,
  });
});

export const AssignmentsController = {
  createAssignments,
  getAssignmentsList,
  getAssignmentsById,
  updateAssignments,
  deleteAssignments,
};