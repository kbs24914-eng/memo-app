"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { NoteCard, type Note } from "@/components/note-card"
import { CreateNoteDialog } from "@/components/create-note-dialog"
import { NotesHeader } from "@/components/notes-header"
import { EmptyState } from "@/components/empty-state"
import { Pin } from "lucide-react"

function parseNote(raw: {
  id: string
  title: string
  content: string
  color: string
  pinned: boolean
  createdAt: string
  updatedAt: string
}): Note {
  return {
    ...raw,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
  }
}

export default function NotesApp() {
  const router = useRouter()
  const [notes, setNotes] = useState<Note[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    const [meRes, notesRes] = await Promise.all([
      fetch("/api/auth/me"),
      fetch("/api/notes"),
    ])

    if (meRes.ok) {
      const meData = await meRes.json()
      setUserEmail(meData.user.email)
    }

    if (notesRes.ok) {
      const notesData = await notesRes.json()
      setNotes(notesData.notes.map(parseNote))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes

    const query = searchQuery.toLowerCase()
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
    )
  }, [notes, searchQuery])

  const { pinnedNotes, unpinnedNotes } = useMemo(() => {
    const pinned = filteredNotes.filter((note) => note.pinned)
    const unpinned = filteredNotes.filter((note) => !note.pinned)
    return { pinnedNotes: pinned, unpinnedNotes: unpinned }
  }, [filteredNotes])

  const handleCreateNote = async (
    noteData: Omit<Note, "id" | "createdAt" | "updatedAt">
  ) => {
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(noteData),
    })

    if (res.ok) {
      const data = await res.json()
      setNotes((prev) => [parseNote(data.note), ...prev])
    }
  }

  const handleUpdateNote = async (id: string, updates: Partial<Note>) => {
    const res = await fetch(`/api/notes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })

    if (res.ok) {
      const data = await res.json()
      const updated = parseNote(data.note)
      setNotes((prev) =>
        prev.map((note) => (note.id === id ? updated : note))
      )
    }
  }

  const handleDeleteNote = async (id: string) => {
    const res = await fetch(`/api/notes/${id}`, { method: "DELETE" })
    if (res.ok) {
      setNotes((prev) => prev.filter((note) => note.id !== id))
    }
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
    router.refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">불러오는 중...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <NotesHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalNotes={notes.length}
        userEmail={userEmail}
        onLogout={handleLogout}
      />

      <main className="max-w-6xl mx-auto px-4 py-6">
        {filteredNotes.length === 0 ? (
          <EmptyState isSearching={searchQuery.trim().length > 0} />
        ) : (
          <div className="space-y-8">
            {pinnedNotes.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Pin className="h-4 w-4 text-muted-foreground fill-current" />
                  <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    고정됨
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {pinnedNotes.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onUpdate={handleUpdateNote}
                      onDelete={handleDeleteNote}
                    />
                  ))}
                </div>
              </section>
            )}

            {unpinnedNotes.length > 0 && (
              <section>
                {pinnedNotes.length > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      기타
                    </h2>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {unpinnedNotes.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onUpdate={handleUpdateNote}
                      onDelete={handleDeleteNote}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      <div className="fixed bottom-6 right-6">
        <CreateNoteDialog onCreate={handleCreateNote} />
      </div>
    </div>
  )
}
