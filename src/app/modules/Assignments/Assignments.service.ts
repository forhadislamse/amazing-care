import prisma from "../../../shared/prisma";
import { IAssignments } from "./Assignments.interface";

const createIntoDb = async (data: IAssignments,
  teacherId: string,
  courseId: string) => {
  if (!data.courseId || !data.teacherId) {
    throw new Error("Both courseId and teacherId are required.");
  }

  const result = await prisma.assignments.create({
    data: {
      title: data.title,
      documentUrl: data.documentUrl,
      courseId,
      teacherId,
    },
    select: {
      id: true,
      title: true,
      documentUrl: true,
      courseId: true,
      teacherId: true,
    },
  });
  return result;
};

const getListFromDb = async () => {
  const result = await prisma.assignments.findMany();
  return result;
};

const getByIdFromDb = async (id: string) => {
  const result = await prisma.assignments.findUnique({ where: { id } });
  if (!result) {
    throw new Error("assignments not found");
  }
  return result;
};

const updateIntoDb = async (id: string, data: any) => {
  const result = await prisma.assignments.update({
    where: { id },
    data,
  });
  return result;
};

const deleteItemFromDb = async (id: string) => {
  const deletedItem = await prisma.assignments.delete({
    where: { id },
  });

  // Add any additional logic if necessary, e.g., cascading deletes
  return deletedItem;
};
export const AssignmentsService = {
  createIntoDb,
  getListFromDb,
  getByIdFromDb,
  updateIntoDb,
  deleteItemFromDb,
};
