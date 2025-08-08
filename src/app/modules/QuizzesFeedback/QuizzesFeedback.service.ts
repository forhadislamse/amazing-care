import prisma from "../../../shared/prisma";
import { IQuizzesFeedback } from "./QuizzesFeedBack.interface";

const createIntoDb = async (
  data: IQuizzesFeedback,
  userId: string,
  courseId: string
) => {
  if (!userId || !courseId) {
    throw new Error("Both userId and courseId are required.");
  }

  const result = await prisma.quizzesFeedback.create({
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
  const result = await prisma.quizzesFeedback.findMany();
  return result;
};

const getByIdFromDb = async (id: string) => {
  const result = await prisma.quizzesFeedback.findUnique({ where: { id } });
  if (!result) {
    throw new Error("quizzesFeedback not found");
  }
  return result;
};

const updateIntoDb = async (id: string, data: any) => {
  const transaction = await prisma.$transaction(async (prisma) => {
    const result = await prisma.quizzesFeedback.update({
      where: { id },
      data,
    });
    return result;
  });

  return transaction;
};

const deleteItemFromDb = async (id: string) => {
  const transaction = await prisma.$transaction(async (prisma) => {
    const deletedItem = await prisma.quizzesFeedback.delete({
      where: { id },
    });

    // Add any additional logic if necessary, e.g., cascading deletes
    return deletedItem;
  });

  return transaction;
};
export const QuizzesFeedbackService = {
  createIntoDb,
  getListFromDb,
  getByIdFromDb,
  updateIntoDb,
  deleteItemFromDb,
};
