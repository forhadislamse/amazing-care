
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { PrivacyPolicyService } from './PrivacyPolicy.service';

const createPrivacyPolicy = catchAsync(async (req, res) => {
  const result = await PrivacyPolicyService.createIntoDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'PrivacyPolicy created successfully',
    data: result,
  });
});

const getPrivacyPolicyList = catchAsync(async (req, res) => {
  const result = await PrivacyPolicyService.getListFromDb();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'PrivacyPolicy list retrieved successfully',
    data: result,
  });
});

const getPrivacyPolicyById = catchAsync(async (req, res) => {
  const result = await PrivacyPolicyService.getByIdFromDb(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'PrivacyPolicy details retrieved successfully',
    data: result,
  });
});

const updatePrivacyPolicy = catchAsync(async (req, res) => {
  const result = await PrivacyPolicyService.updateIntoDb(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'PrivacyPolicy updated successfully',
    data: result,
  });
});

const deletePrivacyPolicy = catchAsync(async (req, res) => {
  const result = await PrivacyPolicyService.deleteItemFromDb(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'PrivacyPolicy deleted successfully',
    data: result,
  });
});

export const PrivacyPolicyController = {
  createPrivacyPolicy,
  getPrivacyPolicyList,
  getPrivacyPolicyById,
  updatePrivacyPolicy,
  deletePrivacyPolicy,
};