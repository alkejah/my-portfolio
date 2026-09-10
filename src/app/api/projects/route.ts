import {
  type Filter,
  MongoServerError,
} from "mongodb"
import { NextResponse } from "next/server"

import {
  apiError,
  apiValidationError,
} from "@/lib/api"
import { getAdminSession } from "@/lib/auth/session"
import { projectToDTO } from "@/lib/projects/serialize"
import { generateUniqueProjectSlug } from "@/lib/projects/slug"
import { createProjectSchema } from "@/lib/validations/project"
import { getProjectsCollection } from "@/models/project"
import type {
  ProjectDocument,
  ProjectWithId,
} from "@/types/project"

export const runtime = "nodejs"

export async function GET() {
  try {
    const collection =
      await getProjectsCollection()

    const session =
      await getAdminSession()

    const filter: Filter<ProjectDocument> =
      session
        ? {}
        : {
            published: true,
          }

    const projects = await collection
      .find(filter)
      .sort({
        featured: -1,
        order: 1,
        createdAt: -1,
      })
      .toArray()

    return NextResponse.json(
      {
        success: true,
        data: projects.map(projectToDTO),
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    console.error(
      "GET /api/projects error:",
      error
    )

    return apiError(
      "Unable to retrieve projects.",
      500
    )
  }
}

export async function POST(
  request: Request
) {
  const session =
    await getAdminSession()

  if (!session) {
    return apiError(
      "Authentication required.",
      401
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
    createProjectSchema.safeParse(body)

  if (!validation.success) {
    return apiValidationError(
      validation.error
    )
  }

  try {
    const collection =
      await getProjectsCollection()

    const slug =
      await generateUniqueProjectSlug(
        collection,
        validation.data.title
      )

    const now = new Date()

    const project: ProjectDocument = {
      ...validation.data,

      slug,

      createdAt: now,
      updatedAt: now,
    }

    const result =
      await collection.insertOne(project)

    const createdProject: ProjectWithId = {
      ...project,
      _id: result.insertedId,
    }

    return NextResponse.json(
      {
        success: true,
        data: projectToDTO(
          createdProject
        ),
      },
      {
        status: 201,
      }
    )
  } catch (error) {
    console.error(
      "POST /api/projects error:",
      error
    )

    if (
      error instanceof MongoServerError &&
      error.code === 11000
    ) {
      return apiError(
        "A project with this slug already exists.",
        409
      )
    }

    return apiError(
      "Unable to create project.",
      500
    )
  }
}