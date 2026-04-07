import { describe, expect, beforeEach, vi, test } from 'vitest'
import { GET, POST } from './route'
import { NextRequest } from 'next/server'
import {
  ShortLinkNotFoundError,
  UnableToGenerateUniqueSlugError
} from '@/application/short-link/errors/application-error'
import {
  SlugAlreadyExistsError
} from '@/domain/short-link/errors/domain-error'

const generateExecuteMock = vi.hoisted(() => vi.fn())
const getAllExecuteMock = vi.hoisted(() => vi.fn())

vi.mock('@/infrastructure/short-link/shared/service-container', () => ({
  serviceContainer: {
    shortLink: {
      generate: {
        execute: generateExecuteMock
      },
      getAll: {
        execute: getAllExecuteMock
      }
    }
  }
}))

describe('GET /api/links', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('returns an empty array when there are no links', async () => {
    getAllExecuteMock.mockResolvedValue([])

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual([])
    expect(getAllExecuteMock).toHaveBeenCalledOnce()
  })

  test('returns all links', async () => {
    const mockLinks = [
      {
        toPrimitives: () => ({
          id: 'id-1',
          originalUrl: 'https://example.com/one',
          slug: 'one-link',
          title: 'One Link',
          shortUrl: 'http://localhost:3000/one-link',
          createdAt: '2026-03-30T10:00:00.000Z'
        })
      },
      {
        toPrimitives: () => ({
          id: 'id-2',
          originalUrl: 'https://example.com/two',
          slug: 'two-link',
          title: 'Two Link',
          shortUrl: 'http://localhost:3000/two-link',
          createdAt: '2026-03-30T10:00:01.000Z'
        })
      }
    ]

    getAllExecuteMock.mockResolvedValue(mockLinks)

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveLength(2)
    expect(data).toEqual([
      {
        id: 'id-1',
        originalUrl: 'https://example.com/one',
        slug: 'one-link',
        title: 'One Link',
        shortUrl: 'http://localhost:3000/one-link',
        createdAt: '2026-03-30T10:00:00.000Z'
      },
      {
        id: 'id-2',
        originalUrl: 'https://example.com/two',
        slug: 'two-link',
        title: 'Two Link',
        shortUrl: 'http://localhost:3000/two-link',
        createdAt: '2026-03-30T10:00:01.000Z'
      }
    ])
  })

  test('returns 500 when an unexpected error occurs', async () => {
    getAllExecuteMock.mockRejectedValue(new Error('Database connection failed'))

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data).toEqual({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred'
      }
    })
  })
})

describe('POST /api/links', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('creates a short link and returns status 201', async () => {
    generateExecuteMock.mockResolvedValue(undefined)

    const request = new NextRequest('http://localhost:3000/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        originalUrl: 'https://example.com/post',
        customSlug: 'my-post',
        title: 'My Post'
      })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(generateExecuteMock).toHaveBeenCalledWith({
      originalUrl: 'https://example.com/post',
      customSlug: 'my-post',
      title: 'My Post'
    })
    expect(data).toEqual({ status: 201 })
  })

  test('creates a short link without optional fields', async () => {
    generateExecuteMock.mockResolvedValue(undefined)

    const request = new NextRequest('http://localhost:3000/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        originalUrl: 'https://example.com/article'
      })
    })

    const response = await POST(request)

    expect(response.status).toBe(201)
    expect(generateExecuteMock).toHaveBeenCalledWith({
      originalUrl: 'https://example.com/article',
      title: undefined,
      customSlug: undefined
    })
  })

  test('returns 400 when slug already exists', async () => {
    generateExecuteMock.mockRejectedValue(new SlugAlreadyExistsError('my-post'))

    const request = new NextRequest('http://localhost:3000/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        originalUrl: 'https://example.com/post',
        customSlug: 'my-post',
        title: 'My Post'
      })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(409)
    expect(data).toEqual({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Slug already exists: my-post'
      }
    })
  })

  test('returns 404 when short link is not found', async () => {
    generateExecuteMock.mockRejectedValue(
      new ShortLinkNotFoundError('non-existent')
    )

    const request = new NextRequest('http://localhost:3000/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        originalUrl: 'https://example.com/post',
        customSlug: 'non-existent'
      })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data).toEqual({
      error: {
        code: 'SHORT_LINK_NOT_FOUND',
        message: 'Short link not found for slug: non-existent'
      }
    })
  })

  test('returns 500 when unable to generate unique slug', async () => {
    generateExecuteMock.mockRejectedValue(new UnableToGenerateUniqueSlugError())

    const request = new NextRequest('http://localhost:3000/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        originalUrl: 'https://example.com/post'
      })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data).toEqual({
      error: {
        code: 'UNABLE_TO_GENERATE_UNIQUE_SLUG',
        message: 'Unable to generate a unique slug'
      }
    })
  })

  test('returns 400 when URL is invalid', async () => {
    const request = new NextRequest('http://localhost:3000/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        originalUrl: 'not-a-url'
      })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toEqual({
      message: 'Validation error',
      errors: [
        {
          field: 'originalUrl',
          message: 'Invalid URL format'
        }
      ]
    })
  })

  test('returns 400 when slug is invalid', async () => {
    const request = new NextRequest('http://localhost:3000/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        originalUrl: 'https://example.com/post',
        customSlug: 'invalid slug with spaces!'
      })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toEqual({
      message: 'Validation error',
      errors: [
        {
          field: 'customSlug',
          message: 'Slug can only contain letters, numbers, hyphens, and underscores'
        }
      ]
    })
  })

  test('returns 500 when an unexpected error occurs', async () => {
    generateExecuteMock.mockRejectedValue(new Error('Unexpected error'))

    const request = new NextRequest('http://localhost:3000/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        originalUrl: 'https://example.com/post'
      })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data).toEqual({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred'
      }
    })
  })

  test('handles malformed JSON body', async () => {
    const request = new NextRequest('http://localhost:3000/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not valid json'
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data).toEqual({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred'
      }
    })
  })
})
