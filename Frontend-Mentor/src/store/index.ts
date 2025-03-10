import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { AppState, Board, Column, Task, Subtask } from '@/types';

const useStore = create<AppState & {
  // Board actions
  addBoard: (name: string, columns: { name: string }[]) => void;
  updateBoard: (boardId: string, name: string, columns: { id: string; name: string }[]) => void;
  deleteBoard: (boardId: string) => void;
  setCurrentBoard: (boardId: string) => void;
  
  // Column actions
  addColumn: (boardId: string, name: string) => void;
  updateColumn: (boardId: string, columnId: string, name: string) => void;
  deleteColumn: (boardId: string, columnId: string) => void;
  
  // Task actions
  addTask: (boardId: string, columnId: string, task: Omit<Task, 'id'>) => void;
  updateTask: (boardId: string, task: Task) => void;
  deleteTask: (boardId: string, columnId: string, taskId: string) => void;
  moveTask: (boardId: string, sourceColumnId: string, destinationColumnId: string, taskId: string) => void;
  
  // Subtask actions
  toggleSubtask: (boardId: string, columnId: string, taskId: string, subtaskId: string) => void;
  
  // UI actions
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
}>(
  persist(
    (set) => ({
      boards: [],
      currentBoard: null,
      darkMode: false,
      sidebarOpen: true,
      
      // Board actions
      addBoard: (name, columns) => set((state) => {
        const newBoard: Board = {
          id: uuidv4(),
          name,
          columns: columns.map(column => ({
            id: uuidv4(),
            name: column.name,
            tasks: []
          }))
        };
        
        const newBoards = [...state.boards, newBoard];
        return { 
          boards: newBoards,
          currentBoard: newBoards.length === 1 ? newBoard : state.currentBoard
        };
      }),
      
      updateBoard: (boardId, name, columns) => set((state) => {
        const boardIndex = state.boards.findIndex(board => board.id === boardId);
        if (boardIndex === -1) return state;
        
        const updatedBoard = { ...state.boards[boardIndex], name };
        
        // Handle columns
        const existingColumns = state.boards[boardIndex].columns;
        const updatedColumns: Column[] = [];
        
        // Update existing columns
        columns.forEach(column => {
          if (column.id) {
            const existingColumn = existingColumns.find(c => c.id === column.id);
            if (existingColumn) {
              updatedColumns.push({
                ...existingColumn,
                name: column.name
              });
            }
          } else {
            // Add new column
            updatedColumns.push({
              id: uuidv4(),
              name: column.name,
              tasks: []
            });
          }
        });
        
        updatedBoard.columns = updatedColumns;
        
        const updatedBoards = [...state.boards];
        updatedBoards[boardIndex] = updatedBoard;
        
        return { 
          boards: updatedBoards,
          currentBoard: state.currentBoard?.id === boardId ? updatedBoard : state.currentBoard
        };
      }),
      
      deleteBoard: (boardId) => set((state) => {
        const newBoards = state.boards.filter(board => board.id !== boardId);
        return { 
          boards: newBoards,
          currentBoard: state.currentBoard?.id === boardId 
            ? (newBoards.length > 0 ? newBoards[0] : null) 
            : state.currentBoard
        };
      }),
      
      setCurrentBoard: (boardId) => set((state) => ({
        currentBoard: state.boards.find(board => board.id === boardId) || null
      })),
      
      // Column actions
      addColumn: (boardId, name) => set((state) => {
        const boardIndex = state.boards.findIndex(board => board.id === boardId);
        if (boardIndex === -1) return state;
        
        const newColumn: Column = {
          id: uuidv4(),
          name,
          tasks: []
        };
        
        const updatedBoard = {
          ...state.boards[boardIndex],
          columns: [...state.boards[boardIndex].columns, newColumn]
        };
        
        const updatedBoards = [...state.boards];
        updatedBoards[boardIndex] = updatedBoard;
        
        return { 
          boards: updatedBoards,
          currentBoard: state.currentBoard?.id === boardId ? updatedBoard : state.currentBoard
        };
      }),
      
      updateColumn: (boardId, columnId, name) => set((state) => {
        const boardIndex = state.boards.findIndex(board => board.id === boardId);
        if (boardIndex === -1) return state;
        
        const columnIndex = state.boards[boardIndex].columns.findIndex(column => column.id === columnId);
        if (columnIndex === -1) return state;
        
        const updatedColumns = [...state.boards[boardIndex].columns];
        updatedColumns[columnIndex] = {
          ...updatedColumns[columnIndex],
          name
        };
        
        const updatedBoard = {
          ...state.boards[boardIndex],
          columns: updatedColumns
        };
        
        const updatedBoards = [...state.boards];
        updatedBoards[boardIndex] = updatedBoard;
        
        return { 
          boards: updatedBoards,
          currentBoard: state.currentBoard?.id === boardId ? updatedBoard : state.currentBoard
        };
      }),
      
      deleteColumn: (boardId, columnId) => set((state) => {
        const boardIndex = state.boards.findIndex(board => board.id === boardId);
        if (boardIndex === -1) return state;
        
        const updatedColumns = state.boards[boardIndex].columns.filter(column => column.id !== columnId);
        
        const updatedBoard = {
          ...state.boards[boardIndex],
          columns: updatedColumns
        };
        
        const updatedBoards = [...state.boards];
        updatedBoards[boardIndex] = updatedBoard;
        
        return { 
          boards: updatedBoards,
          currentBoard: state.currentBoard?.id === boardId ? updatedBoard : state.currentBoard
        };
      }),
      
      // Task actions
      addTask: (boardId, columnId, task) => set((state) => {
        const boardIndex = state.boards.findIndex(board => board.id === boardId);
        if (boardIndex === -1) return state;
        
        const columnIndex = state.boards[boardIndex].columns.findIndex(column => column.id === columnId);
        if (columnIndex === -1) return state;
        
        const newTask: Task = {
          id: uuidv4(),
          ...task,
          subtasks: task.subtasks.map(subtask => ({
            id: uuidv4(),
            title: subtask.title,
            isCompleted: false
          }))
        };
        
        const updatedColumns = [...state.boards[boardIndex].columns];
        updatedColumns[columnIndex] = {
          ...updatedColumns[columnIndex],
          tasks: [...updatedColumns[columnIndex].tasks, newTask]
        };
        
        const updatedBoard = {
          ...state.boards[boardIndex],
          columns: updatedColumns
        };
        
        const updatedBoards = [...state.boards];
        updatedBoards[boardIndex] = updatedBoard;
        
        return { 
          boards: updatedBoards,
          currentBoard: state.currentBoard?.id === boardId ? updatedBoard : state.currentBoard
        };
      }),
      
      updateTask: (boardId, updatedTask) => set((state) => {
        const boardIndex = state.boards.findIndex(board => board.id === boardId);
        if (boardIndex === -1) return state;
        
        const board = state.boards[boardIndex];
        let taskFound = false;
        
        const updatedColumns = board.columns.map(column => {
          // If the task is in this column and status hasn't changed
          if (column.tasks.some(task => task.id === updatedTask.id) && 
              column.name === updatedTask.status) {
            taskFound = true;
            return {
              ...column,
              tasks: column.tasks.map(task => 
                task.id === updatedTask.id ? updatedTask : task
              )
            };
          }
          // If the task is in this column but status has changed, remove it
          else if (column.tasks.some(task => task.id === updatedTask.id)) {
            taskFound = true;
            return {
              ...column,
              tasks: column.tasks.filter(task => task.id !== updatedTask.id)
            };
          }
          // If the task should be moved to this column based on status
          else if (column.name === updatedTask.status) {
            taskFound = true;
            return {
              ...column,
              tasks: [...column.tasks, updatedTask]
            };
          }
          return column;
        });
        
        if (!taskFound) return state;
        
        const updatedBoard = {
          ...board,
          columns: updatedColumns
        };
        
        const updatedBoards = [...state.boards];
        updatedBoards[boardIndex] = updatedBoard;
        
        return { 
          boards: updatedBoards,
          currentBoard: state.currentBoard?.id === boardId ? updatedBoard : state.currentBoard
        };
      }),
      
      deleteTask: (boardId, columnId, taskId) => set((state) => {
        const boardIndex = state.boards.findIndex(board => board.id === boardId);
        if (boardIndex === -1) return state;
        
        const columnIndex = state.boards[boardIndex].columns.findIndex(column => column.id === columnId);
        if (columnIndex === -1) return state;
        
        const updatedColumns = [...state.boards[boardIndex].columns];
        updatedColumns[columnIndex] = {
          ...updatedColumns[columnIndex],
          tasks: updatedColumns[columnIndex].tasks.filter(task => task.id !== taskId)
        };
        
        const updatedBoard = {
          ...state.boards[boardIndex],
          columns: updatedColumns
        };
        
        const updatedBoards = [...state.boards];
        updatedBoards[boardIndex] = updatedBoard;
        
        return { 
          boards: updatedBoards,
          currentBoard: state.currentBoard?.id === boardId ? updatedBoard : state.currentBoard
        };
      }),
      
      moveTask: (boardId, sourceColumnId, destinationColumnId, taskId) => set((state) => {
        const boardIndex = state.boards.findIndex(board => board.id === boardId);
        if (boardIndex === -1) return state;
        
        const sourceColumnIndex = state.boards[boardIndex].columns.findIndex(column => column.id === sourceColumnId);
        const destColumnIndex = state.boards[boardIndex].columns.findIndex(column => column.id === destinationColumnId);
        
        if (sourceColumnIndex === -1 || destColumnIndex === -1) return state;
        
        const taskToMove = state.boards[boardIndex].columns[sourceColumnIndex].tasks.find(task => task.id === taskId);
        if (!taskToMove) return state;
        
        // Create updated task with new status
        const updatedTask = {
          ...taskToMove,
          status: state.boards[boardIndex].columns[destColumnIndex].name
        };
        
        // Remove from source column
        const updatedSourceColumn = {
          ...state.boards[boardIndex].columns[sourceColumnIndex],
          tasks: state.boards[boardIndex].columns[sourceColumnIndex].tasks.filter(task => task.id !== taskId)
        };
        
        // Add to destination column
        const updatedDestColumn = {
          ...state.boards[boardIndex].columns[destColumnIndex],
          tasks: [...state.boards[boardIndex].columns[destColumnIndex].tasks, updatedTask]
        };
        
        const updatedColumns = [...state.boards[boardIndex].columns];
        updatedColumns[sourceColumnIndex] = updatedSourceColumn;
        updatedColumns[destColumnIndex] = updatedDestColumn;
        
        const updatedBoard = {
          ...state.boards[boardIndex],
          columns: updatedColumns
        };
        
        const updatedBoards = [...state.boards];
        updatedBoards[boardIndex] = updatedBoard;
        
        return { 
          boards: updatedBoards,
          currentBoard: state.currentBoard?.id === boardId ? updatedBoard : state.currentBoard
        };
      }),
      
      // Subtask actions
      toggleSubtask: (boardId, columnId, taskId, subtaskId) => set((state) => {
        const boardIndex = state.boards.findIndex(board => board.id === boardId);
        if (boardIndex === -1) return state;
        
        const columnIndex = state.boards[boardIndex].columns.findIndex(column => column.id === columnId);
        if (columnIndex === -1) return state;
        
        const taskIndex = state.boards[boardIndex].columns[columnIndex].tasks.findIndex(task => task.id === taskId);
        if (taskIndex === -1) return state;
        
        const subtaskIndex = state.boards[boardIndex].columns[columnIndex].tasks[taskIndex].subtasks.findIndex(
          subtask => subtask.id === subtaskId
        );
        if (subtaskIndex === -1) return state;
        
        const updatedSubtasks = [...state.boards[boardIndex].columns[columnIndex].tasks[taskIndex].subtasks];
        updatedSubtasks[subtaskIndex] = {
          ...updatedSubtasks[subtaskIndex],
          isCompleted: !updatedSubtasks[subtaskIndex].isCompleted
        };
        
        const updatedTask = {
          ...state.boards[boardIndex].columns[columnIndex].tasks[taskIndex],
          subtasks: updatedSubtasks
        };
        
        const updatedTasks = [...state.boards[boardIndex].columns[columnIndex].tasks];
        updatedTasks[taskIndex] = updatedTask;
        
        const updatedColumns = [...state.boards[boardIndex].columns];
        updatedColumns[columnIndex] = {
          ...updatedColumns[columnIndex],
          tasks: updatedTasks
        };
        
        const updatedBoard = {
          ...state.boards[boardIndex],
          columns: updatedColumns
        };
        
        const updatedBoards = [...state.boards];
        updatedBoards[boardIndex] = updatedBoard;
        
        return { 
          boards: updatedBoards,
          currentBoard: state.currentBoard?.id === boardId ? updatedBoard : state.currentBoard
        };
      }),
      
      // UI actions
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen }))
    }),
    {
      name: 'kanban-storage'
    }
  )
);

export default useStore; 