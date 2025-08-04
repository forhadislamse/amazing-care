export interface IQuizzes {
  id?: string;
  courseId: string;
  teacherId: string;
  title: string;
  documentUrl: string;
}

export interface updateIQuizzes {
  documentUrl?: string;
  title?: string;
}

export type IQuizzesFilterRequest = {
  searchTerm?: string;
  title?: string;
};
