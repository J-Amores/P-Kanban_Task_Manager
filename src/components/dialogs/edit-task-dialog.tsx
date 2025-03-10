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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X } from "lucide-react"
import type { Task } from "@/lib/types"

export function EditTaskDialog() {
  const { editTaskDialogOpen, closeEditTaskDialog, boards, activeBoard, taskToEdit, updateTask } = useStore()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState("")
  const [subtasks, setSubtasks] = useState<{ id?: string; title: string; isCompleted?: boolean }[]>([])
  const [error, setError] = useState("")

  const currentBoard = boards.find((board) => board.id === activeBoard)
  const columns = currentBoard?.columns || []

  // Find the task to edit
  const findTask = (): Task | undefined => {
    if (!currentBoard || !taskToEdit) return undefined

    for (const column of currentBoard.columns) {
      const task = column.tasks.find((t) => t.id === taskToEdit)
      if (task) return task
    }

    return undefined
  }

  useEffect(() => {
    if (editTaskDialogOpen && taskToEdit) {
      const task = findTask()
      if (task) {
        setTitle(task.title)
        setDescription(task.description || "")

        // Find the column that contains this task
        for (const column of columns) {
          if (column.tasks.some((t) => t.id === task.id)) {
            setStatus(column.id)
            break
          }
        }

        setSubtasks(
          task.subtasks.map((st) => ({
            id: st.id,
            title: st.title,
            isCompleted: st.isCompleted,
          })),
        )
      }
    }
  }, [editTaskDialogOpen, taskToEdit, columns])

  const handleAddSubtask = () => {
    setSubtasks([...subtasks, { title: "" }])
  }

  const handleRemoveSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index))
  }

  const handleSubtaskChange = (index: number, value: string) => {
    const newSubtasks = [...subtasks]
    newSubtasks[index].title = value
    setSubtasks(newSubtasks)
  }

  const handleSubmit = () => {
    if (!title.trim()) {
      setError("Task title is required")
      return
    }

    if (!status) {
      setError("Status is required")
      return
    }

    if (subtasks.some((subtask) => subtask.title.trim() === "")) {
      setError("All subtasks must have a title")
      return
    }

    updateTask(taskToEdit!, title, description, status, subtasks)
    handleClose()
  }

  const handleClose = () => {
    setError("")
    closeEditTaskDialog()
  }

  return (
    <Dialog open={editTaskDialogOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>Make changes to your task here.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Take coffee break"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little."
              rows={3}
            />
          </div>
          <div className="grid gap-2">
            <Label>Subtasks</Label>
            {subtasks.map((subtask, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={subtask.title}
                  onChange={(e) => handleSubtaskChange(index, e.target.value)}
                  placeholder="e.g. Make coffee"
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveSubtask(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" className="mt-2" onClick={handleAddSubtask}>
              <Plus className="h-4 w-4 mr-2" /> Add New Subtask
            </Button>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
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
          {error && <p className="text-destructive text-sm">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

