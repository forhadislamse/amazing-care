import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";

const createIntoDb = async (
  userId: string,
  agentId: string,
  rating: number
) => {
  
  const agent = await prisma.user.findUnique({
    where: { id: agentId },
  });


  const existingReview = await prisma.review.findFirst({
    where: { agentId, userId },
  });

  if (existingReview) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "You have already reviewed this agent."
    );
  }

  const review = await prisma.review.create({
    data: {
      agentId,
      userId,
      rating,
    },
  });

  return review;
};


const getListFromDb = async () => {
  const result = await prisma.review.findMany();
  return result;
};

const getByIdFromDb = async (id: string) => {
  const result = await prisma.review.findUnique({ where: { id } });
  if (!result) {
    throw new Error("review not found");
  }
  return result;
};

const updateIntoDb = async (id: string, data: any) => {
  const result = await prisma.review.update({
    where: { id },
    data,
  });
  return result;
};

const deleteItemFromDb = async (id: string) => {
    const deletedItem = await prisma.review.delete({
      where: { id },
    });

    // Add any additional logic if necessary, e.g., cascading deletes
    return deletedItem;
  
};
export const ReviewService = {
  createIntoDb,
  getListFromDb,
  getByIdFromDb,
  updateIntoDb,
  deleteItemFromDb,
};
