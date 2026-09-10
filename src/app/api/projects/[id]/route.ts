import {
  MongoServerError,
} from "mongodb"
import { NextResponse } from "next/server"

import {
  apiError,
  apiValidationError,
} from "@/lib/api"
import { getAdminSession } from "@/lib/auth/session"
import { parseObjectId } from "@/lib/object-id"
import { projectToDTO } from "@/lib/projects/serialize"
import { updateProjectSchema } from "@/lib/validations/project"
import { getProjectsCollection } from "@/models/project"
import type { ProjectDocument } from "@/types/project"
import { deleteCloudinaryImages } from "@/lib/cloudinary"
import { getProjectImagePublicIds } from "@/lib/projects/images"

export const runtime = "nodejs"

type ProjectRouteContext = {
  params: Promise<{
    id: string
  }>
}

export async function GET(
  _request: Request,
  { params }: ProjectRouteContext
) {
  const { id } = await params

  const objectId = parseObjectId(id)

  if (!objectId) {
    return apiError(
      "Invalid project ID.",
      400
    )
  }

  try {
    const collection =
      await getProjectsCollection()

    const session =
      await getAdminSession()

    const project =
      await collection.findOne(
        session
          ? {
              _id: objectId,
            }
          : {
              _id: objectId,
              published: true,
            }
      )

    if (!project) {
      return apiError(
        "Project not found.",
        404
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: projectToDTO(project),
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    console.error(
      `GET /api/projects/${id} error:`,
      error
    )

    return apiError(
      "Unable to retrieve project.",
      500
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: ProjectRouteContext
) {
  const session =
    await getAdminSession()

  if (!session) {
    return apiError(
      "Authentication required.",
      401
    )
  }

  const { id } = await params

  const objectId = parseObjectId(id)

  if (!objectId) {
    return apiError(
      "Invalid project ID.",
      400
    )
  }

  let body: unknown

  try {
    body = await request.json()
  } catch {
    return apiError(
      "Request body must contain valid JSON.",
      400
    )
  }

  const validation =
    updateProjectSchema.safeParse(body)

  if (!validation.success) {
    return apiValidationError(
      validation.error
    )
  }

  try {
    const collection =
      await getProjectsCollection()

    const existingProject =
      await collection.findOne({
        _id: objectId,
      })

    if (!existingProject) {
      return apiError(
        "Project not found.",
        404
      )
    }

    const previousImageIds =
      getProjectImagePublicIds(
        existingProject
      )

    const update: Partial<ProjectDocument> = {
      ...validation.data,
      updatedAt: new Date(),
    }

    await collection.updateOne(
      {
        _id: objectId,
      },
      {
        $set: update,
      }
    )

    const updatedProject =
      await collection.findOne({
        _id: objectId,
      })

    if (!updatedProject) {
      return apiError(
        "Unable to retrieve updated project.",
        500
      )
    }

    const nextImageIds =
      new Set(
        getProjectImagePublicIds(
          updatedProject
        )
      )

    const removedImageIds =
      previousImageIds.filter(
        (publicId) =>
          !nextImageIds.has(publicId)
      )

    await deleteCloudinaryImages(
      removedImageIds
    )

    return NextResponse.json(
      {
        success: true,

        data: projectToDTO(
          updatedProject
        ),
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    console.error(
      `PATCH /api/projects/${id} error:`,
      error
    )

    if (
      error instanceof
        MongoServerError &&
      error.code === 11000
    ) {
      return apiError(
        "A project with this slug already exists.",
        409
      )
    }

    return apiError(
      "Unable to update project.",
      500
    )
  }
}

export async function DELETE(
  _request: Request,
  { params }: ProjectRouteContext
) {
  const session =
    await getAdminSession()

  if (!session) {
    return apiError(
      "Authentication required.",
      401
    )
  }

  const { id } = await params

  const objectId = parseObjectId(id)

  if (!objectId) {
    return apiError(
      "Invalid project ID.",
      400
    )
  }

  try {
    const collection =
      await getProjectsCollection()

    const project =
      await collection.findOne({
        _id: objectId,
      })

    if (!project) {
      return apiError(
        "Project not found.",
        404
      )
    }

    const imagePublicIds =
      getProjectImagePublicIds(
        project
      )

    const result =
      await collection.deleteOne({
        _id: objectId,
      })

    if (
      result.deletedCount === 0
    ) {
      return apiError(
        "Project not found.",
        404
      )
    }

    await deleteCloudinaryImages(
      imagePublicIds
    )

    return NextResponse.json(
      {
        success: true,

        data: {
          id,
        },
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    console.error(
      `DELETE /api/projects/${id} error:`,
      error
    )

    return apiError(
      "Unable to delete project.",
      500
    )
  }
}