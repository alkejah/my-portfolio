/* eslint-disable @next/next/no-img-element */

"use client";

import { ImageIcon, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ProjectImage } from "@/types/project";
import type { ApiResponse } from "@/types/api";
import type { UploadedImageDTO, UploadImagePurpose } from "@/types/media";

type ProjectImageUploaderProps = {
  id: string;

  purpose: UploadImagePurpose;

  value: ProjectImage;

  onChange: (value: ProjectImage) => void;

  disabled?: boolean;

  required?: boolean;

  persistedPublicIds?: string[];

  urlError?: string;
  altError?: string;
};

const MAX_IMAGE_SIZE = 8 * 1024 * 1024;

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function ProjectImageUploader({
  id,
  purpose,
  value,
  onChange,
  disabled = false,
  required = false,
  persistedPublicIds = [],
  urlError,
  altError,
}: ProjectImageUploaderProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  function isPersistedPublicId(publicId: string) {
    return persistedPublicIds.includes(publicId);
  }

  async function deleteTemporaryImage(publicId: string | null) {
    if (!publicId) {
      return;
    }

    if (isPersistedPublicId(publicId)) {
      return;
    }

    try {
      await fetch("/api/media/images", {
        method: "DELETE",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          publicId,
        }),
      });
    } catch {
      // Temporary cleanup failure should
      // not block the form.
    }
  }

  async function handleFile(file: File) {
    setError(null);

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError("Choose a JPEG, PNG, or WebP image.");

      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setError("Image must not exceed 8 MB.");

      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();

      formData.set("file", file);

      formData.set("purpose", purpose);

      const response = await fetch("/api/media/images", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as ApiResponse<UploadedImageDTO>;

      if (response.status === 401) {
        router.replace("/admin/login");

        router.refresh();

        return;
      }

      if (!data.success) {
        setError(data.message);

        return;
      }

      await deleteTemporaryImage(value.publicId);

      onChange({
        url: data.data.url,
        publicId: data.data.publicId,

        alt: value.alt,
      });
    } catch {
      setError("Unable to upload image.");
    } finally {
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    await handleFile(file);
  }

  async function handleRemove() {
    await deleteTemporaryImage(value.publicId);

    onChange({
      url: "",
      publicId: null,
      alt: "",
    });

    setError(null);
  }

  async function handleUrlChange(url: string) {
    if (value.publicId && url !== value.url) {
      await deleteTemporaryImage(value.publicId);
    }

    onChange({
      ...value,
      url,
      publicId: url === value.url ? value.publicId : null,
    });
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-dashed p-4">
        {value.url ? (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-lg border bg-muted">
              <img
                src={value.url}
                alt={value.alt || "Project image preview"}
                className="aspect-video w-full object-cover"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={disabled || uploading}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="size-4" />

                {uploading ? "Uploading..." : "Replace image"}
              </Button>

              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={disabled || uploading}
                onClick={handleRemove}
              >
                <Trash2 className="size-4" />
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <ImageIcon className="size-5 text-muted-foreground" />
            </div>

            <div>
              <p className="font-medium">No image selected</p>

              <p className="mt-1 text-sm text-muted-foreground">
                JPEG, PNG, or WebP. Maximum 8 MB.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              disabled={disabled || uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="size-4" />

              {uploading ? "Uploading..." : "Choose Image"}
            </Button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          disabled={disabled || uploading}
          onChange={handleFileChange}
        />
      </div>

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor={`${id}-url`}>Image URL</Label>

        <Input
          id={`${id}-url`}
          type="url"
          value={value.url}
          onChange={(event) => {
            void handleUrlChange(event.target.value);
          }}
          placeholder="https://..."
          required={required}
          disabled={disabled || uploading}
          aria-invalid={Boolean(urlError)}
        />

        <p className="text-xs text-muted-foreground">
          Upload an image above or paste an external image URL.
        </p>

        {urlError ? (
          <p role="alert" className="text-xs text-destructive">
            {urlError}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${id}-alt`}>Alt Text</Label>

        <Input
          id={`${id}-alt`}
          value={value.alt}
          onChange={(event) =>
            onChange({
              ...value,
              alt: event.target.value,
            })
          }
          placeholder="Describe what appears in the image"
          maxLength={200}
          required={required || Boolean(value.url.trim())}
          disabled={disabled}
          aria-invalid={Boolean(altError)}
        />

        {altError ? (
          <p role="alert" className="text-xs text-destructive">
            {altError}
          </p>
        ) : null}
      </div>
    </div>
  );
}
