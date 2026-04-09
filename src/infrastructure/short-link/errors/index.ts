export abstract class InfrastructureError extends Error {
  constructor(message: string) {
    super(message)
    this.name = new.target.name
  }
}

export class SQLiteOperationError extends InfrastructureError {
  constructor(
    message: string,
    public readonly cause?: unknown
  ) {
    super(message)
    this.name = 'SQLiteOperationError'
  }
}

export class DatabaseConnectionError extends InfrastructureError {
  constructor(message = 'Database connection error') {
    super(message)
  }
}

export class UniqueConstraintError extends InfrastructureError {
  constructor(
    public readonly field: string,
    message?: string
  ) {
    super(message ?? `Unique constraint violation on field: ${field}`)
  }
}

export class RepositoryError extends InfrastructureError {
  constructor(message = 'Repository error') {
    super(message)
  }
}
