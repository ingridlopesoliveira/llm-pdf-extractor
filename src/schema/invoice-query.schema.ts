import { z } from 'zod'

export const invoicesQuerySchema = z
  .object({
    page: z.coerce.number().min(1).default(1),

    pageSize: z.coerce.number().min(1).max(100).default(10),

    month: z.string().optional(),
    client: z.coerce.number().optional(),
  })
  .strict()

export type InvoicesQueryDto = z.infer<typeof invoicesQuerySchema>
