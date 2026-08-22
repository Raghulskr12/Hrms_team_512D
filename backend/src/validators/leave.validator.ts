import { z } from 'zod';
import { LeaveType } from '@prisma/client';

export const applyLeaveSchema = z.object({
  leaveType: z.nativeEnum(LeaveType),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid start date' }),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid end date' }),
  reason: z.string().min(3, 'Reason must be at least 3 characters long'),
});

export type ApplyLeaveInput = z.infer<typeof applyLeaveSchema>;

export const leaveApprovalSchema = z.object({
  comment: z.string().optional(),
});

export const leaveRejectionSchema = z.object({
  comment: z.string().min(3, 'Rejection comment is required'),
});
