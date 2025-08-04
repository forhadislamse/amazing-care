import httpStatus from 'http-status';
import { NotesService } from './Notes.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { Request, Response } from 'express';
import { INotes } from './Notes.interface';
import prisma from '../../../shared/prisma';

const createNotes = catchAsync(async (req: Request, res: Response) => {
  const teacherId = req.user?.id;
  const userRole = req.user?.role;
  const courseId = req.params.id;
  const { title, documentUrl } = req.body;

  if (!teacherId) throw new Error("Unauthorized access.");
  if (userRole !== "TEACHER")
    throw new Error("Only teachers can create notes.");

  const noteData: INotes = {
    title,
    documentUrl,
    teacherId,
    courseId,
  };

  const result = await NotesService.createIntoDb(
    noteData,
    teacherId,
    courseId
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Notes created successfully",
    data: result,
  });
});

const getNotesList = catchAsync(async (req: Request, res: Response) => {
  const result = await NotesService.getListFromDb();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notes list retrieved successfully',
    data: result,
  });
});

const getNotesById = catchAsync(async (req: Request, res: Response) => {
  const result = await NotesService.getByIdFromDb(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notes details retrieved successfully',
    data: result,
  });
});

const updateNotes = catchAsync(async (req: Request, res: Response) => {
  const result = await NotesService.updateIntoDb(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notes updated successfully',
    data: result,
  });
});

const deleteNotes = catchAsync(async (req: Request, res: Response) => {
  const result = await NotesService.deleteItemFromDb(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notes deleted successfully',
    data: result,
  });
});

export const NotesController = {
  createNotes,
  getNotesList,
  getNotesById,
  updateNotes,
  deleteNotes,
};