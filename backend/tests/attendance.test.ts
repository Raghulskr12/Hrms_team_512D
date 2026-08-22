import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/repositories/prisma';

describe('Attendance Management Suite', () => {
  let token: string;
  let userId: string;

  beforeAll(async () => {
    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'emp1@dayflow.local',
      password: 'Password123!',
    });
    token = loginRes.body.data.token;
    userId = loginRes.body.data.user.id;

    // Clean today's test attendance if any
    const profile = await prisma.employeeProfile.findUnique({ where: { userId } });
    if (profile) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      await prisma.attendance.deleteMany({
        where: { employeeId: profile.id, date: today },
      });
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should allow employee to check in for today', async () => {
    const res = await request(app)
      .post('/api/attendance/check-in')
      .set('Authorization', `Bearer ${token}`)
      .send({ remarks: 'Starting work day' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.checkIn).toBeDefined();
    expect(res.body.data.status).toBe('PRESENT');
  });

  it('should prevent duplicate check-in on the same day', async () => {
    const res = await request(app)
      .post('/api/attendance/check-in')
      .set('Authorization', `Bearer ${token}`)
      .send({ remarks: 'Duplicate check in' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('already checked in');
  });

  it('should allow employee to check out and calculate worked hours', async () => {
    const res = await request(app)
      .post('/api/attendance/check-out')
      .set('Authorization', `Bearer ${token}`)
      .send({ remarks: 'Ending work day' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.checkOut).toBeDefined();
    expect(typeof res.body.data.workedHours).toBe('number');
  });
});
