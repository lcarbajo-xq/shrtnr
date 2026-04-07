import { NextResponse } from 'next/server'
import { ZodError, type ZodSchema, type ZodIssue } from 'zod'

/**
 * Valida datos usando un schema de Zod y retorna un error formateado si falla
 */
export function validateData<T>(
  schema: ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: NextResponse } {
  try {
    const validatedData = schema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.issues.map((err: ZodIssue) => ({
        field: err.path.join('.'),
        message: err.message
      }))

      return {
        success: false,
        error: NextResponse.json(
          {
            message: 'Validation error',
            errors
          },
          { status: 400 }
        )
      }
    }

    return {
      success: false,
      error: NextResponse.json(
        { message: 'Invalid request data' },
        { status: 400 }
      )
    }
  }
}

/**
 * Valida datos de forma asíncrona (útil para validaciones con async refine)
 */
export async function validateDataAsync<T>(
  schema: ZodSchema<T>,
  data: unknown
): Promise<
  { success: true; data: T } | { success: false; error: NextResponse }
> {
  try {
    const validatedData = await schema.parseAsync(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.issues.map((err: ZodIssue) => ({
        field: err.path.join('.'),
        message: err.message
      }))

      return {
        success: false,
        error: NextResponse.json(
          {
            message: 'Validation error',
            errors
          },
          { status: 400 }
        )
      }
    }

    return {
      success: false,
      error: NextResponse.json(
        { message: 'Invalid request data' },
        { status: 400 }
      )
    }
  }
}
