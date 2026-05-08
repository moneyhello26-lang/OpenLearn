export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export const errorResponses = {
  unauthorized: new ApiError(401, 'Unauthorized'),
  forbidden: new ApiError(403, 'Forbidden'),
  notFound: new ApiError(404, 'Not found'),
  badRequest: (message: string) => new ApiError(400, message),
  internalError: new ApiError(500, 'Internal server error'),
}

export function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    return {
      status: error.statusCode,
      body: { error: error.message },
    }
  }

  console.error('Unexpected error:', error)
  return {
    status: 500,
    body: { error: 'Internal server error' },
  }
}
