import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.string().default("").optional(),
  DATABASE_URL: z.string().min(1, "DATABASE_URL must be set"),
  REDIS_URL: z.string().min(1, "REDIS_URL must be set"),
  SESSION_SECRET: z.string().min(1, "SESSION_SECRET must be set"),
  SESSION_TTL: z.string().min(1, "SESSION_TTL must be set").default("7"),
  // SENTRY_DSN: z.string().min(1, "SENTRY_DSN must be set"),
  // SENTRY_AUTH_TOKEN: z.string().default("").optional(),
  S3_API_HOST: z.string().min(1, "S3_API_HOST must be set").optional(),
  S3_ACCESS_KEY_ID: z
    .string()
    .min(1, "S3_ACCESS_KEY_ID must be set")
    .optional(),
  S3_SECRET_ACCESS_KEY: z
    .string()
    .min(1, "S3_SECRET_ACCESS_KEY must be set")
    .optional(),
  S3_DEFAULT_REGION: z
    .string()
    .min(1, "S3_DEFAULT_REGION must be set")
    .optional(),
  S3_BUCKET: z.string().min(1, "S3_BUCKET must be set").optional(),
  S3_DOWNLOAD_URL: z.string().optional(),
});

export const env = () => envSchema.parse(process.env);
