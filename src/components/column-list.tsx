"use client"

import { useStore } from "@/lib/store"
import { Column } from "@/components/column"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { useState } from "react"
import { TaskCard } from "@/components/task-card"
import type { Task } from "@/lib/types"

export function ColumnList() {
  const { boards, activeBoard, openEditBoardDialog, moveTask } = useStore()
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const currentBoard = boards.find((board) => board.id === activeBoard)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const taskId = active.id as string

    // Find the task that is being dragged
    if (currentBoard) {
      for (const column of currentBoard.columns) {
        const task = column.tasks.find((t) => t.id === taskId)
        if (task) {
          setActiveTask(task)
          break
        }
      }
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const taskId = active.id as string
      const columnId = over.id as string

      moveTask(taskId, columnId)
    }

    setActiveTask(null)
  }

  if (!currentBoard) return null

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 h-full">
        {currentBoard.columns.map((column) => (
          <Column key={column.id} column={column} />
        ))}

        <Button
          variant="outline"
          className="min-w-[280px] h-full border-dashed flex flex-col items-center justify-center text-muted-foreground"
          onClick={openEditBoardDialog}
        >
          <Plus className="h-5 w-5 mb-2" />
          Add New Column
        </Button>

        <DragOverlay>{activeTask ? <TaskCard task={activeTask} isDragging /> : null}</DragOverlay>
      </div>
    </DndContext>
  )
}

