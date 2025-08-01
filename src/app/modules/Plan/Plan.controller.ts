import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import { planService } from './Plan.service';
import sendResponse from '../../../shared/sendResponse';


const createPlan = catchAsync(async (req, res) => {
  const result = await planService.createIntoDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Plan created successfully',
    data: result,
  });
});

const getPlanList = catchAsync(async (req, res) => {
  const result = await planService.getListFromDb();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Plan list retrieved successfully',
    data: result,
  });
});

const getPlanById = catchAsync(async (req, res) => {
  const result = await planService.getByIdFromDb(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Plan details retrieved successfully',
    data: result,
  });
});

const updatePlan = catchAsync(async (req, res) => {
  const result = await planService.updateIntoDb(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Plan updated successfully',
    data: result,
  });
});

const deletePlan = catchAsync(async (req, res) => {
  const result = await planService.deleteItemFromDb(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Plan deleted successfully',
    data: result,
  });
});

export const PlanController = {
  createPlan,
  getPlanList,
  getPlanById,
  updatePlan,
  deletePlan,
};