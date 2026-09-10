import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"
import { Container } from "@/components/shared/container"

export default function LoadingProject() {
  return (
    <>
      <Navbar />

      <main
        id="main-content"
        tabIndex={-1}
        aria-busy="true"
      >
        <Container className="space-y-12 py-16 sm:py-20">
          <span className="sr-only">
            Loading project
          </span>

          <div className="space-y-5">
            <div className="h-4 w-36 animate-pulse rounded bg-muted" />

            <div className="h-14 max-w-2xl animate-pulse rounded-lg bg-muted" />

            <div className="h-6 max-w-xl animate-pulse rounded bg-muted" />
          </div>

          <div className="aspect-video w-full animate-pulse rounded-2xl bg-muted" />

          <div className="grid gap-8 lg:grid-cols-[1fr_0.6fr]">
            <div className="space-y-4">
              <div className="h-8 w-52 animate-pulse rounded bg-muted" />

              <div className="h-4 w-full animate-pulse rounded bg-muted" />

              <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />

              <div className="h-4 w-4/6 animate-pulse rounded bg-muted" />
            </div>

            <div className="space-y-3">
              <div className="h-6 w-36 animate-pulse rounded bg-muted" />

              <div className="flex gap-2">
                <div className="h-9 w-24 animate-pulse rounded-full bg-muted" />

                <div className="h-9 w-28 animate-pulse rounded-full bg-muted" />
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  )
}