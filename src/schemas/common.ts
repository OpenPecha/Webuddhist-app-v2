import { z } from 'zod';

export const imageSizesSchema = z.object({
  thumbnail: z.string(),
  medium: z.string(),
  original: z.string(),
});

export const paginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    skip: z.number(),
    limit: z.number(),
    total: z.number(),
  });
