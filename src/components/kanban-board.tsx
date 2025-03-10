"use client"

import { useState, useEffect } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Sidebar } from "@/components/sidebar"
import { BoardContent } from "@/components/board-content"
import { useStore } from "@/lib/store"
import { CreateBoardDialog } from "@/components/dialogs/create-board-dialog"
import { EditBoardDialog } from "@/components/dialogs/edit-board-dialog"
import { CreateTaskDialog } from "@/components/dialogs/create-task-dialog"
import { EditTaskDialog } from "@/components/dialogs/edit-task-dialog"
import { DeleteBoardDialog } from "@/components/dialogs/delete-board-dialog"
import { DeleteTaskDialog } from "@/components/dialogs/delete-task-dialog"
import { ViewTaskDialog } from "@/components/dialogs/view-task-dialog"
import { MobileHeader } from "@/components/mobile-header"

export function KanbanBoard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const isDesktop = useMediaQuery("(min-width: 1024px)")
  const { boards, activeBoard, setActiveBoard, initializeStore } = useStore()

  useEffect(() => {
    initializeStore()
  }, [initializeStore])

  useEffect(() => {
    if (!isDesktop) {
      setSidebarOpen(false)
    }
  }, [isDesktop])

  useEffect(() => {
    if (boards.length > 0 && !activeBoard) {
      setActiveBoard(boards[0].id)
    }
  }, [boards, activeBoard, setActiveBoard])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {isDesktop ? <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} /> : null}

      <div className="flex flex-col flex-1 overflow-hidden">
        {!isDesktop && <MobileHeader toggleSidebar={toggleSidebar} />}
        <BoardContent sidebarOpen={sidebarOpen} />
      </div>

      {/* Dialogs */}
      <CreateBoardDialog />
      <EditBoardDialog />
      <CreateTaskDialog />
      <EditTaskDialog />
      <DeleteBoardDialog />
      <DeleteTaskDialog />
      <ViewTaskDialog />
    </div>
  )
}

