# Esquemas de Validación para API Routes

Este directorio contiene los esquemas de validación Zod utilizados para validar datos de entrada en las API Routes.

## Esquemas Disponibles

### `createShortLinkSchema`

Valida los datos para crear un nuevo short link.

**Campos:**

- `originalUrl` (string, requerido): URL válida que se va a acortar
- `title` (string, opcional): Título del link (1-200 caracteres)
- `customSlug` (string, opcional): Slug personalizado (alfanumérico, guiones, guiones bajos)

**Ejemplo:**

```typescript
import { createShortLinkSchema } from '@/lib/schemas/url'

const data = {
  originalUrl: 'https://example.com/very-long-url',
  title: 'Mi página web',
  customSlug: 'mi-pagina'
}

const result = createShortLinkSchema.parse(data)
```

### `updateShortLinkSchema`

Valida los datos para actualizar un short link existente.

**Campos:**

- `originalUrl` (string, opcional): Nueva URL válida
- `title` (string, opcional): Nuevo título (1-200 caracteres)

**Nota:** Al menos uno de los campos debe estar presente.

**Ejemplo:**

```typescript
import { updateShortLinkSchema } from '@/lib/schemas/url'

const data = {
  title: 'Nuevo título'
}

const result = updateShortLinkSchema.parse(data)
```

### `slugSchema`

Valida un slug individual.

**Reglas:**

- No puede estar vacío
- Máximo 50 caracteres
- Solo letras, números, guiones y guiones bajos
- No puede empezar o terminar con guión

### `slugParamSchema`

Validan parámetros de ruta que contienen slugs.

## Función de Validación

### `validateData<T>(schema, data)`

Función helper para validar datos y retornar respuestas HTTP formateadas.

**Parámetros:**

- `schema`: Schema de Zod a usar para la validación
- `data`: Datos a validar

**Retorno:**

- Éxito: `{ success: true, data: T }`
- Error: `{ success: false, error: NextResponse }`

**Ejemplo de uso en API Route:**

```typescript
import { createShortLinkSchema } from '@/lib/schemas/url'
import { validateData } from '@/lib/validation'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()

  const validation = validateData(createShortLinkSchema, body)
  if (!validation.success) {
    return validation.error // Retorna 400 con errores formateados
  }

  // Usar validation.data con confianza (está tipado y validado)
  const { originalUrl, title, customSlug } = validation.data

  // ... resto de la lógica
}
```

## Formato de Respuesta de Error

Cuando la validación falla, se retorna una respuesta con status 400 y el siguiente formato:

```json
{
  "message": "Validation error",
  "errors": [
    {
      "field": "originalUrl",
      "message": "Invalid URL format"
    },
    {
      "field": "customSlug",
      "message": "Slug can only contain letters, numbers, hyphens, and underscores"
    }
  ]
}
```

## API Routes que Usan Validación

- `POST /api/links` - Usa `createShortLinkSchema`
- `PATCH /api/links/[id]` - Usa `updateShortLinkSchema` y `slugParamSchema`
- `GET /api/links/[id]` - Usa `slugParamSchema`
- `DELETE /api/links/[id]` - Usa `slugParamSchema`
- `GET /api/[slug]` - Usa `slugParamSchema`
