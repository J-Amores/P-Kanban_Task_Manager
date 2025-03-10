"use client"

import { useStore } from "@/lib/store"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Task } from "@/lib/types"

export function DeleteTaskDialog() {
  const { deleteTaskDialogOpen, closeDeleteTaskDialog, boards, activeBoard, taskToDelete, deleteTask } = useStore()

  // Find the task to delete
  const findTask = (): Task | undefined => {
    if (!boards || !activeBoard || !taskToDelete) return undefined

    const currentBoard = boards.find((board) => board.id === activeBoard)
    if (!currentBoard) return undefined

    for (const column of currentBoard.columns) {
      const task = column.tasks.find((t) => t.id === taskToDelete)
      if (task) return task
    }

    return undefined
  }

  const task = findTask()

  const handleDelete = () => {
    deleteTask(taskToDelete!)
    closeDeleteTaskDialog()
  }

  const handleClose = () => {
    closeDeleteTaskDialog()
  }

  return (
    <AlertDialog open={deleteTaskDialogOpen} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">Delete this task?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the &quot;{task?.title}&quot; task and its subtasks? This action cannot be
            reversed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

