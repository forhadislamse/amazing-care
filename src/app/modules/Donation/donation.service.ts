import { Prisma } from "@prisma/client";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { IPaginationOptions } from "../../../interfaces/paginations";
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

// const getAllDonations = async (
//   options: IPaginationOptions,
//   params: IDonationFilterRequest,
//   role: string
// ) => {
//   const { limit, page, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);

//   let whereConditions: Prisma.DonationWhereInput | undefined;

//   if (role === 'admin') {
//     // admin হলে ফিল্টার একদম লাগবে না, সব ডোনেশন আসবে
//     whereConditions = undefined;
//   } else {
//     // normal user হলে ফিল্টার লাগবে, userId দিয়ে ফিল্টার করবো
//     const andConditions: Prisma.DonationWhereInput[] = [];

//     if (params.userId && params.userId.trim() !== '') {
//       andConditions.push({ userId: params.userId });
//     }

//     if (params.amount !== undefined) {
//       andConditions.push({ amount: params.amount });
//     }

//     if (params.currency) {
//       andConditions.push({ currency: params.currency });
//     }

//     if (params.type) {
//       andConditions.push({ type: params.type });
//     }

//     if (params.recurringInterval !== undefined) {
//       andConditions.push({ recurringInterval: params.recurringInterval });
//     }

//     whereConditions = andConditions.length > 0 ? { AND: andConditions } : undefined;
//   }

//   const donations = await prisma.donation.findMany({
//     ...(whereConditions && { where: whereConditions }),
//     skip,
//     take: limit,
//     orderBy: {
//       [sortBy]: sortOrder,
//     },
//   });

//   const total = await prisma.donation.count({
//     ...(whereConditions && { where: whereConditions }),
//   });

//   return {
//     success: true,
//     message: 'Donations list retrieved successfully',
//     meta: {
//       page,
//       limit,
//       total,
//     },
//     data: donations,
//   };
// };

const getAllDonations = async (
  options: IPaginationOptions,
  params: IDonationFilterRequest,
  role: string
) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  let whereConditions: Prisma.DonationWhereInput | undefined = undefined;

  if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
    // শুধু ইউজারের ক্ষেত্রে ফিল্টার বানাবো
    const andConditions: Prisma.DonationWhereInput[] = [];

    // শুধু নিজের ডোনেশন ফিল্টার
    if (params.userId && params.userId.trim() !== '') {
      andConditions.push({ userId: params.userId });
    }

    if (params.amount !== undefined) {
      andConditions.push({ amount: params.amount });
    }

    if (params.currency) {
      andConditions.push({ currency: params.currency });
    }

    if (params.type) {
      andConditions.push({ type: params.type });
    }

    if (params.recurringInterval !== undefined) {
      andConditions.push({ recurringInterval: params.recurringInterval });
    }

    if (andConditions.length > 0) {
      whereConditions = { AND: andConditions };
    }
  }

  // ডাটাবেজ কুয়েরি
  const donations = await prisma.donation.findMany({
    ...(whereConditions && { where: whereConditions }),
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.donation.count({
    ...(whereConditions && { where: whereConditions }),
  });

  return {
    success: true,
    message: 'Donations list retrieved successfully',
    meta: {
      page,
      limit,
      total,
    },
    data: donations,
  };
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



export const DonationService = {
  createDonation,
  getAllDonations,
  getSingleDonation,
  updateDonation,
  deleteDonation,
  
};
