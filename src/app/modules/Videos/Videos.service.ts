import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import {
  IVideos,
  IVideosFilterRequest,
  updateIVideos,
} from "./Videos.interface";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { videosSearchAbleFields } from "./Video.costant";
import { Prisma } from "@prisma/client";
import { sumDurations } from "../../../shared/sumDuration";

const createIntoDb = async (
  data: IVideos,
  teacherId: string,
  courseId: string,
  thumbnailUrl: string,
  videoUrl?: string,
  videoDuration?: string
) => {
  // Count how many videos exist in this course to assign the next serial number
  const existingVideoCount = await prisma.videos.count({
    where: { courseId },
  });

  const serialNo = existingVideoCount + 1;

  // Create video entry
  const video = await prisma.videos.create({
    data: {
      name: data.name,
      title: data.title,
      subTitle: data.subTitle,
      description: data.description,
      videoUrl: videoUrl ?? "",
      thumbnailUrl,
      teacherId,
      courseId,
      videoDuration: videoDuration ?? "",
      serialNo,
    },
    select: {
      id: true,
      name: true,
      title: true,
      subTitle: true,
      description: true,
      courseId: true,
      thumbnailUrl: true,
      teacherId: true,
      videoUrl: true,
      videoDuration: true,
      serialNo: true, // Include in the response
    },
  });

  // Get all video durations for this course
  const videos = await prisma.videos.findMany({
    where: { courseId },
    select: { videoDuration: true },
  });

  // Sum durations
  const totalDuration = sumDurations(videos.map(v => v.videoDuration));

  // Update course with total duration and increment video count
  await prisma.courses.update({
    where: { id: courseId },
    data: {
      videoDuration: totalDuration,
      videoCount: {
        increment: 1,
      },
    },
  });

  return video;
};



const getListFromDb = async (
  options: IPaginationOptions,
  params: IVideosFilterRequest,
  teacherId: string
) => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.VideosWhereInput[] = [];

  // Handle search term
  if (searchTerm) {
    andConditions.push({
      OR: videosSearchAbleFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  // Handle other filters
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.VideosWhereInput = {
    AND: andConditions,
  };

  const result = await prisma.videos.findMany({
    where: whereConditions,
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });

  const total = await prisma.videos.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getByIdFromDb = async (id: string) => {
  const result = await prisma.videos.findUnique({ where: { id } });
  if (!result) {
    throw new Error("videos not found");
  }
  return result;
};

const updateIntoDb = async (
  id: string,
  data: updateIVideos,
  teacherId: string,
  thumbnailUrl?: string
) => {
  console.log('Checking video with:', { id, teacherId });

  const isExistsVideo = await prisma.videos.findFirst({
    where: {
      id,
      teacherId,
    },
  });

  if (!isExistsVideo) {
    throw new ApiError(404, "Video not found");
  }

  const updatedVideo = await prisma.videos.update({
    where: { id },
    data: {
      ...data,
      thumbnailUrl,
    },
  });

  return updatedVideo;
};


const deleteItemFromDb = async (id: string) => {
  const transaction = await prisma.$transaction(async (prisma) => {
    const deletedItem = await prisma.videos.delete({
      where: { id },
    });

    // Add any additional logic if necessary, e.g., cascading deletes
    return deletedItem;
  });

  await prisma.courses.update({
    where: { id },
    data: {
      videoCount: {
        decrement: 1,
      },
    },
  });

  return transaction;
};
export const VideosService = {
  createIntoDb,
  getListFromDb,
  getByIdFromDb,
  updateIntoDb,
  deleteItemFromDb,
};
