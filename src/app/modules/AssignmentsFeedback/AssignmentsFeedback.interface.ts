export interface IAssignmentsFeedback {
  id?: string;
  courseId: string;
  userId: string;
  title: string;
  documentUrl: string;
}

export interface updateIAssignmentsFeedback {
  documentUrl?: string;
  title?: string;
}

export type IAssignmentsFilterRequestFeedback = {
  searchTerm?: string;
  title?: string;
};
