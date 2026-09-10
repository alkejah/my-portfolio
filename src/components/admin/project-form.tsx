"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { ImagePlus, Plus, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ProjectImageUploader } from "@/components/admin/project-image-uploader";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { ApiResponse } from "@/types/api";
import type {
  CreateProjectInput,
  ProjectDTO,
  ProjectImage,
  ProjectScreenshot,
  ProjectTechnology,
} from "@/types/project";

type ProjectFormProps = {
  mode: "create" | "edit";
  project?: ProjectDTO;
};

type ProjectFormState = {
  title: string;
  shortDescription: string;
  description: string;

  coverImage: ProjectImage;

  screenshots: ProjectScreenshot[];
  technologies: ProjectTechnology[];

  liveUrl: string;
  repositoryUrl: string;

  contributor: boolean;
  contributorRole: string;

  featured: boolean;
  published: boolean;

  order: number;
};

const textareaClassName =
  "flex min-h-28 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50";

function createEmptyImage(): ProjectImage {
  return {
    url: "",
    publicId: null,
    alt: "",
  };
}

function createEmptyTechnology(): ProjectTechnology {
  return {
    name: "",
    iconKey: "",
  };
}

function createEmptyScreenshot(): ProjectScreenshot {
  return {
    url: "",
    publicId: null,
    alt: "",
    title: "",
    description: "",
  };
}

function buildInitialState(project?: ProjectDTO): ProjectFormState {
  if (!project) {
    return {
      title: "",
      shortDescription: "",
      description: "",

      coverImage: createEmptyImage(),

      screenshots: [],
      technologies: [],

      liveUrl: "",
      repositoryUrl: "",

      contributor: false,
      contributorRole: "",

      featured: false,
      published: false,

      order: 0,
    };
  }

  return {
    title: project.title,

    shortDescription: project.shortDescription,

    description: project.description,

    coverImage: project.coverImage
      ? {
          ...project.coverImage,
        }
      : createEmptyImage(),

    screenshots: project.screenshots.map((screenshot) => ({
      ...screenshot,
    })),

    technologies: project.technologies.map((technology) => ({
      ...technology,
    })),

    liveUrl: project.liveUrl ?? "",

    repositoryUrl: project.repositoryUrl ?? "",

    contributor: project.contributor ?? false,

    contributorRole: project.contributorRole ?? "",

    featured: project.featured,

    published: project.published,

    order: project.order,
  };
}

type FieldErrorProps = {
  message?: string;
};

function FieldError({ message }: FieldErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <p role="alert" className="text-xs text-destructive">
      {message}
    </p>
  );
}

