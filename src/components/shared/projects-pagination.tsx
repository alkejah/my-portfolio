import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"

import {
  buttonVariants,
} from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ProjectsPaginationProps = {
  page: number
  totalPages: number
}

export function ProjectsPagination({
  page,
  totalPages,
}: ProjectsPaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  const pages =
    Array.from(
      {
        length:
          totalPages,
      },

      (_, index) =>
        index + 1
    )

  return (
    <nav
      aria-label="Projects pagination"
      className="flex flex-wrap items-center justify-center gap-2"
    >
      {page > 1 ? (
        <Link
          href={
            page - 1 === 1
              ? "/projects"
              : `/projects?page=${page - 1}`
          }
          className={buttonVariants({
            variant:
              "outline",
            size: "sm",
          })}
        >
          <ChevronLeft className="size-4" />

          Previous
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className={cn(
            buttonVariants({
              variant:
                "outline",
              size: "sm",
            }),

            "pointer-events-none opacity-50"
          )}
        >
          <ChevronLeft className="size-4" />

          Previous
        </span>
      )}

      {pages.map(
        (pageNumber) => (
          <Link
            key={
              pageNumber
            }
            href={
              pageNumber ===
              1
                ? "/projects"
                : `/projects?page=${pageNumber}`
            }
            aria-current={
              pageNumber ===
              page
                ? "page"
                : undefined
            }
            className={buttonVariants({
              variant:
                pageNumber ===
                page
                  ? "default"
                  : "outline",

              size: "icon-sm",
            })}
          >
            {pageNumber}
          </Link>
        )
      )}

      {page <
      totalPages ? (
        <Link
          href={`/projects?page=${page + 1}`}
          className={buttonVariants({
            variant:
              "outline",
            size: "sm",
          })}
        >
          Next

          <ChevronRight className="size-4" />
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className={cn(
            buttonVariants({
              variant:
                "outline",
              size: "sm",
            }),

            "pointer-events-none opacity-50"
          )}
        >
          Next

          <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  )
}