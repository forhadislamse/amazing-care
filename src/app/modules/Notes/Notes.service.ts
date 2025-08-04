import prisma from "../../../shared/prisma";
import { INotes } from "./Notes.interface";

const createIntoDb = async (data: INotes, teacherId: string, courseId: string) => {
  if (!data.courseId || !data.teacherId) {
    throw new Error("Both courseId and teacherId are required.");
  }

  const result = await prisma.notes.create({
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
  const result = await prisma.notes.findMany();
  return result;
};

const getByIdFromDb = async (id: string) => {
  const result = await prisma.notes.findUnique({ where: { id } });
  if (!result) {
    throw new Error("notes not found");
  }
  return result;
};

const updateIntoDb = async (id: string, data: any) => {
  const result = await prisma.notes.update({
    where: { id },
    data,
  });
  return result;
};

const deleteItemFromDb = async (id: string) => {
  const deletedItem = await prisma.notes.delete({
    where: { id },
  });

  // Add any additional logic if necessary, e.g., cascading deletes
  return deletedItem;
};
export const NotesService = {
  createIntoDb,
  getListFromDb,
  getByIdFromDb,
  updateIntoDb,
  deleteItemFromDb,
};
