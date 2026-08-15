import { z } from "zod";

export const getCabinetsSchema = z.object({
  search: z.string().optional(),

  status: z
    .enum(["ALL", "ONLINE", "OFFLINE", "MAINTENANCE"])
    .default("ALL"),

  sortBy: z
    .enum(["code", "status", "branch", "heartbeat"])
    .default("code"),

  sortOrder: z
    .enum(["asc", "desc"])
    .default("asc"),

  page: z.coerce
    .number()
    .int()
    .positive()
    .default(1),

  pageSize: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(10),
});

export type GetCabinetsInput = z.infer<
  typeof getCabinetsSchema
>;