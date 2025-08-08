export interface IQuizzesFeedback {
  id?: string;
  courseId: string;
  userId: string;
  title: string;
  documentUrl: string;
}

export interface updateIQuizzesFeedback {
  documentUrl?: string;
  title?: string;
}

export type IQuizzesFilterRequestFeedback = {
  searchTerm?: string;
  title?: string;
};
