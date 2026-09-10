"use client"

import { Trash2 } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"

type DeleteProjectButtonProps = {
  projectId: string
  projectTitle: string
}

type ErrorResponse = {
  success: false
  message: string
}

export function DeleteProjectButton({
  projectId,
  projectTitle,
}: DeleteProjectButtonProps) {
  const router = useRouter()

  const [pending, setPending] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${projectTitle}"?\n\nThis action cannot be undone.`
    )

    if (!confirmed) {
      return
    }

    setPending(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/projects/${projectId}`,
        {
          method: "DELETE",
        }
      )

      if (!response.ok) {
        const data =
          (await response.json()) as ErrorResponse

        setError(
          data.message ||
            "Unable to delete project."
        )

        return
      }

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
    <div className="space-y-1">
      <Button
        type="button"
        variant="destructive"
        size="sm"
        disabled={pending}
        onClick={handleDelete}
      >
        <Trash2 className="size-4" />

        {pending
          ? "Deleting..."
          : "Delete"}
      </Button>

      {error ? (
        <p
          role="alert"
          className="max-w-48 text-xs text-destructive"
        >
          {error}
        </p>
      ) : null}
    </div>
  )
}