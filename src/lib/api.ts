import { NextResponse } from "next/server"
import type { ZodError } from "zod"

export function apiError(
  message: string,
  status: number
) {
  return NextResponse.json(
    {
      success: false,
      message,
    },
    {
      status,
    }
  )
}

export function apiValidationError(
  error: ZodError
) {
  const issues = error.issues.map((issue) => ({
    path:
      issue.path.length > 0
        ? issue.path.map(String).join(".")
        : "root",
    message: issue.message,
  }))

  return NextResponse.json(
    {
      success: false,
      message: "Validation failed.",
      issues,
    },
    {
      status: 422,
    }
  )
}