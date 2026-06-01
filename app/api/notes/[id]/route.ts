import { NextResponse } from "next/server"
import { getSessionUserId } from "@/lib/auth"
import { toNoteResponse } from "@/lib/notes"
import { prisma } from "@/lib/prisma"

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, context: RouteContext) {
  const userId = await getSessionUserId()
  if (!userId) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 })
  }

  const { id } = await context.params
  const existing = await prisma.note.findFirst({
    where: { id, userId },
  })

  if (!existing) {
    return NextResponse.json({ error: "메모를 찾을 수 없습니다." }, { status: 404 })
  }

  try {
    const body = await request.json()
    const note = await prisma.note.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: String(body.title) }),
        ...(body.content !== undefined && { content: String(body.content) }),
        ...(body.color !== undefined && { color: String(body.color) }),
        ...(body.pinned !== undefined && { pinned: Boolean(body.pinned) }),
      },
    })

    return NextResponse.json({ note: toNoteResponse(note) })
  } catch {
    return NextResponse.json(
      { error: "메모 수정 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const userId = await getSessionUserId()
  if (!userId) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 })
  }

  const { id } = await context.params
  const existing = await prisma.note.findFirst({
    where: { id, userId },
  })

  if (!existing) {
    return NextResponse.json({ error: "메모를 찾을 수 없습니다." }, { status: 404 })
  }

  await prisma.note.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
