import { create } from "zustand"
import { v4 as uuidv4 } from "uuid"
import type { Board, ColumnType, Task } from "./types"

interface StoreState {
  boards: Board[]
  activeBoard: string | null

  // Dialog states
  createBoardDialogOpen: boolean
  editBoardDialogOpen: boolean
  deleteBoardDialogOpen: boolean
  createTaskDialogOpen: boolean
  editTaskDialogOpen: boolean
  deleteTaskDialogOpen: boolean
  viewTaskDialogOpen: boolean

  // Task editing states
  taskToEdit: string | null
  taskToDelete: string | null
  taskToView: string | null

  // Board actions
  setActiveBoard: (boardId: string) => void
  createBoard: (name: string, columnNames: string[]) => void
  updateBoard: (boardId: string, name: string, columns: { id?: string; name: string }[]) => void
  deleteBoard: (boardId: string) => void

  // Task actions
  createTask: (title: string, description: string, columnId: string, subtaskTitles: string[]) => void
  updateTask: (
    taskId: string,
    title: string,
    description: string,
    columnId: string,
    subtasks: { id?: string; title: string; isCompleted?: boolean }[],
  ) => void
  deleteTask: (taskId: string) => void
  moveTask: (taskId: string, columnId: string) => void
  updateTaskStatus: (taskId: string, columnId: string) => void
  toggleSubtask: (taskId: string, subtaskId: string) => void

  // Dialog actions
  openCreateBoardDialog: () => void
  closeCreateBoardDialog: () => void
  openEditBoardDialog: () => void
  closeEditBoardDialog: () => void
  openDeleteBoardDialog: () => void
  closeDeleteBoardDialog: () => void
  openCreateTaskDialog: () => void
  closeCreateTaskDialog: () => void
  openEditTaskDialog: (taskId: string) => void
  closeEditTaskDialog: () => void
  openDeleteTaskDialog: (taskId: string) => void
  closeDeleteTaskDialog: () => void
  openViewTaskDialog: (taskId: string) => void
  closeViewTaskDialog: () => void

  // Initialization
  initializeStore: () => void
}

