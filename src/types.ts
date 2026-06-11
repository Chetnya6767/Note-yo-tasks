export type Priority = 'low' | 'medium' | 'high';
export type Status = 'active' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  createdAt: number;
}
