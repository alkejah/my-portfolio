/* eslint-disable @next/next/no-img-element */

import { ImageIcon } from "lucide-react";
import Image from "next/image";

import type { ProjectImage } from "@/types/project";

type ProjectDetailImageProps = {
  image: ProjectImage | null;
  title: string;
  eager?: boolean;
};

function isCloudinaryUrl(url: string) {
  try {
    const parsedUrl = new URL(url);

    return (
      parsedUrl.protocol === "https:" &&
      parsedUrl.hostname === "res.cloudinary.com"
    );
  } catch {
    return false;
  }
}

export function ProjectDetailImage({
  image,
  title,
  eager = false,
}: ProjectDetailImageProps) {
  if (!image?.url) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-2xl border bg-muted">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <ImageIcon className="size-10" />

          <span className="text-sm">{title}</span>
        </div>
      </div>
    );
  }

  if (isCloudinaryUrl(image.url)) {
    return (
      <div className="relative aspect-video overflow-hidden rounded-2xl border bg-muted">
        <Image
          src={image.url}
          alt={image.alt}
          fill
          loading={eager ? "eager" : "lazy"}
          sizes="(max-width: 1280px) 100vw, 1200px"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div className="aspect-video overflow-hidden rounded-2xl border bg-muted">
      <img src={image.url} alt={image.alt} className="size-full object-cover" />
    </div>
  );
}
