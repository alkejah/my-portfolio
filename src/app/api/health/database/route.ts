import { NextResponse } from "next/server"

import { getDatabase } from "@/lib/mongodb"

export const runtime = "nodejs"

export async function GET() {
  try {
    const db = await getDatabase()

    await db.command({
      ping: 1,
    })

    return NextResponse.json(
      {
        success: true,
        message: "MongoDB connection successful.",
        database: db.databaseName,
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    console.error("MongoDB connection error:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Unable to connect to MongoDB.",
      },
      {
        status: 500,
      }
    )
  }
}