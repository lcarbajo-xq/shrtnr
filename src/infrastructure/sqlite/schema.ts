import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const linksTable = sqliteTable('links', {
  slug: text('slug').notNull().unique().primaryKey(),
  title: text('title'),
  clicks: text('clicks').default('0').notNull(),
  updatedAt: text('updated_at').notNull(),
  originalUrl: text('original_url').notNull(),
  createdAt: text('created_at').notNull()
})

export type LinkRow = typeof linksTable.$inferSelect
