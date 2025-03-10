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

export function DeleteBoardDialog() {
  const { deleteBoardDialogOpen, closeDeleteBoardDialog, boards, activeBoard, deleteBoard } = useStore()

  const currentBoard = boards.find((board) => board.id === activeBoard)

  const handleDelete = () => {
    deleteBoard(activeBoard!)
    closeDeleteBoardDialog()
  }

  const handleClose = () => {
    closeDeleteBoardDialog()
  }

  return (
    <AlertDialog open={deleteBoardDialogOpen} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">Delete this board?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the &quot;{currentBoard?.name}&quot; board? This action will remove all
            columns and tasks and cannot be reversed.
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

