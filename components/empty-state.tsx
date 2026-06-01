"use client"

import { FileText, Search } from "lucide-react"

interface EmptyStateProps {
  isSearching: boolean
}

export function EmptyState({ isSearching }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-4">
        {isSearching ? (
          <Search className="h-10 w-10 text-primary" />
        ) : (
          <FileText className="h-10 w-10 text-primary" />
        )}
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        {isSearching ? "검색 결과가 없어요" : "아직 메모가 없어요"}
      </h3>
      <p className="text-muted-foreground max-w-sm">
        {isSearching
          ? "다른 검색어로 다시 시도해보세요"
          : "새 메모 버튼을 눌러 첫 번째 메모를 작성해보세요!"}
      </p>
    </div>
  )
}
