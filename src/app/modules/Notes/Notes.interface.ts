export interface INotes {
  id?: string;
  courseId: string;
  teacherId: string;
  title: string;
  documentUrl: string;
}

export interface updateINotes {
  documentUrl?: string;
  title?: string;
}

export type INotesFilterRequest = {
  searchTerm?: string;
  title?: string;
};
