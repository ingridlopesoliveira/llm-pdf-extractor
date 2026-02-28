import { z } from 'zod'

export const dashboardQuerySchema = z
  .object({
    month: z.string().optional(),
    client: z.coerce.number().optional(),
    visualizeOnDashboard: z.coerce.boolean(),
  })
  .strict()

export type DashboardQueryDto = z.infer<typeof dashboardQuerySchema>
