import { z } from 'zod';

const roleEnum = z.enum(['admin', 'user', 'driver', 'company']);

export const registerSchema = z
  .object({
    name: z.string().min(1).max(200),
    email: z.string().email().max(320),
    password: z.string().min(10).max(128),
    role: roleEnum.optional().default('user'),
    licenseNumber: z.string().min(3).max(64).optional(),
    companyName: z.string().min(1).max(200).optional(),
    companyEmail: z.string().email().max(320).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === 'driver' && !data.licenseNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['licenseNumber'],
        message: 'licenseNumber is required for driver registration',
      });
    }
    if (data.role === 'company' && (!data.companyName || !data.companyEmail)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['companyName'],
        message: 'companyName and companyEmail are required for company registration',
      });
    }
    if (data.role === 'admin') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['role'],
        message: 'Admin accounts cannot be created via public registration',
      });
    }
  });

export const loginSchema = z.object({
  email: z.string().email().max(320),
  password: z.string().min(1).max(128),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(10),
});

export const verifyEmailQuerySchema = z.object({
  token: z.string().min(10),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email().max(320),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(10).max(128),
});
