import prisma from "../../../shared/prisma";
import { IDonation, IDonationFilterRequest } from "./donation.interface";

const createDonation = async (donationData: IDonation, userId: string) => {
  const newDonation = await prisma.donation.create({
    data: {
      ...donationData,
      userId,
    },
  });
  return newDonation;
};
const getAllDonations = async (filter: IDonationFilterRequest) => {
    const{
        userId,
        type,
        recurringInterval,
        // status,
        startDate,
        endDate,
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = "desc",
    } = filter;

    const whereClause: any = {};
    if (userId) whereClause.userId = userId;
    if (type) whereClause.type = type;
    if (recurringInterval) whereClause.recurringInterval = recurringInterval;
    if (status) whereClause.status = status;
    if (startDate || endDate) {
        whereClause.createdAt = {};
        if (startDate) whereClause.createdAt.gte = new Date(startDate);
        if (endDate) whereClause.createdAt.lte = new Date(endDate);
    }

    const donations = await prisma.donation.findMany({
        where: whereClause,
        orderBy: {
            [sortBy]: sortOrder,
        },
        skip: (page - 1) * limit,
        take: limit,
    });

    return donations;
};

const getSingleDonation = async (id: string) => {
    const donation = await prisma.donation.findUnique({
        where: { id },
    });
    return donation;
};

const updateDonation = async (id: string, donationData: Partial<IDonation>) => {
    const updatedDonation = await prisma.donation.update({
        where: { id },
        data: donationData,
    });
    return updatedDonation;
};
const deleteDonation = async (id: string) => {
    await prisma.donation.delete({
        where: { id },
    });
};

const getUserDonations = async (userId: string) => {
    const donations = await prisma.donation.findMany({
        where: { userId },
    });
    return donations;
};

export const DonationService = {
  createDonation,
  getAllDonations,
  getSingleDonation,
  updateDonation,
  deleteDonation,
  getUserDonations
};
