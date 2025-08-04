export interface IAssignments {
  id?: string;
  courseId: string;
  teacherId: string;
  title: string;
  documentUrl: string;
}

export interface updateIAssignments {
  documentUrl?: string;
  title?: string;
}

export type IAssignmentsFilterRequest = {
  searchTerm?: string;
  title?: string;
};
