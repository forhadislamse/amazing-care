import prisma from "../../../shared/prisma";



const createIntoDb = async (data: any) => {
  const transaction = await prisma.$transaction(async (prisma) => {
    const result = await prisma.privacyPolicy.create({ data });
    return result;
  });

  return transaction;
};

const getListFromDb = async () => {
  
    const result = await prisma.privacyPolicy.findMany();
    return result;
};

const getByIdFromDb = async (id: string) => {
  
    const result = await prisma.privacyPolicy.findUnique({ where: { id } });
    if (!result) {
      throw new Error('privacyPolicy not found');
    }
    return result;
  };



const updateIntoDb = async (id: string, data: any) => {
  const transaction = await prisma.$transaction(async (prisma) => {
    const result = await prisma.privacyPolicy.update({
      where: { id },
      data,
    });
    return result;
  });

  return transaction;
};

const deleteItemFromDb = async (id: string) => {
  const transaction = await prisma.$transaction(async (prisma) => {
    const deletedItem = await prisma.privacyPolicy.delete({
      where: { id },
    });

    // Add any additional logic if necessary, e.g., cascading deletes
    return deletedItem;
  });

  return transaction;
};
;

export const PrivacyPolicyService = {
createIntoDb,
getListFromDb,
getByIdFromDb,
updateIntoDb,
deleteItemFromDb,
};