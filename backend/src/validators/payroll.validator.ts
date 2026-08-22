import { z } from 'zod';

export const updateSalarySchema = z.object({
  basicSalary: z.number().min(0, 'Basic salary must be non-negative'),
  hra: z.number().min(0, 'HRA must be non-negative'),
  allowances: z.number().min(0, 'Allowances must be non-negative'),
  deductions: z.number().min(0, 'Deductions must be non-negative'),
  effectiveFrom: z.string().optional(),
});
