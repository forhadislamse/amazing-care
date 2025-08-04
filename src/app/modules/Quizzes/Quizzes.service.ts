import prisma from "../../../shared/prisma";
import { IQuizzes } from "./Quizzes.interface";

const createIntoDb = async (
  data: IQuizzes,
  teacherId: string,
  courseId: string
) => {
  if (!data.courseId || !data.teacherId) {
    throw new Error("Both courseId and teacherId are required.");
  }

  const result = await prisma.quizzes.create({
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
  const result = await prisma.quizzes.findMany();
  return result;
};

const getByIdFromDb = async (id: string) => {
  const result = await prisma.quizzes.findUnique({ where: { id } });
  if (!result) {
    throw new Error("quizzes not found");
  }
  return result;
};

const updateIntoDb = async (id: string, data: any) => {
  const result = await prisma.quizzes.update({
    where: { id },
    data,
  });
  return result;
};

const deleteItemFromDb = async (id: string) => {
  const deletedItem = await prisma.quizzes.delete({
    where: { id },
  });

  // Add any additional logic if necessary, e.g., cascading deletes
  return deletedItem;
};

export const QuizzesService = {
  createIntoDb,
  getListFromDb,
  getByIdFromDb,
  updateIntoDb,
  deleteItemFromDb,
};
