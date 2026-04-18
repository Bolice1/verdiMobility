import { z } from 'zod';

export const createCompanySchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
});
