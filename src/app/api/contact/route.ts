import { NextResponse } from "next/server"
import { Resend } from "resend"

import {
  apiError,
  apiValidationError,
} from "@/lib/api"
import { checkContactRateLimit } from "@/lib/contact/rate-limit"
import { contactFormSchema } from "@/lib/validations/contact"

export const runtime = "nodejs"

const MINIMUM_FORM_TIME_MS =
  2000

function getEmailConfig() {
  const apiKey =
    process.env.RESEND_API_KEY

  const to =
    process.env.CONTACT_TO_EMAIL

  const from =
    process.env.CONTACT_FROM_EMAIL

  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY is not configured."
    )
  }

  if (!to) {
    throw new Error(
      "CONTACT_TO_EMAIL is not configured."
    )
  }

  if (!from) {
    throw new Error(
      "CONTACT_FROM_EMAIL is not configured."
    )
  }

  return {
    apiKey,
    to,
    from,
  }
}

export async function POST(
  request: Request
) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return apiError(
      "Request body must contain valid JSON.",
      400
    )
  }

  const validation =
    contactFormSchema.safeParse(
      body
    )

  if (!validation.success) {
    return apiValidationError(
      validation.error
    )
  }

  const {
    name,
    email,
    subject,
    message,
    website,
    startedAt,
  } = validation.data

  /*
   * Honeypot.
   *
   * We deliberately return success
   * instead of telling a bot that it
   * triggered spam detection.
   */
  if (website.trim()) {
    return NextResponse.json(
      {
        success: true,

        data: {
          message:
            "Message sent successfully.",
        },
      },
      {
        status: 200,
      }
    )
  }

  const formDuration =
    Date.now() - startedAt

  if (
    formDuration <
    MINIMUM_FORM_TIME_MS
  ) {
    return apiError(
      "Please wait a moment and try again.",
      400
    )
  }

  try {
    const rateLimit =
      await checkContactRateLimit(
        request
      )

    if (!rateLimit.allowed) {
      return apiError(
        "Too many messages were sent recently. Please try again later.",
        429
      )
    }

    const {
      apiKey,
      to,
      from,
    } = getEmailConfig()

    const resend =
      new Resend(apiKey)

    const safeSubject =
      subject
        .replace(
          /[\r\n]+/g,
          " "
        )
        .trim()

    const emailText = [
      "New portfolio contact message",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Subject: ${safeSubject}`,
      "",
      "Message:",
      message,
    ].join("\n")

    const {
      data,
      error,
    } =
      await resend.emails.send({
        from,

        to: [to],

        replyTo: email,

        subject:
          `[Portfolio] ${safeSubject}`,

        text: emailText,
      })

    if (error) {
      console.error(
        "Resend contact email error:",
        error
      )

      return apiError(
        "Unable to send your message right now.",
        502
      )
    }

    return NextResponse.json(
      {
        success: true,

        data: {
          message:
            "Message sent successfully.",

          id: data?.id,
        },
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    console.error(
      "POST /api/contact error:",
      error
    )

    return apiError(
      "Unable to send your message right now.",
      500
    )
  }
}