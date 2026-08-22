import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/repositories/prisma';

describe('Leave Application & Approval Transaction Suite', () => {
  let empToken: string;
  let hrToken: string;

  beforeAll(async () => {
    const empLogin = await request(app).post('/api/auth/login').send({
      email: 'emp2@dayflow.local',
      password: 'Password123!',
    });
    empToken = empLogin.body.data.token;

    const hrLogin = await request(app).post('/api/auth/login').send({
      email: 'hr@dayflow.local',
      password: 'Password123!',
    });
    hrToken = hrLogin.body.data.token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should validate leave application dates', async () => {
    const res = await request(app)
      .post('/api/leaves/apply')
      .set('Authorization', `Bearer ${empToken}`)
      .send({
        leaveType: 'PAID',
        startDate: '2025-10-10',
        endDate: '2025-10-05',
        reason: 'Invalid dates test',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should allow employee to submit valid leave application', async () => {
    const res = await request(app)
      .post('/api/leaves/apply')
      .set('Authorization', `Bearer ${empToken}`)
      .send({
        leaveType: 'SICK',
        startDate: '2025-11-03',
        endDate: '2025-11-04',
        reason: 'Medical checkup and rest',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('PENDING');
  });

  it('should allow HR to approve leave request via transaction', async () => {
    // Get all requests
    const listRes = await request(app)
      .get('/api/leaves?status=PENDING')
      .set('Authorization', `Bearer ${hrToken}`);

    expect(listRes.status).toBe(200);
    const pendingRequest = listRes.body.data[0];

    if (pendingRequest) {
      const approveRes = await request(app)
        .patch(`/api/leaves/${pendingRequest.id}/approve`)
        .set('Authorization', `Bearer ${hrToken}`)
        .send({ comment: 'Approved for medical recovery' });

      expect(approveRes.status).toBe(200);
      expect(approveRes.body.success).toBe(true);
      expect(approveRes.body.data.status).toBe('APPROVED');
    }
  });
});
