import { envSchema } from './env.schema';

export default () => {
  const parsed = envSchema.parse(process.env);

  return {
    port: Number(parsed.PORT),
    database: {
      host: parsed.DATABASE_HOST,
      port: Number(parsed.DATABASE_PORT),
      user: parsed.DATABASE_USER,
      password: parsed.DATABASE_PASSWORD,
      name: parsed.DATABASE_NAME,
    },
    openai: {
      apiKey: parsed.OPENAI_API_KEY,
    },
  };
};