export const useStore = create<StoreState>((set, get) => ({
  boards: [],
  activeBoard: null,

  // Dialog states
  createBoardDialogOpen: false,
  editBoardDialogOpen: false,
  deleteBoardDialogOpen: false,
  createTaskDialogOpen: false,
  editTaskDialogOpen: false,
  deleteTaskDialogOpen: false,
  viewTaskDialogOpen: false,

  // Task editing states
  taskToEdit: null,
  taskToDelete: null,
  taskToView: null,

  // Board actions
  setActiveBoard: (boardId) => set({ activeBoard: boardId }),

  createBoard: (name, columnNames) => {
    const newBoard: Board = {
      id: uuidv4(),
      name,
      columns: columnNames.map((columnName) => ({
        id: uuidv4(),
        name: columnName,
        tasks: [],
      })),
    }

    set((state) => ({
      boards: [...state.boards, newBoard],
      activeBoard: newBoard.id,
    }))
  },

  updateBoard: (boardId, name, columns) => {
    set((state) => {
      const updatedBoards = state.boards.map((board) => {
        if (board.id === boardId) {
          // Create a map of existing columns by ID
          const existingColumnsMap = new Map(board.columns.map((col) => [col.id, col]))

          // Create updated columns
          const updatedColumns: ColumnType[] = columns.map((col) => {
            if (col.id && existingColumnsMap.has(col.id)) {
              // Update existing column
              const existingCol = existingColumnsMap.get(col.id)!
              return {
                ...existingCol,
                name: col.name,
              }
            } else {
              // Create new column
              return {
                id: uuidv4(),
                name: col.name,
                tasks: [],
              }
            }
          })

          // Find columns that were removed
          const updatedColumnIds = new Set(updatedColumns.map((col) => col.id))
          const removedColumns = board.columns.filter((col) => !updatedColumnIds.has(col.id))

          // Move tasks from removed columns to the first available column
          if (removedColumns.length > 0 && updatedColumns.length > 0) {
            const firstColumnId = updatedColumns[0].id
            const tasksToMove = removedColumns.flatMap((col) => col.tasks)

            if (tasksToMove.length > 0) {
              updatedColumns.forEach((col) => {
                if (col.id === firstColumnId) {
                  col.tasks = [...col.tasks, ...tasksToMove]
                }
              })
            }
          }

          return {
            ...board,
            name,
            columns: updatedColumns,
          }
        }
        return board
      })

      return { boards: updatedBoards }
    })
  },

  deleteBoard: (boardId) => {
    set((state) => {
      const updatedBoards = state.boards.filter((board) => board.id !== boardId)

      // If we're deleting the active board, set a new active board
      let newActiveBoard = state.activeBoard
      if (state.activeBoard === boardId) {
        newActiveBoard = updatedBoards.length > 0 ? updatedBoards[0].id : null
      }

      return {
        boards: updatedBoards,
        activeBoard: newActiveBoard,
      }
    })
  },

  // Task actions
  createTask: (title, description, columnId, subtaskTitles) => {
    const newTask: Task = {
      id: uuidv4(),
      title,
      description,
      subtasks: subtaskTitles.map((title) => ({
        id: uuidv4(),
        title,
        isCompleted: false,
      })),
    }

    set((state) => {
      const updatedBoards = state.boards.map((board) => {
        if (board.id === state.activeBoard) {
          const updatedColumns = board.columns.map((column) => {
            if (column.id === columnId) {
              return {
                ...column,
                tasks: [...column.tasks, newTask],
              }
            }
            return column
          })

          return {
            ...board,
            columns: updatedColumns,
          }
        }
        return board
      })

      return { boards: updatedBoards }
    })
  },

  updateTask: (taskId, title, description, columnId, subtasks) => {
    set((state) => {
      const updatedBoards = state.boards.map((board) => {
        if (board.id === state.activeBoard) {
          // Find the task in any column
          let foundTask: Task | null = null
          let sourceColumnId: string | null = null

          for (const column of board.columns) {
            const task = column.tasks.find((t) => t.id === taskId)
            if (task) {
              foundTask = task
              sourceColumnId = column.id
              break
            }
          }

          if (foundTask && sourceColumnId) {
            // Create updated task
            const updatedTask: Task = {
              ...foundTask,
              title,
              description,
              subtasks: subtasks.map((st) => ({
                id: st.id || uuidv4(),
                title: st.title,
                isCompleted: st.isCompleted !== undefined ? st.isCompleted : false,
              })),
            }

            // Update columns
            const updatedColumns = board.columns.map((column) => {
              // Remove task from source column
              if (column.id === sourceColumnId) {
                return {
                  ...column,
                  tasks: column.tasks.filter((t) => t.id !== taskId),
                }
              }

              // Add task to target column
              if (column.id === columnId) {
                return {
                  ...column,
                  tasks: [...column.tasks, updatedTask],
                }
              }

              return column
            })

            return {
              ...board,
              columns: updatedColumns,
            }
          }
        }
        return board
      })

      return { boards: updatedBoards }
    })
  },

  deleteTask: (taskId) => {
    set((state) => {
      const updatedBoards = state.boards.map((board) => {
        if (board.id === state.activeBoard) {
          const updatedColumns = board.columns.map((column) => {
            return {
              ...column,
              tasks: column.tasks.filter((task) => task.id !== taskId),
            }
          })

          return {
            ...board,
            columns: updatedColumns,
          }
        }
        return board
      })

      return { boards: updatedBoards }
    })
  },

  moveTask: (taskId, columnId) => {
    set((state) => {
      const updatedBoards = state.boards.map((board) => {
        if (board.id === state.activeBoard) {
          // Find the task in any column
          let taskToMove: Task | null = null
          let sourceColumnId: string | null = null

          for (const column of board.columns) {
            const task = column.tasks.find((t) => t.id === taskId)
            if (task) {
              taskToMove = task
              sourceColumnId = column.id
              break
            }
          }

          if (taskToMove && sourceColumnId && sourceColumnId !== columnId) {
            // Update columns
            const updatedColumns = board.columns.map((column) => {
              // Remove task from source column
              if (column.id === sourceColumnId) {
                return {
                  ...column,
                  tasks: column.tasks.filter((t) => t.id !== taskId),
                }
              }

              // Add task to target column
              if (column.id === columnId) {
                return {
                  ...column,
                  tasks: [...column.tasks, taskToMove!],
                }
              }

              return column
            })

            return {
              ...board,
              columns: updatedColumns,
            }
          }
        }
        return board
      })

      return { boards: updatedBoards }
    })
  },

  updateTaskStatus: (taskId, columnId) => {
    get().moveTask(taskId, columnId)
  },

  toggleSubtask: (taskId, subtaskId) => {
    set((state) => {
      const updatedBoards = state.boards.map((board) => {
        if (board.id === state.activeBoard) {
          const updatedColumns = board.columns.map((column) => {
            const updatedTasks = column.tasks.map((task) => {
              if (task.id === taskId) {
                const updatedSubtasks = task.subtasks.map((subtask) => {
                  if (subtask.id === subtaskId) {
                    return {
                      ...subtask,
                      isCompleted: !subtask.isCompleted,
                    }
                  }
                  return subtask
                })

                return {
                  ...task,
                  subtasks: updatedSubtasks,
                }
              }
              return task
            })

            return {
              ...column,
              tasks: updatedTasks,
            }
          })

          return {
            ...board,
            columns: updatedColumns,
          }
        }
        return board
      })

      return { boards: updatedBoards }
    })
  },

  // Dialog actions
  openCreateBoardDialog: () => set({ createBoardDialogOpen: true }),
  closeCreateBoardDialog: () => set({ createBoardDialogOpen: false }),
  openEditBoardDialog: () => set({ editBoardDialogOpen: true }),
  closeEditBoardDialog: () => set({ editBoardDialogOpen: false }),
  openDeleteBoardDialog: () => set({ deleteBoardDialogOpen: true }),
  closeDeleteBoardDialog: () => set({ deleteBoardDialogOpen: false }),
  openCreateTaskDialog: () => set({ createTaskDialogOpen: true }),
  closeCreateTaskDialog: () => set({ createTaskDialogOpen: false }),
  openEditTaskDialog: (taskId) => set({ editTaskDialogOpen: true, taskToEdit: taskId }),
  closeEditTaskDialog: () => set({ editTaskDialogOpen: false, taskToEdit: null }),
  openDeleteTaskDialog: (taskId) => set({ deleteTaskDialogOpen: true, taskToDelete: taskId }),
  closeDeleteTaskDialog: () => set({ deleteTaskDialogOpen: false, taskToDelete: null }),
  openViewTaskDialog: (taskId) => set({ viewTaskDialogOpen: true, taskToView: taskId }),
  closeViewTaskDialog: () => set({ viewTaskDialogOpen: false, taskToView: null }),

  // Initialization
  initializeStore: () => {
    // Check if we have data in localStorage
    const storedData = localStorage.getItem("kanban-data")

    if (storedData) {
      try {
        const { boards, activeBoard } = JSON.parse(storedData)
        set({ boards, activeBoard })
      } catch (error) {
        console.error("Failed to parse stored data:", error)
        set({ boards: getSampleData() })
      }
    } else {
      // Initialize with sample data
      set({ boards: getSampleData() })
    }

    // Subscribe to store changes to save to localStorage
    const unsubscribe = get().subscribe((state) => {
      localStorage.setItem(
        "kanban-data",
        JSON.stringify({
          boards: state.boards,
          activeBoard: state.activeBoard,
        }),
      )
    })

    return unsubscribe
  },

  // Subscribe to store changes
  subscribe: (callback) => {
    // This is a simple implementation of a subscribe function
    // In a real app, you might want to use middleware or a more robust solution
    const unsubscribe = () => {}
    return unsubscribe
  },
}))

