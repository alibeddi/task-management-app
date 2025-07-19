export type Priority = "Low" | "Medium" | "High";

export interface TaskAssignee {
  id: string;
  name: string;
  avatar: string;
  isOnline?: boolean;
}

export interface Task {
  id: string;
  title: string; // required
  description: string; // required
  dueDate: string; // required
  priority: Priority; // required: 'Low' | 'Medium' | 'High'
  status: string; // status column id
  order: number; // for ordering within a column
  assignees?: TaskAssignee[];
  completedSubtasks?: number;
  totalSubtasks?: number;
  comments?: number;
  attachments?: number;
  coverImage?: string;
}
