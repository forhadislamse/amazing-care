import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import { subscriptionService } from './Subscription.service';
import sendResponse from '../../../shared/sendResponse';


const createSubscription = catchAsync(async (req, res) => {
  const result = await subscriptionService.createIntoDb(req.body, req.user);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Subscription created successfully',
    data: result,
  });
});

const getSubscriptionList = catchAsync(async (req, res) => {
  const result = await subscriptionService.getListFromDb();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Subscription list retrieved successfully',
    data: result,
  });
});

const getSubscriptionById = catchAsync(async (req, res) => {
  const result = await subscriptionService.getByIdFromDb(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Subscription details retrieved successfully',
    data: result,
  });
});

const updateSubscription = catchAsync(async (req, res) => {
  const result = await subscriptionService.updateIntoDb(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Subscription updated successfully',
    data: result,
  });
});

const deleteSubscription = catchAsync(async (req, res) => {
  const result = await subscriptionService.deleteItemFromDb(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Subscription deleted successfully',
    data: result,
  });
});

export const SubscriptionController = {
  createSubscription,
  getSubscriptionList,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
};