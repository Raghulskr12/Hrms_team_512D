import { z } from 'zod';
import { EmploymentType, Role, UserStatus } from '@prisma/client';

export const updateProfileSchema = z.object({
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  profilePicture: z.string().optional(),
});

export const adminUpdateEmployeeSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  designation: z.string().optional(),
  department: z.string().optional(),
  employmentType: z.nativeEnum(EmploymentType).optional(),
  joiningDate: z.string().optional(),
  manager: z.string().optional(),
  role: z.nativeEnum(Role).optional(),
  status: z.nativeEnum(UserStatus).optional(),
});

export const updateBankDetailsSchema = z.object({
  accountHolderName: z.string().min(2, 'Account holder name is required'),
  accountNumber: z.string().min(5, 'Account number is required'),
  ifscCode: z.string().min(4, 'IFSC code is required'),
  bankName: z.string().min(2, 'Bank name is required'),
  branchName: z.string().min(2, 'Branch name is required'),
});
