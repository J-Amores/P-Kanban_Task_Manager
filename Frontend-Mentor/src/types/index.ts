export interface Subtask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  subtasks: Subtask[];
}

export interface Column {
  id: string;
  name: string;
  tasks: Task[];
}

export interface Board {
  id: string;
  name: string;
  columns: Column[];
}

export interface AppState {
  boards: Board[];
  currentBoard: Board | null;
  darkMode: boolean;
  sidebarOpen: boolean;
}

export interface BoardFormData {
  name: string;
  columns: { id: string; name: string }[];
}

export interface TaskFormData {
  title: string;
  description: string;
  status: string;
  subtasks: { id: string; title: string }[];
} 