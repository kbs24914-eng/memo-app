"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Trash2, Edit2, Check, X, Pin, PinOff } from "lucide-react"

export interface Note {
  id: string
  title: string
  content: string
  color: string
  pinned: boolean
  createdAt: Date
  updatedAt: Date
}

interface NoteCardProps {
  note: Note
  onUpdate: (id: string, updates: Partial<Note>) => void
  onDelete: (id: string) => void
}

const colorClasses: Record<string, string> = {
  yellow: "bg-[oklch(0.95_0.12_95)] border-[oklch(0.88_0.15_90)]",
  pink: "bg-[oklch(0.95_0.08_350)] border-[oklch(0.88_0.12_350)]",
  blue: "bg-[oklch(0.95_0.06_240)] border-[oklch(0.88_0.1_240)]",
  green: "bg-[oklch(0.95_0.08_145)] border-[oklch(0.88_0.12_145)]",
  orange: "bg-[oklch(0.95_0.1_65)] border-[oklch(0.88_0.14_65)]",
}

export function NoteCard({ note, onUpdate, onDelete }: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(note.title)
  const [editContent, setEditContent] = useState(note.content)

  const handleSave = () => {
    onUpdate(note.id, {
      title: editTitle,
      content: editContent,
      updatedAt: new Date(),
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditTitle(note.title)
    setEditContent(note.content)
    setIsEditing(false)
  }

  const togglePin = () => {
    onUpdate(note.id, { pinned: !note.pinned })
  }

  return (
    <Card
      className={`group relative transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-2 ${
        colorClasses[note.color] || colorClasses.yellow
      }`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          {isEditing ? (
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="font-semibold text-lg bg-white/50"
              placeholder="제목"
            />
          ) : (
            <h3 className="font-semibold text-lg text-foreground line-clamp-1 flex-1">
              {note.title || "제목 없음"}
            </h3>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 opacity-60 hover:opacity-100"
            onClick={togglePin}
          >
            {note.pinned ? (
              <Pin className="h-4 w-4 fill-current" />
            ) : (
              <PinOff className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        {isEditing ? (
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="min-h-[100px] bg-white/50 resize-none"
            placeholder="메모 내용을 입력하세요..."
          />
        ) : (
          <p className="text-muted-foreground whitespace-pre-wrap line-clamp-6">
            {note.content || "내용 없음"}
          </p>
        )}
      </CardContent>
      <CardFooter className="pt-2 flex justify-between items-center">
        <span className="text-xs text-muted-foreground">
          {note.updatedAt.toLocaleDateString("ko-KR", {
            month: "short",
            day: "numeric",
          })}
        </span>
        <div className="flex gap-1">
          {isEditing ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-100"
                onClick={handleSave}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={handleCancel}
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                onClick={() => onDelete(note.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
