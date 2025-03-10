"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LayoutDashboard, Plus, ChevronLeft, ChevronRight, Sun, Moon } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "next-themes"

interface SidebarProps {
  isOpen: boolean
  toggleSidebar: () => void
}

export function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const { boards, activeBoard, setActiveBoard, openCreateBoardDialog } = useStore()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // useEffect only runs on the client, so we need to protect against
  // rendering the toggle with the wrong theme while the page is
  // being server-side rendered
  useState(() => {
    setMounted(true)
  })

  if (!mounted) {
    return null
  }

  return (
    <div
      className={cn("h-full border-r bg-background transition-all duration-300 flex flex-col", isOpen ? "w-64" : "w-0")}
    >
      {isOpen && (
        <>
          <div className="p-4 border-b">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <LayoutDashboard className="h-6 w-6" />
              <span>Kanban</span>
            </h1>
          </div>

          <div className="flex-1 overflow-auto">
            <div className="p-4">
              <h2 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
                All Boards ({boards.length})
              </h2>

              <ScrollArea className="h-[calc(100vh-250px)]">
                <div className="space-y-1">
                  {boards.map((board) => (
                    <Button
                      key={board.id}
                      variant={activeBoard === board.id ? "secondary" : "ghost"}
                      className={cn("w-full justify-start", activeBoard === board.id && "font-bold")}
                      onClick={() => setActiveBoard(board.id)}
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      {board.name}
                    </Button>
                  ))}

                  <Button variant="ghost" className="w-full justify-start text-primary" onClick={openCreateBoardDialog}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Board
                  </Button>
                </div>
              </ScrollArea>
            </div>
          </div>

          <div className="p-4 border-t">
            <div className="bg-muted rounded-md p-3 flex items-center justify-between">
              <Sun className="h-4 w-4" />
              <Switch
                checked={theme === "dark"}
                onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
              />
              <Moon className="h-4 w-4" />
            </div>

            <Button variant="ghost" className="w-full justify-start mt-4" onClick={toggleSidebar}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Hide Sidebar
            </Button>
          </div>
        </>
      )}

      {!isOpen && (
        <Button
          variant="secondary"
          size="icon"
          className="absolute bottom-4 left-4 rounded-full"
          onClick={toggleSidebar}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

