import {
  ArrowLeft,
  FileQuestion,
} from "lucide-react"
import Link from "next/link"

import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"
import { Container } from "@/components/shared/container"
import { buttonVariants } from "@/components/ui/button"

export default function NotFound() {
  return (
    <>
      <Navbar />

      <main
        id="main-content"
        tabIndex={-1}
      >
        <Container className="flex min-h-[70vh] items-center justify-center py-20">
          <div className="max-w-lg text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-muted">
              <FileQuestion className="size-6 text-muted-foreground" />
            </div>

            <p className="mt-6 font-mono text-sm text-muted-foreground">
              404
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Page not found.
            </h1>

            <p className="mt-4 leading-7 text-muted-foreground">
              The page you&apos;re looking for
              may have moved, been removed,
              or never existed.
            </p>

            <div className="mt-8">
              <Link
                href="/"
                className={
                  buttonVariants()
                }
              >
                <ArrowLeft className="size-4" />

                Back Home
              </Link>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  )
}