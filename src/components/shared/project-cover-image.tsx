/* eslint-disable @next/next/no-img-element */

import { ImageIcon } from "lucide-react";
import Image from "next/image";

import type { ProjectImage } from "@/types/project";

type ProjectCoverImageProps = {
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

export function ProjectCoverImage({
  image,
  title,
  eager = false,
}: ProjectCoverImageProps) {
  if (!image?.url) {
    return (
      <div className="flex aspect-[16/10] items-center justify-center bg-muted">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <ImageIcon className="size-8" />

          <span className="text-xs">{title}</span>
        </div>
      </div>
    );
  }

  if (isCloudinaryUrl(image.url)) {
    return (
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        <Image
          src={image.url}
          alt={image.alt}
          fill
          loading={eager ? "eager" : "lazy"}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>
    );
  }

  return (
    <div className="aspect-[16/10] overflow-hidden bg-muted">
      <img
        src={image.url}
        alt={image.alt}
        className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
      />
    </div>
  );
}
