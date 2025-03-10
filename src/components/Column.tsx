"use client"
import { TaskCard } from "@/components/task-card"
import { useDroppable } from "@dnd-kit/core"
import { cn } from "@/lib/utils"
import type { ColumnType } from "@/lib/types"

interface ColumnProps {
  column: ColumnType
}

export function Column({ column }: ColumnProps) {
  const { setDroppableId } = useDroppable({
    id: column.id,
  })

  return (
    <div ref={setDroppableId} className="min-w-[280px] flex flex-col">
      <div className="mb-3 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-primary" />
        <h3 className="font-semibold uppercase text-sm text-muted-foreground">
          {column.name} ({column.tasks.length})
        </h3>
      </div>

      <div className={cn("flex-1 flex flex-col gap-4 min-h-[200px] p-2 rounded-md", "transition-colors duration-200")}>
        {column.tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  )
}

