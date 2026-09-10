"use client"

import {
  Home,
  RefreshCcw,
  TriangleAlert,
} from "lucide-react"
import Link from "next/link"

import {
  Button,
  buttonVariants,
} from "@/components/ui/button"

type ErrorPageProps = {
  error: Error & {
    digest?: string
  }

  reset: () => void
}

export default function ErrorPage({
  error,
  reset,
}: ErrorPageProps) {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="flex min-h-screen items-center justify-center px-4 py-20"
    >
      <div className="max-w-lg text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-destructive/10">
          <TriangleAlert className="size-6 text-destructive" />
        </div>

        <h1 className="mt-6 text-3xl font-bold tracking-tight">
          Something went wrong.
        </h1>

        <p className="mt-4 leading-7 text-muted-foreground">
          The application encountered an
          unexpected problem. You can try
          loading this section again or
          return to the homepage.
        </p>

        {error.digest ? (
          <p className="mt-3 font-mono text-xs text-muted-foreground">
            Reference:{" "}
            {error.digest}
          </p>
        ) : null}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button
            type="button"
            onClick={reset}
          >
            <RefreshCcw className="size-4" />

            Try Again
          </Button>

          <Link
            href="/"
            className={buttonVariants({
              variant: "outline",
            })}
          >
            <Home className="size-4" />

            Home
          </Link>
        </div>
      </div>
    </main>
  )
}