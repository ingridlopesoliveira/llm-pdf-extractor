import { z } from 'zod'

export const envSchema = z.object({
  PORT: z.string().default('3000'),

  DATABASE_URL: z.string(),

  OPENAI_API_KEY: z.string(),
  ENV_MODE: z.string().default('DEV'),
})

export type Env = z.infer<typeof envSchema>
