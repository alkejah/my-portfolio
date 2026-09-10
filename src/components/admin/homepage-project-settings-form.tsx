"use client"

import {
  useState,
} from "react"
import {
  Save,
} from "lucide-react"
import {
  useRouter,
} from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type {
  ApiResponse,
} from "@/types/api"

type HomepageProjectSettingsFormProps = {
  initialLimit: number
}

export function HomepageProjectSettingsForm({
  initialLimit,
}: HomepageProjectSettingsFormProps) {
  const router =
    useRouter()

  const [
    homepageProjectLimit,
    setHomepageProjectLimit,
  ] =
    useState(
      String(
        initialLimit
      )
    )

  const [
    pending,
    setPending,
  ] =
    useState(false)

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null
    )

  const [
    success,
    setSuccess,
  ] =
    useState<string | null>(
      null
    )

  async function handleSubmit(
    event:
      React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setPending(true)
    setError(null)
    setSuccess(null)

    try {
      const response =
        await fetch(
          "/api/admin/settings/homepage",
          {
            method:
              "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                homepageProjectLimit:
                  Number(
                    homepageProjectLimit
                  ),
              }),
          }
        )

      const data =
        (await response.json()) as ApiResponse<{
          homepageProjectLimit:
            number
        }>

      if (
        response.status ===
        401
      ) {
        router.replace(
          "/admin/login"
        )

        router.refresh()

        return
      }

      if (!data.success) {
        setError(
          data.message
        )

        return
      }

      setHomepageProjectLimit(
        String(
          data.data
            .homepageProjectLimit
        )
      )

      setSuccess(
        "Homepage project settings saved."
      )

      router.refresh()
    } catch {
      setError(
        "Unable to update the homepage settings."
      )
    } finally {
      setPending(false)
    }
  }

  return (
    <form
      onSubmit={
        handleSubmit
      }
      className="max-w-xl space-y-6 rounded-xl border bg-card p-5 sm:p-6"
    >
      <div className="space-y-2">
        <Label htmlFor="homepage-project-limit">
          Homepage project
          count
        </Label>

        <Input
          id="homepage-project-limit"
          type="number"
          min={1}
          max={12}
          step={1}
          value={
            homepageProjectLimit
          }
          onChange={(
            event
          ) =>
            setHomepageProjectLimit(
              event.target
                .value
            )
          }
          disabled={
            pending
          }
          required
        />

        <p className="text-sm leading-6 text-muted-foreground">
          Controls the
          maximum number of
          published projects
          included in the
          homepage carousel.
          Enter a value from 1
          to 12.
        </p>
      </div>

      {error ? (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </div>
      ) : null}

      {success ? (
        <div
          role="status"
          className="rounded-lg border bg-muted/50 px-4 py-3 text-sm"
        >
          {success}
        </div>
      ) : null}

      <Button
        type="submit"
        disabled={
          pending
        }
      >
        <Save className="size-4" />

        {pending
          ? "Saving..."
          : "Save Settings"}
      </Button>
    </form>
  )
}