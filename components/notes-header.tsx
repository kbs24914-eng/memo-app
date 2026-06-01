"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, StickyNote, LogOut } from "lucide-react"

interface NotesHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  totalNotes: number
  userEmail?: string | null
  onLogout?: () => void
}

export function NotesHeader({
  searchQuery,
  onSearchChange,
  totalNotes,
  userEmail,
  onLogout,
}: NotesHeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl">
              <StickyNote className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">메모</h1>
              <p className="text-sm text-muted-foreground">
                {totalNotes}개의 메모
                {userEmail && (
                  <span className="hidden sm:inline"> · {userEmail}</span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="메모 검색..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 bg-card"
              />
            </div>
            {onLogout && (
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="shrink-0 gap-1"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">로그아웃</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
