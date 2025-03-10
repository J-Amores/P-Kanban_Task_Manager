"use client"

import { useState, useEffect } from "react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react"
import type { Task } from "@/lib/types"

export function ViewTaskDialog() {
  const {
    viewTaskDialogOpen,
    closeViewTaskDialog,
    boards,
    activeBoard,
    taskToView,
    updateTaskStatus,
    toggleSubtask,
    openEditTaskDialog,
    openDeleteTaskDialog,
  } = useStore()

  const [status, setStatus] = useState("")
  const [task, setTask] = useState<Task | null>(null)

  const currentBoard = boards.find((board) => board.id === activeBoard)
  const columns = currentBoard?.columns || []

  // Find the task to view
  const findTask = (): Task | undefined => {
    if (!currentBoard || !taskToView) return undefined

    for (const column of currentBoard.columns) {
      const task = column.tasks.find((t) => t.id === taskToView)
      if (task) return task
    }

    return undefined
  }

  useEffect(() => {
    if (viewTaskDialogOpen && taskToView) {
      const foundTask = findTask()
      if (foundTask) {
        setTask(foundTask)

        // Find the column that contains this task
        for (const column of columns) {
          if (column.tasks.some((t) => t.id === foundTask.id)) {
            setStatus(column.id)
            break
          }
        }
      }
    }
  }, [viewTaskDialogOpen, taskToView, columns])

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus)
    if (task) {
      updateTaskStatus(task.id, newStatus)
    }
  }

  const handleSubtaskToggle = (subtaskId: string) => {
    if (task) {
      toggleSubtask(task.id, subtaskId)

      // Update the local task state to reflect the change
      setTask({
        ...task,
        subtasks: task.subtasks.map((st) => (st.id === subtaskId ? { ...st, isCompleted: !st.isCompleted } : st)),
      })
    }
  }

  const handleEdit = () => {
    closeViewTaskDialog()
    openEditTaskDialog(taskToView!)
  }

  const handleDelete = () => {
    closeViewTaskDialog()
    openDeleteTaskDialog(taskToView!)
  }

  const handleClose = () => {
    closeViewTaskDialog()
  }

  if (!task) return null

  const completedSubtasks = task.subtasks.filter((st) => st.isCompleted).length
  const totalSubtasks = task.subtasks.length

  return (
    <Dialog open={viewTaskDialogOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle>{task.title}</DialogTitle>
            {task.description && <DialogDescription className="mt-2">{task.description}</DialogDescription>}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEdit}>Edit Task</DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                Delete Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {task.subtasks.length > 0 && (
            <div className="grid gap-2">
              <Label>
                Subtasks ({completedSubtasks} of {totalSubtasks})
              </Label>
              <div className="space-y-2">
                {task.subtasks.map((subtask) => (
                  <div key={subtask.id} className="flex items-center space-x-2 rounded-md border p-3 bg-muted/50">
                    <Checkbox
                      id={subtask.id}
                      checked={subtask.isCompleted}
                      onCheckedChange={() => handleSubtaskToggle(subtask.id)}
                    />
                    <label
                      htmlFor={subtask.id}
                      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                        subtask.isCompleted ? "line-through text-muted-foreground" : ""
                      }`}
                    >
                      {subtask.title}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="status">Current Status</Label>
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                {columns.map((column) => (
                  <SelectItem key={column.id} value={column.id}>
                    {column.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

