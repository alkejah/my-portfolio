import { Badge } from "@/components/ui/badge"

type ProjectStatusProps = {
  published: boolean
  featured: boolean
}

export function ProjectStatus({
  published,
  featured,
}: ProjectStatusProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge
        variant={
          published
            ? "default"
            : "secondary"
        }
      >
        {published
          ? "Published"
          : "Draft"}
      </Badge>

      {featured ? (
        <Badge variant="outline">
          Featured
        </Badge>
      ) : null}
    </div>
  )
}