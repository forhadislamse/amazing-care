
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { TermsAndConditionsService } from './TermsAndConditions.service';
import { Request, Response } from 'express';

const createTermsAndConditions = catchAsync(async (req: Request, res: Response) => {
  const result = await TermsAndConditionsService.createIntoDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'TermsAndConditions created successfully',
    data: result,
  });
});

const getTermsAndConditionsList = catchAsync(async (req, res) => {
  const result = await TermsAndConditionsService.getListFromDb();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'TermsAndConditions list retrieved successfully',
    data: result,
  });
});

const getTermsAndConditionsById = catchAsync(async (req, res) => {
  const result = await TermsAndConditionsService.getByIdFromDb(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'TermsAndConditions details retrieved successfully',
    data: result,
  });
});

const updateTermsAndConditions = catchAsync(async (req, res) => {
  const result = await TermsAndConditionsService.updateIntoDb(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'TermsAndConditions updated successfully',
    data: result,
  });
});

const deleteTermsAndConditions = catchAsync(async (req, res) => {
  const result = await TermsAndConditionsService.deleteItemFromDb(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'TermsAndConditions deleted successfully',
    data: result,
  });
});

export const TermsAndConditionsController = {
  createTermsAndConditions,
  getTermsAndConditionsList,
  getTermsAndConditionsById,
  updateTermsAndConditions,
  deleteTermsAndConditions,
};