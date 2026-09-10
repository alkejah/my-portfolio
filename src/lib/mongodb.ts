import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB

if (!uri) {
  throw new Error(
    "MONGODB_URI is not defined. Please add it to your .env.local file."
  )
}

if (!dbName) {
  throw new Error(
    "MONGODB_DB is not defined. Please add it to your .env.local file."
  )
}

const globalForMongo = globalThis as typeof globalThis & {
  mongoClientPromise?: Promise<MongoClient>
}

let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  if (!globalForMongo.mongoClientPromise) {
    const client = new MongoClient(uri)

    globalForMongo.mongoClientPromise = client.connect()
  }

  clientPromise = globalForMongo.mongoClientPromise
} else {
  const client = new MongoClient(uri)

  clientPromise = client.connect()
}

export async function getMongoClient() {
  return clientPromise
}

export async function getDatabase() {
  const client = await clientPromise

  return client.db(dbName)
}