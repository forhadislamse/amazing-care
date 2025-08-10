import httpStatus from "http-status";
import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { DonationService } from "./donation.service";

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
    const filter=req.query;
    const donations = await DonationService.getAllDonations(filter);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Donations retrieved successfully',
        data: donations,
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

const getUserDonations = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const donations = await DonationService.getAllDonations({ userId });
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User donations retrieved successfully',
        data: donations,
    });
});

export const DonationController = {
  createDonation,
  getAllDonations,
  getSingleDonation,
  updateDonation,
  deleteDonation,
  getUserDonations
};
