import { z } from 'zod';

const ratingSchema = z
  .number()
  .min(0.5, 'Puan en az 0.5 olmalı')
  .max(5, 'Puan en fazla 5 olabilir')
  .refine((v) => Math.round(v * 2) === v * 2, '0.5 adımlı puan giriniz');

export const createReviewSchema = z.object({
  contentId: z.string().uuid(),
  rating: ratingSchema,
  body: z.string().max(5000).optional(),
  containsSpoiler: z.boolean().optional().default(false),
});

export const updateReviewSchema = z.object({
  rating: ratingSchema.optional(),
  body: z.string().max(5000).nullable().optional(),
  containsSpoiler: z.boolean().optional(),
});

export const listReviewsQuerySchema = z.object({
  sort: z.enum(['newest', 'popular']).default('newest'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export const createCommentSchema = z.object({
  body: z.string().min(1, 'Yorum boş olamaz').max(2000),
});

export const updateCommentSchema = z.object({
  body: z.string().min(1).max(2000),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
export type ListReviewsQuery = z.infer<typeof listReviewsQuerySchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
