import httpStatus from "http-status";
import { VideosService } from "./Videos.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import ApiError from "../../../errors/ApiErrors";
import { IVideos, updateIVideos } from "./Videos.interface";
import { fileUploader } from "../../../helpars/fileUploader";
import pick from "../../../shared/pick";
import { videosFilterableFields } from "./Video.costant";
import { getVideoDurationFromBufferAlt } from "../../../shared/getVideoDuration";

const createVideos = catchAsync(async (req: Request, res: Response) => {
  const teacherId = req.user?.id;
  const userRole = req.user?.role;
  const courseId = req.params.id;

  if (!teacherId)
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized access.");
  if (userRole !== "TEACHER")
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Only teachers can create videos."
    );

  const videosData: IVideos = JSON.parse(req.body.text || "{}");
  videosData.courseId = courseId;

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const videoFile = files?.video?.[0];

  if (!videoFile)
    throw new ApiError(httpStatus.BAD_REQUEST, "No video thumbnail uploaded.");

  let videoUrl: string | undefined;
  if (videoFile) {
    const uploadVideoResult = await fileUploader.uploadToCloudinary(videoFile);
    videoUrl = uploadVideoResult?.Location;
  }

  const videoDuration = videoFile
    ? await getVideoDurationFromBufferAlt(videoFile.buffer)
    : "";


  const result = await VideosService.createIntoDb(
    videosData,
    teacherId,
    courseId,
    videoUrl,
    videoDuration
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Video created successfully",
    data: result,
  });
});

const getVideosList = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ["limit", "page"]);
  const filters = pick(req.query, videosFilterableFields);
  const teacherId = req.user?.id;
  const tips = await VideosService.getListFromDb(options, filters, teacherId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Videos list retrieved successfully",
    meta: tips.meta,
    data: tips.data,
  });
});

const getVideosById = catchAsync(async (req: Request, res: Response) => {
  const result = await VideosService.getByIdFromDb(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Videos details retrieved successfully",
    data: result,
  });
});

const updateVideos = catchAsync(async (req: Request, res: Response) => {
  const teacherId = req.user?.id;
  const { id } = req.params;

  const videosData: updateIVideos = JSON.parse(req.body.text || "{}");

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const videoFile = files?.video?.[0];

  if (videoFile) {
    const uploadResult = await fileUploader.uploadToCloudinary(videoFile);
    const videoUrl = uploadResult?.Location;

    if (videoUrl) {
      videosData.videoUrl = videoUrl;
    }
  }

  const video = await VideosService.updateIntoDb(id, videosData, teacherId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Videos updated successfully",
    data: video,
  });
});


const deleteVideos = catchAsync(async (req: Request, res: Response) => {
  const result = await VideosService.deleteItemFromDb(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Videos deleted successfully",
    data: result,
  });
});

export const VideosController = {
  createVideos,
  getVideosList,
  getVideosById,
  updateVideos,
  deleteVideos,
};
