"use client"

import { useStore } from "@/store/store"
import { Button } from "@/components/ui/button"

export function EmptyBoard() {
  const { openEditBoardDialog } = useStore()

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center">
      <p className="text-muted-foreground mb-4">This board is empty. Add a new column to get started.</p>
      <Button onClick={openEditBoardDialog}>+ Add New Column</Button>
    </div>
  )
}

