import { ProjectDetailImage } from "@/components/shared/project-detail-image"
import type {
  ProjectScreenshot,
} from "@/types/project"

type ProjectFeatureProps = {
  screenshot: ProjectScreenshot
  index: number
}

export function ProjectFeature({
  screenshot,
  index,
}: ProjectFeatureProps) {
  return (
    <article className="grid gap-8 border-t pt-10 lg:grid-cols-[0.85fr_1.5fr] lg:items-start">
      <div className="space-y-4">
        <p className="font-mono text-sm text-muted-foreground">
          Feature{" "}
          {String(index + 1).padStart(
            2,
            "0"
          )}
        </p>

        <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {screenshot.title}
        </h3>

        {screenshot.description ? (
          <p className="leading-7 text-muted-foreground">
            {
              screenshot.description
            }
          </p>
        ) : null}
      </div>

      <ProjectDetailImage
        image={{
          url: screenshot.url,

          publicId:
            screenshot.publicId,

          alt: screenshot.alt,
        }}
        title={screenshot.title}
      />
    </article>
  )
}