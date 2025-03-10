export interface Subtask {
  id: string
  title: string
  isCompleted: boolean
}

export interface Task {
  id: string
  title: string
  description: string
  subtasks: Subtask[]
}

export interface ColumnType {
  id: string
  name: string
  tasks: Task[]
}

export interface Board {
  id: string
  name: string
  columns: ColumnType[]
}

