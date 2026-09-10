"use client"

import type { FormEvent } from "react"
import { Send } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ApiResponse } from "@/types/api"

type ContactFormValues = {
  name: string
  email: string
  subject: string
  message: string
  website: string
}

const emptyForm: ContactFormValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
  website: "",
}

const textareaClassName =
  "flex min-h-28 w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"

export function ContactForm() {
  const [form, setForm] =
    useState<ContactFormValues>(
      emptyForm
    )

  const [
    startedAt,
    setStartedAt,
  ] =
    useState(() => Date.now())

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

  const [
    fieldErrors,
    setFieldErrors,
  ] =
    useState<
      Record<string, string>
    >({})

  function updateField(
    field:
      keyof ContactFormValues,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setPending(true)
    setError(null)
    setSuccess(null)
    setFieldErrors({})

    try {
      const response =
        await fetch(
          "/api/contact",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                ...form,
                startedAt,
              }),
          }
        )

      const data =
        (await response.json()) as ApiResponse<{
          message: string
          id?: string
        }>

      if (!data.success) {
        if (data.issues) {
          const errors =
            Object.fromEntries(
              data.issues.map(
                (issue) => [
                  issue.path,
                  issue.message,
                ]
              )
            )

          setFieldErrors(
            errors
          )
        }

        setError(data.message)

        return
      }

      setSuccess(
        data.data.message
      )

      setForm(emptyForm)

      setStartedAt(
        Date.now()
      )
    } catch {
      setError(
        "Unable to connect to the server. Please try again."
      )
    } finally {
      setPending(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border bg-card p-4 sm:p-5"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="contact-name">
            Name
          </Label>

          <Input
            id="contact-name"
            value={form.name}
            onChange={(event) =>
              updateField(
                "name",
                event.target.value
              )
            }
            placeholder="Your name"
            autoComplete="name"
            maxLength={80}
            required
            disabled={pending}
            aria-invalid={Boolean(
              fieldErrors.name
            )}
          />

          {fieldErrors.name ? (
            <p
              role="alert"
              className="text-xs text-destructive"
            >
              {fieldErrors.name}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="contact-email">
            Email
          </Label>

          <Input
            id="contact-email"
            type="email"
            value={form.email}
            onChange={(event) =>
              updateField(
                "email",
                event.target.value
              )
            }
            placeholder="you@example.com"
            autoComplete="email"
            maxLength={200}
            required
            disabled={pending}
            aria-invalid={Boolean(
              fieldErrors.email
            )}
          />

          {fieldErrors.email ? (
            <p
              role="alert"
              className="text-xs text-destructive"
            >
              {fieldErrors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="contact-subject">
          Subject
        </Label>

        <Input
          id="contact-subject"
          value={form.subject}
          onChange={(event) =>
            updateField(
              "subject",
              event.target.value
            )
          }
          placeholder="Project inquiry"
          maxLength={120}
          required
          disabled={pending}
          aria-invalid={Boolean(
            fieldErrors.subject
          )}
        />

        {fieldErrors.subject ? (
          <p
            role="alert"
            className="text-xs text-destructive"
          >
            {fieldErrors.subject}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="contact-message">
          Message
        </Label>

        <textarea
          id="contact-message"
          value={form.message}
          onChange={(event) =>
            updateField(
              "message",
              event.target.value
            )
          }
          placeholder="Tell me about your project, idea, or opportunity..."
          minLength={20}
          maxLength={3000}
          required
          disabled={pending}
          aria-invalid={Boolean(
            fieldErrors.message
          )}
          className={
            textareaClassName
          }
        />

        <div className="flex justify-between gap-4">
          {fieldErrors.message ? (
            <p
              role="alert"
              className="text-xs text-destructive"
            >
              {
                fieldErrors.message
              }
            </p>
          ) : (
            <span />
          )}

          <p className="text-xs text-muted-foreground">
            {form.message.length}
            /3000
          </p>
        </div>
      </div>

      {/* Honeypot */}
      <div
        aria-hidden="true"
        className="absolute -left-[10000px] top-auto size-px overflow-hidden"
      >
        <label htmlFor="contact-website">
          Website
        </label>

        <input
          id="contact-website"
          type="text"
          value={form.website}
          onChange={(event) =>
            updateField(
              "website",
              event.target.value
            )
          }
          autoComplete="off"
          tabIndex={-1}
        />
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
        size="lg"
        disabled={pending}
        className="w-full sm:w-auto"
      >
        <Send className="size-4" />

        {pending
          ? "Sending..."
          : "Send Message"}
      </Button>
    </form>
  )
}