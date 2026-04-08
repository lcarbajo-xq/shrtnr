import {
  ApplicationError,
  ShortLinkNotFoundError,
  UnableToGenerateUniqueSlugError
} from '@/application/short-link/errors/application-error'
import { DomainError } from '@/domain/short-link/errors/domain-error'
import { SQLiteOperationError } from '@/infrastructure/short-link/errors'
import { NextResponse } from 'next/server'

export function mapErrorToHttp(error: unknown) {
  if (error instanceof SQLiteOperationError) {
    return NextResponse.json(
      {
        error: {
          code: 'DATABASE_ERROR',
          message: 'Internal error occured while accessing the database'
        }
      },
      { status: 500 }
    )
  }
  if (error instanceof SyntaxError) {
    return NextResponse.json(
      {
        error: {
          code: 'INVALID_JSON',
          message: 'The request body contains invalid JSON'
        }
      },
      { status: 400 }
    )
  }
  if (error instanceof ShortLinkNotFoundError) {
    return NextResponse.json(
      {
        error: {
          code: error.code,
          message: error.message
        }
      },
      { status: 404 }
    )
  }

  if (error instanceof UnableToGenerateUniqueSlugError) {
    return NextResponse.json(
      {
        error: {
          code: error.code,
          message: error.message
        }
      },
      { status: 500 }
    )
  }

  if (error instanceof DomainError) {
    return NextResponse.json(
      {
        error: {
          code: error.code,
          message: error.message
        }
      },
      { status: 400 }
    )
  }

  if (error instanceof ApplicationError) {
    return NextResponse.json(
      {
        error: {
          code: error.code,
          message: error.message
        }
      },
      { status: 400 }
    )
  }

  return NextResponse.json(
    {
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred'
      }
    },
    { status: 500 }
  )
}
