type SectionHeadingProps = {
  eyebrow?: string
  title: string
  description?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="max-w-2xl space-y-4">
      {eyebrow ? (
        <p className="font-mono text-sm font-medium text-muted-foreground">
          {eyebrow}
        </p>
      ) : null}

      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h2>

      {description ? (
        <p className="text-base leading-7 text-muted-foreground sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  )
}