import { z } from "zod";

export const pagingSchema = z.object({
  cursor: z.union([z.number(), z.string(), z.null()]).optional(),
  limit: z.number().optional(),
  total: z.number().optional(),
  hasNext: z.boolean().optional(),
});
export type Paging = z.infer<typeof pagingSchema>;

export const envelopeSchema = <T extends z.ZodTypeAny>(data: T) =>
  z.object({
    data,
    paging: pagingSchema.optional(),
  });
