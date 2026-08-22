import { z } from 'zod';
import { AttendanceStatus } from '@prisma/client';

export const checkInSchema = z.object({
  remarks: z.string().optional(),
});

export const checkOutSchema = z.object({
  remarks: z.string().optional(),
});

export const adminUpdateAttendanceSchema = z.object({
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  status: z.nativeEnum(AttendanceStatus),
  remarks: z.string().optional(),
});
