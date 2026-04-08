import { NextResponse } from 'next/server'
import { ZodError, type ZodSchema } from 'zod'

/**
 * Formatea un error de Zod en una respuesta HTTP
 */
function formatZodError(error: ZodError): NextResponse {
  const errors = error.issues.map((err) => ({
    field: err.path.join('.'),
    message: err.message
  }))

  return NextResponse.json(
    {
      message: 'Validation error',
      errors
    },
    { status: 400 }
  )
}

/**
 * Retorna una respuesta de error para datos de petición inválidos
 */
function invalidRequestResponse(): NextResponse {
  return NextResponse.json({ message: 'Invalid request data' }, { status: 400 })
}

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
      return {
        success: false,
        error: formatZodError(error)
      }
    }

    return {
      success: false,
      error: invalidRequestResponse()
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
      return {
        success: false,
        error: formatZodError(error)
      }
    }

    return {
      success: false,
      error: invalidRequestResponse()
    }
  }
}
