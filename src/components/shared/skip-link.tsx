import type {
  ReactNode,
} from "react"

type SkipLinkProps = {
  href?: string
  children?: ReactNode
}

export function SkipLink({
  href = "#main-content",

  children =
    "Skip to main content",
}: SkipLinkProps) {
  return (
    <a
      href={href}
      className="sr-only z-[100] rounded-md bg-background px-4 py-2 text-sm font-medium text-foreground shadow-lg focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
    >
      {children}
    </a>
  )
}