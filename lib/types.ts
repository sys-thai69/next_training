export type Project = {
  id: string;
  slug: string;
  name: string;
  description: string;
  color: string;
  status: string;
  tasksTotal: number;
  tasksCompleted: number;
  dueDate: string;
};

export type Subtask = {
  id: string;
  title: string;
  completed: boolean;
};

export type Comment = {
  id: string;
  author: string;
  content: string;
  createdAt: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  projectId: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  dueDate: string;
  tags: string[];
  subtasks: Subtask[];
  comments: Comment[];
};
