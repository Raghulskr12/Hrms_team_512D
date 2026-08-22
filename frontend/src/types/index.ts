export type Role = 'ADMIN' | 'HR' | 'EMPLOYEE';
export type UserStatus = 'ACTIVE' | 'INACTIVE';
export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'INTERN' | 'CONTRACT';
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LEAVE';
export type LeaveType = 'PAID' | 'SICK' | 'UNPAID' | 'BEREAVEMENT' | 'CASUAL' | 'EXAM';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface User {
  id: string;
  employeeId: string;
  email: string;
  role: Role;
  status: UserStatus;
  emailVerified: boolean;
  createdAt: string;
  profile?: EmployeeProfile;
}

export interface EmployeeProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  profilePicture?: string;
  designation: string;
  department: string;
  employmentType: EmploymentType;
  joiningDate: string;
  manager?: string;
  user?: User;
  bankDetails?: BankDetails;
  leaveBalances?: LeaveBalance[];
}

export interface BankDetails {
  id: string;
  employeeId: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  branchName: string;
}

export interface Attendance {
  id: string;
  employeeId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  workedHours: number;
  status: AttendanceStatus;
  remarks?: string;
  employee?: {
    id: string;
    firstName: string;
    lastName: string;
    department: string;
    designation: string;
    user?: { employeeId: string };
  };
}

export interface LeaveBalance {
  id: string;
  employeeId: string;
  leaveType: LeaveType;
  totalDays: number;
  usedDays: number;
  remainingDays: number;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  numberOfDays: number;
  reason: string;
  status: LeaveStatus;
  approvalComment?: string;
  approvedById?: string;
  approvedAt?: string;
  employee?: EmployeeProfile;
  approvedBy?: {
    id: string;
    employeeId: string;
    profile?: { firstName: string; lastName: string };
  };
}

export interface Salary {
  id: string;
  employeeId: string;
  basicSalary: number;
  hra: number;
  allowances: number;
  deductions: number;
  grossSalary: number;
  netSalary: number;
  effectiveFrom: string;
  effectiveTo?: string;
  employee?: EmployeeProfile;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface Document {
  id: string;
  employeeId: string;
  title: string;
  fileName: string;
  fileType: string;
  filePath: string;
  uploadedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}
