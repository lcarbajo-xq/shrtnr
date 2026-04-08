# Esquemas de validación para API Routes

Este directorio contiene los esquemas de Zod que se usan para validar los datos de entrada en las API Routes.

## Esquemas disponibles

### `createShortLinkSchema`

Valida los datos para crear un nuevo enlace corto.

**Campos**

- `originalUrl` (`string`, requerido): URL válida que se va a acortar.
- `title` (`string`, opcional): título del enlace, con una longitud de 1 a 200 caracteres.
- `customSlug` (`string`, opcional): slug personalizado con caracteres alfanuméricos, guiones y guiones bajos.

**Ejemplo**

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

Valida los datos para actualizar un enlace corto existente.

**Campos**

- `originalUrl` (`string`, opcional): nueva URL válida.
- `title` (`string`, opcional): nuevo título, con una longitud de 1 a 200 caracteres.

**Nota:** Debe enviarse al menos uno de estos campos.

**Ejemplo**

```typescript
import { updateShortLinkSchema } from '@/lib/schemas/url'

const data = {
  title: 'Nuevo título'
}

const result = updateShortLinkSchema.parse(data)
```

### `slugSchema`

Valida un `slug` individual.

**Reglas**

- No puede estar vacío.
- Debe tener como máximo 50 caracteres.
- Solo puede contener letras, números, guiones y guiones bajos.
- No puede empezar ni terminar con un guion.

### `slugParamSchema`

Valida los parámetros de ruta que contienen un `slug`.

## Función de validación

### `validateData<T>(schema, data)`

Utilidad para validar datos y devolver respuestas HTTP con un formato consistente.

**Parámetros**

- `schema`: esquema de Zod que se usará para la validación.
- `data`: datos que se van a validar.

**Retorno**

- Éxito: `{ success: true, data: T }`.
- Error: `{ success: false, error: NextResponse }`.

**Ejemplo de uso en una ruta de la API**

```typescript
import { createShortLinkSchema } from '@/lib/schemas/url'
import { validateData } from '@/lib/validation'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()

  const validation = validateData(createShortLinkSchema, body)
  if (!validation.success) {
    return validation.error // Devuelve un 400 con errores formateados.
  }

  // Puedes usar validation.data con seguridad porque ya está validado y tipado.
  const { originalUrl, title, customSlug } = validation.data

  // ... resto de la lógica
}
```

## Formato de la respuesta de error

Cuando la validación falla, se devuelve una respuesta con código `400` y el siguiente formato:

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

## Rutas de la API que usan validación

- `POST /api/links`: usa `createShortLinkSchema`.
- `PATCH /api/links/[id]`: usa `updateShortLinkSchema` y `slugParamSchema`.
- `GET /api/links/[id]`: usa `slugParamSchema`.
- `DELETE /api/links/[id]`: usa `slugParamSchema`.
- `GET /api/[slug]`: usa `slugParamSchema`.
