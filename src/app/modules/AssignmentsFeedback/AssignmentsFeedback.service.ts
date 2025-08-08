import prisma from "../../../shared/prisma";
import { IAssignmentsFeedback } from "./AssignmentsFeedback.interface";

const createIntoDb = async (
  data: IAssignmentsFeedback,
  userId: string,
  courseId: string
) => {
  if (!userId || !courseId) {
    throw new Error("Both userId and courseId are required.");
  }

  const result = await prisma.assignmentsFeedback.create({
    data: {
      title: data.title,
      documentUrl: data.documentUrl,
      user: { connect: { id: userId } },
      course: { connect: { id: courseId } },
    },
    select: {
      id: true,
      title: true,
      documentUrl: true,
      courseId: true,
      user: { select: { id: true } },
    },
  });
  return result;
};

const getListFromDb = async () => {
  const result = await prisma.assignmentsFeedback.findMany();
  return result;
};

const getByIdFromDb = async (id: string) => {
  const result = await prisma.assignmentsFeedback.findUnique({ where: { id } });
  if (!result) {
    throw new Error("assignmentsFeedback not found");
  }
  return result;
};

const updateIntoDb = async (id: string, data: any) => {
  const result = await prisma.assignmentsFeedback.update({
    where: { id },
    data,
  });
  return result;
};

const deleteItemFromDb = async (id: string) => {
  const deletedItem = await prisma.assignmentsFeedback.delete({
    where: { id },
  });

  // Add any additional logic if necessary, e.g., cascading deletes
  return deletedItem;
};
export const AssignmentsFeedbackService = {
  createIntoDb,
  getListFromDb,
  getByIdFromDb,
  updateIntoDb,
  deleteItemFromDb,
};
