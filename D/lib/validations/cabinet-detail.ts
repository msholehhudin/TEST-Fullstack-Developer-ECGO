import { z } from "zod";

export const cabinetIdSchema = z.string().uuid();
