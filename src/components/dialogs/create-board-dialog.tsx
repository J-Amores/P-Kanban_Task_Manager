"use client"

import { useState } from "react"
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
import { Plus, X } from "lucide-react"

export function CreateBoardDialog() {
  const { createBoardDialogOpen, closeCreateBoardDialog, createBoard } = useStore()
  const [boardName, setBoardName] = useState("")
  const [columns, setColumns] = useState([{ name: "Todo" }, { name: "In Progress" }, { name: "Done" }])
  const [error, setError] = useState("")

  const handleAddColumn = () => {
    setColumns([...columns, { name: "" }])
  }

  const handleRemoveColumn = (index: number) => {
    setColumns(columns.filter((_, i) => i !== index))
  }

  const handleColumnNameChange = (index: number, value: string) => {
    const newColumns = [...columns]
    newColumns[index].name = value
    setColumns(newColumns)
  }

  const handleSubmit = () => {
    if (!boardName.trim()) {
      setError("Board name is required")
      return
    }

    if (columns.some((col) => !col.name.trim())) {
      setError("All columns must have a name")
      return
    }

    createBoard(
      boardName,
      columns.map((col) => col.name),
    )
    handleClose()
  }

  const handleClose = () => {
    setBoardName("")
    setColumns([{ name: "Todo" }, { name: "In Progress" }, { name: "Done" }])
    setError("")
    closeCreateBoardDialog()
  }

  return (
    <Dialog open={createBoardDialogOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Board</DialogTitle>
          <DialogDescription>Create a new board to organize your tasks.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Board Name</Label>
            <Input
              id="name"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              placeholder="e.g. Web Design Project"
            />
          </div>
          <div className="grid gap-2">
            <Label>Board Columns</Label>
            {columns.map((column, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={column.name}
                  onChange={(e) => handleColumnNameChange(index, e.target.value)}
                  placeholder="e.g. Todo"
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveColumn(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" className="mt-2" onClick={handleAddColumn}>
              <Plus className="h-4 w-4 mr-2" /> Add New Column
            </Button>
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create Board</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

