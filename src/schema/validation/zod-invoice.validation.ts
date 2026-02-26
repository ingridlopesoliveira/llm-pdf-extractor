import { BadRequestException, PipeTransform } from '@nestjs/common'
import { ZodSchema } from 'zod'

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    const result = this.schema.safeParse(value)

    if (!result.success) {
      const formattedErrors = result.error.issues.map((issue) => ({
        field: issue.path.join('.') || 'query',
        message: issue.message,
      }))

      throw new BadRequestException({
        message: 'Validation failed',
        errors: formattedErrors,
      })
    }

    return result.data
  }
}
