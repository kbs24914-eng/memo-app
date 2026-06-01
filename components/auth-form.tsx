"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { StickyNote } from "lucide-react"

type AuthMode = "login" | "register"

interface AuthFormProps {
  mode: AuthMode
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const isRegister = mode === "register"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch(
        isRegister ? "/api/auth/register" : "/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            isRegister ? { email, password, name: name || undefined } : { email, password }
          ),
        }
      )

      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "요청에 실패했습니다.")
        return
      }

      router.push("/")
      router.refresh()
    } catch {
      setError("네트워크 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 p-2 bg-primary rounded-xl w-fit">
            <StickyNote className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">
            {isRegister ? "회원가입" : "로그인"}
          </CardTitle>
          <CardDescription>
            {isRegister
              ? "계정을 만들고 메모를 저장하세요"
              : "계정으로 메모에 접속하세요"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {isRegister && (
              <div className="space-y-2">
                <Label htmlFor="name">이름 (선택)</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="홍길동"
                  autoComplete="name"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isRegister ? "6자 이상" : "비밀번호"}
                required
                minLength={isRegister ? 6 : undefined}
                autoComplete={isRegister ? "new-password" : "current-password"}
              />
            </div>
            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? "처리 중..."
                : isRegister
                  ? "가입하기"
                  : "로그인"}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              {isRegister ? (
                <>
                  이미 계정이 있으신가요?{" "}
                  <Link href="/login" className="text-primary hover:underline">
                    로그인
                  </Link>
                </>
              ) : (
                <>
                  계정이 없으신가요?{" "}
                  <Link
                    href="/register"
                    className="text-primary hover:underline"
                  >
                    회원가입
                  </Link>
                </>
              )}
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
