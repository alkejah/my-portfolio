export type ApiValidationIssue = {
  path: string
  message: string
}

export type ApiSuccessResponse<T> = {
  success: true
  data: T
}

export type ApiErrorResponse = {
  success: false
  message: string
  issues?: ApiValidationIssue[]
}

export type ApiResponse<T> =
  | ApiSuccessResponse<T>
  | ApiErrorResponse