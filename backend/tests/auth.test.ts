import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/repositories/prisma';

describe('Authentication & Authorization Suite', () => {
  const testEmployeeId = 'EMP-TEST-999';
  const testEmail = 'unittest@dayflow.local';

  afterAll(async () => {
    await prisma.notification.deleteMany({ where: { user: { email: testEmail } } });
    await prisma.employeeProfile.deleteMany({ where: { user: { email: testEmail } } });
    await prisma.user.deleteMany({ where: { email: testEmail } });
    await prisma.$disconnect();
  });

  it('should register a new user with strictly EMPLOYEE role', async () => {
    const res = await request(app).post('/api/auth/register').send({
      employeeId: testEmployeeId,
      fullName: 'Test User',
      email: testEmail,
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.role).toBe('EMPLOYEE');
  });

  it('should prevent registration with duplicate email or employeeId', async () => {
    const res = await request(app).post('/api/auth/register').send({
      employeeId: testEmployeeId,
      fullName: 'Duplicate User',
      email: testEmail,
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('should authenticate user and return JWT token', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testEmail,
      password: 'Password123!',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.role).toBe('EMPLOYEE');
  });
});
