export interface IVideos {
  id?: string;
  courseId?: string;
  teacherId?: string;
  name: string;
  title: string;
  subTitle: string;
  thumbnailUrl: string;
  videoUrl: string;
  description: string;
}

export interface updateIVideos {
  name?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  title?: string;
  subTitle?: string;
  description?: string;
}

export type IVideosFilterRequest = {
  name?: string | undefined;
  searchTerm?: string | undefined;
  title?: string | undefined;
  subTitle?: string | undefined;
  description?: string | undefined;
}