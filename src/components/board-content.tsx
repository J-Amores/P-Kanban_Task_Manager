"use client"

import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ColumnList } from "@/components/column-list"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react"
import { EmptyBoard } from "@/components/empty-board"

interface BoardContentProps {
  sidebarOpen: boolean
}

export function BoardContent({ sidebarOpen }: BoardContentProps) {
  const { boards, activeBoard, openCreateTaskDialog, openEditBoardDialog, openDeleteBoardDialog } = useStore()

  const currentBoard = boards.find((board) => board.id === activeBoard)
  const hasColumns = currentBoard?.columns.length > 0

  if (!currentBoard) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <p className="text-muted-foreground">No board selected or create a new board to get started.</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <header className="border-b p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">{currentBoard.name}</h1>

        <div className="flex items-center gap-2">
          <Button onClick={openCreateTaskDialog} disabled={!hasColumns} className="bg-primary text-primary-foreground">
            <Plus className="h-4 w-4 mr-1" /> Add New Task
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={openEditBoardDialog}>Edit Board</DropdownMenuItem>
              <DropdownMenuItem onClick={openDeleteBoardDialog} className="text-destructive">
                Delete Board
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex-1 overflow-x-auto p-4">{hasColumns ? <ColumnList /> : <EmptyBoard />}</div>
    </div>
  )
}

