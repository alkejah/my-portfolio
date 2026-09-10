import { NextResponse } from "next/server"

import { getProjectsCollection } from "@/models/project"

export const runtime = "nodejs"

export async function GET() {
  try {
    const collection = await getProjectsCollection()

    const [indexes, documentCount] = await Promise.all([
      collection.indexes(),
      collection.estimatedDocumentCount(),
    ])

    return NextResponse.json(
      {
        success: true,
        message: "Projects collection is ready.",
        collection: collection.collectionName,
        documentCount,
        indexes: indexes.map((index) => index.name),
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    console.error("Projects collection error:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Unable to initialize projects collection.",
      },
      {
        status: 500,
      }
    )
  }
}