import { envSchema } from './env.schema'

export default () => {
  const parsed = envSchema.parse(process.env)

  return {
    port: Number(parsed.PORT),
    database: {
      url: parsed.DATABASE_URL,
    },
    openai: {
      apiKey: parsed.OPENAI_API_KEY,
    },
  }
}