// Sample data for initial state
function getSampleData(): Board[] {
  return [
    {
      id: uuidv4(),
      name: "Platform Launch",
      columns: [
        {
          id: uuidv4(),
          name: "Todo",
          tasks: [
            {
              id: uuidv4(),
              title: "Build UI for onboarding flow",
              description: "",
              subtasks: [
                {
                  id: uuidv4(),
                  title: "Sign up page",
                  isCompleted: true,
                },
                {
                  id: uuidv4(),
                  title: "Sign in page",
                  isCompleted: false,
                },
                {
                  id: uuidv4(),
                  title: "Welcome page",
                  isCompleted: false,
                },
              ],
            },
            {
              id: uuidv4(),
              title: "Build UI for search",
              description: "",
              subtasks: [
                {
                  id: uuidv4(),
                  title: "Search page",
                  isCompleted: false,
                },
              ],
            },
            {
              id: uuidv4(),
              title: "Build settings UI",
              description: "",
              subtasks: [
                {
                  id: uuidv4(),
                  title: "Account page",
                  isCompleted: false,
                },
                {
                  id: uuidv4(),
                  title: "Billing page",
                  isCompleted: false,
                },
              ],
            },
          ],
        },
        {
          id: uuidv4(),
          name: "Doing",
          tasks: [
            {
              id: uuidv4(),
              title: "Design settings and search pages",
              description: "",
              subtasks: [
                {
                  id: uuidv4(),
                  title: "Settings - Account page",
                  isCompleted: true,
                },
                {
                  id: uuidv4(),
                  title: "Settings - Billing page",
                  isCompleted: true,
                },
                {
                  id: uuidv4(),
                  title: "Search page",
                  isCompleted: false,
                },
              ],
            },
            {
              id: uuidv4(),
              title: "Add account management endpoints",
              description: "",
              subtasks: [
                {
                  id: uuidv4(),
                  title: "Upgrade plan",
                  isCompleted: true,
                },
                {
                  id: uuidv4(),
                  title: "Cancel plan",
                  isCompleted: true,
                },
                {
                  id: uuidv4(),
                  title: "Update payment method",
                  isCompleted: false,
                },
              ],
            },
          ],
        },
        {
          id: uuidv4(),
          name: "Done",
          tasks: [
            {
              id: uuidv4(),
              title: "Conduct 5 wireframe tests",
              description: "Ensure the layout works for all screen sizes",
              subtasks: [
                {
                  id: uuidv4(),
                  title: "Complete 5 wireframe prototype tests",
                  isCompleted: true,
                },
              ],
            },
            {
              id: uuidv4(),
              title: "Create wireframe prototype",
              description: "Create a grayscale clickable wireframe prototype",
              subtasks: [
                {
                  id: uuidv4(),
                  title: "Create clickable wireframe prototype in Figma",
                  isCompleted: true,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: uuidv4(),
      name: "Marketing Plan",
      columns: [
        {
          id: uuidv4(),
          name: "Todo",
          tasks: [
            {
              id: uuidv4(),
              title: "Plan product hunt launch",
              description: "",
              subtasks: [
                {
                  id: uuidv4(),
                  title: "Find hunter",
                  isCompleted: false,
                },
                {
                  id: uuidv4(),
                  title: "Gather assets",
                  isCompleted: false,
                },
                {
                  id: uuidv4(),
                  title: "Draft product page",
                  isCompleted: false,
                },
              ],
            },
          ],
        },
        {
          id: uuidv4(),
          name: "Doing",
          tasks: [],
        },
        {
          id: uuidv4(),
          name: "Done",
          tasks: [],
        },
      ],
    },
  ]
}