export function ProjectForm({ mode, project }: ProjectFormProps) {
  const router = useRouter();

  const persistedPublicIds = [
    project?.coverImage?.publicId,

    ...(project?.screenshots.map((screenshot) => screenshot.publicId) ?? []),
  ].filter((publicId): publicId is string => Boolean(publicId));

  const [form, setForm] = useState<ProjectFormState>(() =>
    buildInitialState(project),
  );

  const [pending, setPending] = useState(false);

  const [formError, setFormError] = useState<string | null>(null);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function getFieldError(path: string) {
    return fieldErrors[path];
  }

  function addTechnology() {
    setForm((current) => ({
      ...current,

      technologies: [...current.technologies, createEmptyTechnology()],
    }));
  }

  function removeTechnology(index: number) {
    setForm((current) => ({
      ...current,

      technologies: current.technologies.filter(
        (_, currentIndex) => currentIndex !== index,
      ),
    }));
  }

  function updateTechnology(
    index: number,
    field: keyof ProjectTechnology,
    value: string,
  ) {
    setForm((current) => ({
      ...current,

      technologies: current.technologies.map((technology, currentIndex) =>
        currentIndex === index
          ? {
              ...technology,
              [field]: value,
            }
          : technology,
      ),
    }));
  }

  function addScreenshot() {
    setForm((current) => ({
      ...current,

      screenshots: [...current.screenshots, createEmptyScreenshot()],
    }));
  }

  function removeScreenshot(index: number) {
    setForm((current) => ({
      ...current,

      screenshots: current.screenshots.filter(
        (_, currentIndex) => currentIndex !== index,
      ),
    }));
  }

  function updateScreenshot(
    index: number,
    field: "title" | "description",
    value: string,
  ) {
    setForm((current) => ({
      ...current,

      screenshots: current.screenshots.map((screenshot, currentIndex) => {
        if (currentIndex !== index) {
          return screenshot;
        }

        return {
          ...screenshot,

          [field]: value,
        };
      }),
    }));
  }

  function updateScreenshotImage(index: number, image: ProjectImage) {
    setForm((current) => ({
      ...current,

      screenshots: current.screenshots.map((screenshot, currentIndex) =>
        currentIndex === index
          ? {
              ...screenshot,

              url: image.url,

              publicId: image.publicId,

              alt: image.alt,
            }
          : screenshot,
      ),
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setPending(true);
    setFormError(null);
    setFieldErrors({});

    if (mode === "edit" && !project) {
      setFormError("Project information is missing.");

      setPending(false);

      return;
    }

    const payload = {
      title: form.title.trim(),

      shortDescription: form.shortDescription.trim(),

      description: form.description.trim(),

      coverImage: form.coverImage.url.trim()
        ? {
            url: form.coverImage.url.trim(),

            publicId: form.coverImage.publicId,

            alt: form.coverImage.alt.trim(),
          }
        : null,

      screenshots: form.screenshots.map((screenshot) => ({
        url: screenshot.url.trim(),

        publicId: screenshot.publicId,

        alt: screenshot.alt.trim(),

        title: screenshot.title.trim(),

        description: screenshot.description.trim(),
      })),

      technologies: form.technologies.map((technology) => ({
        name: technology.name.trim(),

        iconKey: technology.iconKey.trim(),
      })),

      liveUrl: form.liveUrl.trim() ? form.liveUrl.trim() : null,

      repositoryUrl: form.repositoryUrl.trim()
        ? form.repositoryUrl.trim()
        : null,

      contributor: form.contributor,

      contributorRole: form.contributor ? form.contributorRole.trim() : null,

      featured: form.featured,

      published: form.published,

      order: form.order,
    } satisfies CreateProjectInput;

    const endpoint =
      mode === "create" ? "/api/projects" : `/api/projects/${project!.id}`;

    const method = mode === "create" ? "POST" : "PATCH";

    try {
      const response = await fetch(endpoint, {
        method,

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as ApiResponse<ProjectDTO>;

      if (response.status === 401) {
        router.replace("/admin/login");

        router.refresh();

        return;
      }

      if (!data.success) {
        if (data.issues) {
          const errors = Object.fromEntries(
            data.issues.map((issue) => [issue.path, issue.message]),
          );

          setFieldErrors(errors);

          setFormError(errors.root ?? data.message);
        } else {
          setFormError(data.message);
        }

        return;
      }

      const status = mode === "create" ? "created" : "updated";

      router.replace(`/admin/projects?status=${status}`);
    } catch {
      setFormError("Unable to connect to the server.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {formError ? (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          {formError}
        </div>
      ) : null}

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>

          <CardDescription>
            The main information visitors will see about this project.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>

            <Input
              id="title"
              value={form.title}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,

                  title: event.target.value,
                }))
              }
              placeholder="E-Commerce Platform"
              maxLength={120}
              required
              disabled={pending}
              aria-invalid={Boolean(getFieldError("title"))}
            />

            <FieldError message={getFieldError("title")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shortDescription">Short Description</Label>

            <textarea
              id="shortDescription"
              value={form.shortDescription}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,

                  shortDescription: event.target.value,
                }))
              }
              placeholder="A short summary used on portfolio project cards."
              minLength={10}
              maxLength={300}
              required
              disabled={pending}
              aria-invalid={Boolean(getFieldError("shortDescription"))}
              className={cn(textareaClassName, "min-h-24")}
            />

            <div className="flex justify-between gap-4">
              <FieldError message={getFieldError("shortDescription")} />

              <p className="ml-auto text-xs text-muted-foreground">
                {form.shortDescription.length}
                /300
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Full Description</Label>

            <textarea
              id="description"
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,

                  description: event.target.value,
                }))
              }
              placeholder="Explain what the project does, the problem it solves, and its important features."
              minLength={20}
              maxLength={10000}
              required
              disabled={pending}
              aria-invalid={Boolean(getFieldError("description"))}
              className={cn(textareaClassName, "min-h-48")}
            />

            <FieldError message={getFieldError("description")} />
          </div>
        </CardContent>
      </Card>

      {/* Cover Image */}
      <Card>
        <CardHeader>
          <CardTitle>Cover Image</CardTitle>

          <CardDescription>
            Used as the main image on the portfolio project card.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ProjectImageUploader
            id="cover-image"
            purpose="cover"
            value={form.coverImage}
            onChange={(image) =>
              setForm((current) => ({
                ...current,
                coverImage: image,
              }))
            }
            disabled={pending}
            persistedPublicIds={persistedPublicIds}
            urlError={getFieldError("coverImage.url")}
            altError={getFieldError("coverImage.alt")}
          />
        </CardContent>
      </Card>

      {/* Technologies */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1.5">
              <CardTitle>Technology Stack</CardTitle>

              <CardDescription>
                Technologies and icon keys used by this project.
              </CardDescription>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={pending}
              onClick={addTechnology}
            >
              <Plus className="size-4" />
              Add Technology
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {form.technologies.length === 0 ? (
            <div className="rounded-lg border border-dashed px-6 py-10 text-center">
              <p className="font-medium">No technologies added</p>

              <p className="mt-1 text-sm text-muted-foreground">
                Add technologies such as Next.js, TypeScript, or MongoDB.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {form.technologies.map((technology, index) => (
                <div
                  key={index}
                  className="grid gap-4 rounded-lg border p-4 sm:grid-cols-[1fr_1fr_auto]"
                >
                  <div className="space-y-2">
                    <Label htmlFor={`technology-${index}-name`}>
                      Technology
                    </Label>

                    <Input
                      id={`technology-${index}-name`}
                      value={technology.name}
                      onChange={(event) =>
                        updateTechnology(index, "name", event.target.value)
                      }
                      placeholder="Next.js"
                      maxLength={60}
                      required
                      disabled={pending}
                      aria-invalid={Boolean(
                        getFieldError(`technologies.${index}.name`),
                      )}
                    />

                    <FieldError
                      message={getFieldError(`technologies.${index}.name`)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`technology-${index}-icon`}>Icon Key</Label>

                    <Input
                      id={`technology-${index}-icon`}
                      value={technology.iconKey}
                      onChange={(event) =>
                        updateTechnology(
                          index,
                          "iconKey",
                          event.target.value.toLowerCase(),
                        )
                      }
                      placeholder="nextjs"
                      maxLength={60}
                      required
                      disabled={pending}
                      aria-invalid={Boolean(
                        getFieldError(`technologies.${index}.iconKey`),
                      )}
                    />

                    <p className="text-xs text-muted-foreground">
                      Examples: nextjs, typescript, mongodb, nodejs
                    </p>

                    <FieldError
                      message={getFieldError(`technologies.${index}.iconKey`)}
                    />
                  </div>

                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      disabled={pending}
                      onClick={() => removeTechnology(index)}
                    >
                      <Trash2 className="size-4" />

                      <span className="sm:hidden">Remove</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <FieldError message={getFieldError("technologies")} />
        </CardContent>
      </Card>

      {/* Screenshots */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1.5">
              <CardTitle>Feature Screenshots</CardTitle>

              <CardDescription>
                Add screenshots for the important features of this project.
              </CardDescription>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={pending}
              onClick={addScreenshot}
            >
              <ImagePlus className="size-4" />
              Add Screenshot
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {form.screenshots.length === 0 ? (
            <div className="rounded-lg border border-dashed px-6 py-10 text-center">
              <p className="font-medium">No screenshots added</p>

              <p className="mt-1 text-sm text-muted-foreground">
                Screenshots will be shown on the project&apos;s detailed
                showcase page.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {form.screenshots.map((screenshot, index) => (
                <div
                  key={index}
                  className="space-y-5 rounded-xl border p-4 sm:p-5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-medium">Screenshot {index + 1}</p>

                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      disabled={pending}
                      onClick={() => removeScreenshot(index)}
                    >
                      <Trash2 className="size-4" />
                      Remove
                    </Button>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <ProjectImageUploader
                        id={`screenshot-${index}`}
                        purpose="screenshot"
                        value={{
                          url: screenshot.url,

                          publicId: screenshot.publicId,

                          alt: screenshot.alt,
                        }}
                        onChange={(image) =>
                          updateScreenshotImage(index, image)
                        }
                        required
                        disabled={pending}
                        persistedPublicIds={persistedPublicIds}
                        urlError={getFieldError(`screenshots.${index}.url`)}
                        altError={getFieldError(`screenshots.${index}.alt`)}
                      />
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor={`screenshot-${index}-title`}>
                        Feature Title
                      </Label>

                      <Input
                        id={`screenshot-${index}-title`}
                        value={screenshot.title}
                        onChange={(event) =>
                          updateScreenshot(index, "title", event.target.value)
                        }
                        placeholder="Admin Dashboard"
                        maxLength={120}
                        required
                        disabled={pending}
                        aria-invalid={Boolean(
                          getFieldError(`screenshots.${index}.title`),
                        )}
                      />

                      <FieldError
                        message={getFieldError(`screenshots.${index}.title`)}
                      />
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor={`screenshot-${index}-description`}>
                        Feature Description
                      </Label>

                      <textarea
                        id={`screenshot-${index}-description`}
                        value={screenshot.description}
                        onChange={(event) =>
                          updateScreenshot(
                            index,
                            "description",
                            event.target.value,
                          )
                        }
                        placeholder="Explain what this feature does."
                        maxLength={500}
                        disabled={pending}
                        aria-invalid={Boolean(
                          getFieldError(`screenshots.${index}.description`),
                        )}
                        className={cn(textareaClassName, "min-h-24")}
                      />

                      <FieldError
                        message={getFieldError(
                          `screenshots.${index}.description`,
                        )}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <FieldError message={getFieldError("screenshots")} />
        </CardContent>
      </Card>

      {/* Links and Publishing */}
      <Card>
        <CardHeader>
          <CardTitle>Links & Publishing</CardTitle>

          <CardDescription>
            Configure external links and how this project appears on your
            portfolio.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="liveUrl">Live Website URL</Label>

              <Input
                id="liveUrl"
                type="url"
                value={form.liveUrl}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,

                    liveUrl: event.target.value,
                  }))
                }
                placeholder="https://project.example.com"
                disabled={pending}
                aria-invalid={Boolean(getFieldError("liveUrl"))}
              />

              <FieldError message={getFieldError("liveUrl")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="repositoryUrl">Repository URL</Label>

              <Input
                id="repositoryUrl"
                type="url"
                value={form.repositoryUrl}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,

                    repositoryUrl: event.target.value,
                  }))
                }
                placeholder="https://github.com/username/project"
                disabled={pending}
                aria-invalid={Boolean(getFieldError("repositoryUrl"))}
              />

              <FieldError message={getFieldError("repositoryUrl")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="order">Display Order</Label>

            <Input
              id="order"
              type="number"
              min={0}
              max={9999}
              value={form.order}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,

                  order:
                    event.target.value === "" ? 0 : Number(event.target.value),
                }))
              }
              disabled={pending}
              aria-invalid={Boolean(getFieldError("order"))}
            />

            <p className="text-xs text-muted-foreground">
              Lower numbers appear before higher numbers.
            </p>

            <FieldError message={getFieldError("order")} />
          </div>

          {/* Contributor */}
          <div className="space-y-4 rounded-xl border p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={form.contributor}
                onChange={(event) => {
                  const checked = event.target.checked;

                  setForm((current) => ({
                    ...current,

                    contributor: checked,

                    contributorRole: checked ? current.contributorRole : "",
                  }));

                  if (!checked) {
                    setFieldErrors((current) => {
                      const next = {
                        ...current,
                      };

                      delete next.contributorRole;

                      return next;
                    });
                  }
                }}
                disabled={pending}
                className="mt-1 size-4"
              />

              <div className="space-y-1">
                <p className="font-medium">Contributor Project</p>

                <p className="text-sm text-muted-foreground">
                  Enable this when you contributed to the project as part of a
                  team.
                </p>
              </div>
            </label>

            {form.contributor ? (
              <div className="space-y-2 border-t pt-4">
                <Label htmlFor="contributor-role">Acted as</Label>

                <Input
                  id="contributor-role"
                  value={form.contributorRole}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,

                      contributorRole: event.target.value,
                    }))
                  }
                  placeholder="e.g. Backend Developer"
                  maxLength={120}
                  required
                  disabled={pending}
                  aria-invalid={Boolean(getFieldError("contributorRole"))}
                />

                <p className="text-xs text-muted-foreground">
                  Enter the role you performed on this project.
                </p>

                <FieldError message={getFieldError("contributorRole")} />
              </div>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-4">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,

                    featured: event.target.checked,
                  }))
                }
                disabled={pending}
                className="mt-1 size-4"
              />

              <span>
                <span className="block font-medium">Featured Project</span>

                <span className="mt-1 block text-sm text-muted-foreground">
                  Give this project higher priority on the public portfolio.
                </span>
              </span>
            </label>

            <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-4">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,

                    published: event.target.checked,
                  }))
                }
                disabled={pending}
                className="mt-1 size-4"
              />

              <span>
                <span className="block font-medium">Published</span>

                <span className="mt-1 block text-sm text-muted-foreground">
                  Allow visitors to see this project publicly.
                </span>
              </span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
        <Link
          href="/admin/projects"
          className={buttonVariants({
            variant: "outline",
          })}
        >
          Cancel
        </Link>

        <Button type="submit" disabled={pending}>
          <Save className="size-4" />

          {pending
            ? "Saving..."
            : mode === "create"
              ? "Create Project"
              : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
