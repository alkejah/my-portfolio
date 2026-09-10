import { ObjectId } from "mongodb"

const OBJECT_ID_PATTERN =
  /^[0-9a-fA-F]{24}$/

export function parseObjectId(
  value: string
): ObjectId | null {
  if (!OBJECT_ID_PATTERN.test(value)) {
    return null
  }

  if (!ObjectId.isValid(value)) {
    return null
  }

  return new ObjectId(value)
}