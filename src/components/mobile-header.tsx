import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Sidebar } from "@/components/sidebar"

interface MobileHeaderProps {
  toggleSidebar: () => void
}

export function MobileHeader({ toggleSidebar }: MobileHeaderProps) {
  const { boards, activeBoard } = useStore()
  const currentBoard = boards.find((board) => board.id === activeBoard)

  return (
    <header className="border-b p-4 flex items-center gap-2 lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <Sidebar isOpen={true} toggleSidebar={toggleSidebar} />
        </SheetContent>
      </Sheet>

      <div className="flex items-center gap-2">
        <LayoutDashboard className="h-5 w-5" />
        <h1 className="font-bold">{currentBoard?.name || "Kanban"}</h1>
      </div>
    </header>
  )
}

