import httpStatus from "http-status";
import prisma from "../../../shared/prisma";

const createIntoDb = async (data: any) => {
  const result = await prisma.plan.create({ data });
  return result;
};

const getListFromDb = async () => {
  const result = await prisma.plan.findMany({
    where: { NOT: { isDeleted: true } },
  });
  return result;
};

const getByIdFromDb = async (id: string) => {
  const result = await prisma.plan.findUnique({ where: { id } });
  if (!result) {
    throw new Error("plan not found");
  }
  return result;
};

const updateIntoDb = async (id: string, data: any) => {
  
  const transaction = await prisma.$transaction(async (prisma) => {
    const result = await prisma.plan.update({
      where: { id },
      data,
    });
    return result;
  });

  return transaction;
};

const deleteItemFromDb = async (id: string) => {
  const transaction = await prisma.$transaction(async (prisma) => {
    const deletedItem = await prisma.plan.update({
      where: { id },
      data: { isDeleted: true },
    });

    // Add any additional logic if necessary, e.g., cascading deletes
    return deletedItem;
  });

  return transaction;
};

export const planService = {
  createIntoDb,
  getListFromDb,
  getByIdFromDb,
  updateIntoDb,
  deleteItemFromDb,
};
