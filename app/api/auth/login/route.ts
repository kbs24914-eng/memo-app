import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import {
  createSessionToken,
  sessionCookieOptions,
  verifyPassword,
} from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = String(body.email ?? "")
      .trim()
      .toLowerCase()
    const password = String(body.password ?? "")

    if (!email || !password) {
      return NextResponse.json(
        { error: "이메일과 비밀번호를 입력해 주세요." },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !(await verifyPassword(password, user.password))) {
      return NextResponse.json(
        { error: "이메일 또는 비밀번호가 올바르지 않습니다." },
        { status: 401 }
      )
    }

    const token = await createSessionToken(user.id)
    const response = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name },
    })
    response.cookies.set(sessionCookieOptions(token))
    return response
  } catch {
    return NextResponse.json(
      { error: "로그인 처리 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}
