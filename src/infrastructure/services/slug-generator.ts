import { ISlugGenerator } from '@/domain/services/slug-generator.interface'

export class SimpleSlugGenerator implements ISlugGenerator {
  generate(): string {
    return Math.random().toString(36).slice(2, 8)
  }
}
