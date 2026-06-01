import { NextResponse } from "next/server"
import { getSessionUserId } from "@/lib/auth"
import { toNoteResponse } from "@/lib/notes"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const userId = await getSessionUserId()
  if (!userId) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 })
  }

  const notes = await prisma.note.findMany({
    where: { userId },
    orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }],
  })

  return NextResponse.json({ notes: notes.map(toNoteResponse) })
}

export async function POST(request: Request) {
  const userId = await getSessionUserId()
  if (!userId) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 })
  }

  try {
    const body = await request.json()
    const title = String(body.title ?? "")
    const content = String(body.content ?? "")
    const color = String(body.color ?? "yellow")
    const pinned = Boolean(body.pinned)

    if (!content.trim()) {
      return NextResponse.json(
        { error: "메모 내용을 입력해 주세요." },
        { status: 400 }
      )
    }

    const note = await prisma.note.create({
      data: {
        title,
        content,
        color,
        pinned,
        userId,
      },
    })

    return NextResponse.json({ note: toNoteResponse(note) }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "메모 생성 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}
