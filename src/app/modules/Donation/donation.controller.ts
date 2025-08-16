import httpStatus from "http-status";
import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { DonationService } from "./donation.service";
import { IDonationFilterRequest } from "./donation.interface";

const createDonation = catchAsync(async (req: Request, res: Response) => {
  const donationData = req.body;
  console.log(req.user.id);
  const donation = await DonationService.createDonation(donationData, req.user.id);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Donation created successfully',
    data: donation,
  });
});



const getAllDonations = catchAsync(async (req: Request, res: Response) => {
  const options = {
    page: Number(req.body.page) || 1,
    limit: Number(req.body.limit) || 10,
    sortBy: req.body.sortBy || 'createdAt',
    sortOrder: req.body.sortOrder || 'desc',
  };

  const role = req.user.role;
  
  const params: IDonationFilterRequest = {
    // শুধু ইউজার হলে userId দিব
    userId: role !== 'ADMIN' && role !== 'SUPER_ADMIN' ? req.user.id : '',
    amount: req.body.amount,
    currency: req.body.currency,
    type: req.body.type,
    recurringInterval: req.body.recurringInterval,
  };

  const result = await DonationService.getAllDonations(options, params, role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Donations retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});



const getSingleDonation = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const donation = await DonationService.getSingleDonation(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Donation retrieved successfully',
        data: donation,
    });
});

const updateDonation = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const donationData = req.body;
    const updatedDonation = await DonationService.updateDonation(id, donationData);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Donation updated successfully',
        data: updatedDonation,
    });
});

const deleteDonation = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await DonationService.deleteDonation(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Donation deleted successfully',
        data: null,
    });
});



export const DonationController = {
  createDonation,
  getAllDonations,
  getSingleDonation,
  updateDonation,
  deleteDonation,
  
};
