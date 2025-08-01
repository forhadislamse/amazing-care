import prisma from "../../../shared/prisma";



const createIntoDb = async (data: any) => {
  const transaction = await prisma.$transaction(async (prisma) => {
    const result = await prisma.termsAndConditions.create({ data });
    return result;
  });

  return transaction;
};

const getListFromDb = async () => {
  
    const result = await prisma.termsAndConditions.findMany();
    return result;
};

const getByIdFromDb = async (id: string) => {
  
    const result = await prisma.termsAndConditions.findUnique({ where: { id } });
    if (!result) {
      throw new Error('termsAndConditions not found');
    }
    return result;
  };



const updateIntoDb = async (id: string, data: any) => {
  const transaction = await prisma.$transaction(async (prisma) => {
    const result = await prisma.termsAndConditions.update({
      where: { id },
      data,
    });
    return result;
  });

  return transaction;
};

const deleteItemFromDb = async (id: string) => {
  const transaction = await prisma.$transaction(async (prisma) => {
    const deletedItem = await prisma.termsAndConditions.delete({
      where: { id },
    });

    // Add any additional logic if necessary, e.g., cascading deletes
    return deletedItem;
  });

  return transaction;
};
;

export const TermsAndConditionsService = {
createIntoDb,
getListFromDb,
getByIdFromDb,
updateIntoDb,
deleteItemFromDb,
};