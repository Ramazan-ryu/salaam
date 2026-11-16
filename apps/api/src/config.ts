import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().url(),
  API_PORT: z.coerce.number().int().positive().default(4000),
  /** DEV-ONLY header-based identity until spike S-AUTH (ADR-0010). */
  DEV_AUTH: z
    .enum(['true', 'false'])
    .default('false')
    .transform((v) => v === 'true'),
  /** D-25 (confirmed): automation above L1 stays disabled through MVP-1. */
  ALLOW_AUTOMATION_ABOVE_L1: z
    .enum(['true', 'false'])
    .default('false')
    .transform((v) => v === 'true'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
});

export type AppConfig = z.infer<typeof envSchema>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const config = envSchema.parse(env);
  if (config.NODE_ENV === 'production' && config.DEV_AUTH) {
    throw new Error(
      'DEV_AUTH must not be enabled in production. Real authentication is pending spike S-AUTH (ADR-0010).',
    );
  }
  return config;
}

export const CONFIG = Symbol('CONFIG');
