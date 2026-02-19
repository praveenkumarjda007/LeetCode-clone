import { z } from 'zod';
import { insertSubmissionSchema, problems, submissions } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  problems: {
    list: {
      method: 'GET' as const,
      path: '/api/problems' as const,
      responses: {
        200: z.array(z.custom<typeof problems.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/problems/:slug' as const,
      responses: {
        200: z.custom<typeof problems.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  submissions: {
    create: {
      method: 'POST' as const,
      path: '/api/submissions' as const,
      input: z.object({
        problemId: z.number(),
        code: z.string(),
        language: z.string(),
      }),
      responses: {
        201: z.custom<typeof submissions.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/submissions' as const, // For current user
      responses: {
        200: z.array(z.custom<typeof submissions.$inferSelect & { problem: typeof problems.$inferSelect }>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/submissions/:id' as const,
      responses: {
        200: z.custom<typeof submissions.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
