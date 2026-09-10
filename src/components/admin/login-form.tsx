"use client"

import {
  type FormEvent,
  useState,
} from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type ErrorResponse = {
  success: false
  message: string
}

export function LoginForm() {
  const router = useRouter()

  const [error, setError] =
    useState<string | null>(null)

  const [pending, setPending] =
    useState(false)

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setPending(true)
    setError(null)

    const formData = new FormData(
      event.currentTarget
    )

    const username = String(
      formData.get("username") ?? ""
    )

    const password = String(
      formData.get("password") ?? ""
    )

    try {
      const response = await fetch(
        "/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            username,
            password,
          }),
        }
      )

      if (!response.ok) {
        const data =
          (await response.json()) as ErrorResponse

        setError(
          data.message ||
            "Unable to sign in."
        )

        return
      }

      router.replace("/admin")
      router.refresh()
    } catch {
      setError(
        "Unable to connect to the server."
      )
    } finally {
      setPending(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div className="space-y-2">
        <Label htmlFor="username">
          Username
        </Label>

        <Input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          placeholder="Enter your username"
          disabled={pending}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">
          Password
        </Label>

        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          disabled={pending}
          required
        />
      </div>

      {error ? (
        <p
          className="text-sm text-destructive"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      ) : null}

      <Button
        type="submit"
        className="w-full"
        disabled={pending}
      >
        {pending
          ? "Signing in..."
          : "Sign in"}
      </Button>
    </form>
  )
}