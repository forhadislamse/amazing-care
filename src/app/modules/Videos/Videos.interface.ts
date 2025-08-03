export interface IVideos {
  id?: string;
  courseId?: string;
  teacherId?: string;
  title: string;
  videoUrl: string;
  description: string;
}

export interface updateIVideos {
  videoUrl?: string;
  title?: string;
}

export type IVideosFilterRequest = {
  searchTerm?: string | undefined;
  title?: string | undefined;
}