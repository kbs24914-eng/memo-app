"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Plus, Check } from "lucide-react"
import type { Note } from "./note-card"

interface CreateNoteDialogProps {
  onCreate: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => void
}

const colorOptions = [
  { id: "yellow", label: "노랑", class: "bg-[oklch(0.92_0.14_95)]" },
  { id: "pink", label: "분홍", class: "bg-[oklch(0.92_0.1_350)]" },
  { id: "blue", label: "파랑", class: "bg-[oklch(0.92_0.08_240)]" },
  { id: "green", label: "초록", class: "bg-[oklch(0.92_0.1_145)]" },
  { id: "orange", label: "주황", class: "bg-[oklch(0.92_0.12_65)]" },
]

export function CreateNoteDialog({ onCreate }: CreateNoteDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [color, setColor] = useState("yellow")

  const handleCreate = () => {
    onCreate({
      title,
      content,
      color,
      pinned: false,
    })
    setTitle("")
    setContent("")
    setColor("yellow")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="rounded-full shadow-lg hover:shadow-xl transition-all duration-200 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-5 w-5" />
          새 메모
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl">새 메모 만들기</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              placeholder="메모 제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="content">내용</Label>
            <Textarea
              id="content"
              placeholder="메모 내용을 입력하세요..."
              className="min-h-[120px] resize-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>색상</Label>
            <div className="flex gap-2">
              {colorOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`w-8 h-8 rounded-full ${option.class} border-2 transition-all duration-200 flex items-center justify-center ${
                    color === option.id
                      ? "border-foreground scale-110"
                      : "border-transparent hover:scale-105"
                  }`}
                  onClick={() => setColor(option.id)}
                  title={option.label}
                >
                  {color === option.id && (
                    <Check className="h-4 w-4 text-foreground" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            취소
          </Button>
          <Button onClick={handleCreate} disabled={!content.trim()}>
            만들기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
