import { UserRepository } from '../repositories/user.repository';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { Role, UserStatus } from '@prisma/client';
import crypto from 'crypto';

export class AuthService {
  static async register(data: {
    employeeId: string;
    fullName: string;
    email: string;
    password: string;
  }) {
    const existingEmail = await UserRepository.findByEmail(data.email);
    if (existingEmail) {
      throw { statusCode: 409, message: 'Email is already registered' };
    }

    const existingEmp = await UserRepository.findByEmployeeId(data.employeeId);
    if (existingEmp) {
      throw { statusCode: 409, message: 'Employee ID is already in use' };
    }

    const passwordHash = await hashPassword(data.password);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const names = data.fullName.trim().split(' ');
    const firstName = names[0];
    const lastName = names.slice(1).join(' ') || '';

    // Public registration ALWAYS forces role = Role.EMPLOYEE
    const user = await UserRepository.createUser({
      employeeId: data.employeeId,
      email: data.email.toLowerCase(),
      passwordHash,
      role: Role.EMPLOYEE,
      status: UserStatus.ACTIVE,
      emailVerified: false,
      verificationToken,
      firstName,
      lastName,
    });

    // In dev environment, expose verification URL in console log
    console.log(`[DEV EMAIL VERIFICATION] Verification link for ${user.email}: http://localhost:3000/verify-email?token=${verificationToken}`);

    return {
      message: 'Registration successful. Please verify your email.',
      verificationToken,
      user: {
        id: user.id,
        employeeId: user.employeeId,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
      },
    };
  }

  static async login(data: { email: string; password: string }) {
    const user = await UserRepository.findByEmail(data.email.toLowerCase());
    if (!user) {
      throw { statusCode: 401, message: 'Invalid credentials' };
    }

    if (user.status === UserStatus.INACTIVE) {
      throw { statusCode: 403, message: 'Account is inactive. Contact HR administration.' };
    }

    const isMatch = await comparePassword(data.password, user.passwordHash);
    if (!isMatch) {
      throw { statusCode: 401, message: 'Invalid credentials' };
    }

    const token = generateToken({
      userId: user.id,
      employeeId: user.employeeId,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        employeeId: user.employeeId,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        status: user.status,
        profile: user.profile,
      },
    };
  }

  static async verifyEmail(token: string) {
    const user = await UserRepository.verifyEmail(token);
    if (!user) {
      throw { statusCode: 400, message: 'Invalid or expired verification token' };
    }
    return { message: 'Email successfully verified' };
  }

  static async getCurrentUser(userId: string) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw { statusCode: 404, message: 'User not found' };
    }
    const { passwordHash, verificationToken, ...safeUser } = user;
    return safeUser;
  }
}
