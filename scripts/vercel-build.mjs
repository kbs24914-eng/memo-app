import { execSync } from "node:child_process"

function run(command) {
  execSync(command, { stdio: "inherit" })
}

run("npx prisma generate")

if (process.env.DATABASE_URL) {
  run("npx prisma db push")
} else {
  console.warn(
    "DATABASE_URL is not set. Skipping prisma db push. Add Neon on Vercel and redeploy."
  )
}

run("npx next build")
