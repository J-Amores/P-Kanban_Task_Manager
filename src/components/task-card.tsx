"use client"

import { useStore } from "@/lib/store"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Task } from "@/lib/types"
import { useDraggable } from "@dnd-kit/core"

interface TaskCardProps {
  task: Task
  isDragging?: boolean
}

export function TaskCard({ task, isDragging = false }: TaskCardProps) {
  const { openViewTaskDialog } = useStore()
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  })

  const completedSubtasks = task.subtasks.filter((subtask) => subtask.isCompleted).length
  const totalSubtasks = task.subtasks.length

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 999,
      }
    : undefined

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn("cursor-pointer shadow-sm hover:shadow transition-shadow", isDragging && "opacity-50")}
      onClick={() => openViewTaskDialog(task.id)}
      {...attributes}
      {...listeners}
    >
      <CardContent className="p-4">
        <h3 className="font-semibold mb-2">{task.title}</h3>
        {totalSubtasks > 0 && (
          <p className="text-sm text-muted-foreground">
            {completedSubtasks} of {totalSubtasks} subtasks
          </p>
        )}
      </CardContent>
    </Card>
  )
}

