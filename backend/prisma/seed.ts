import { PrismaClient, Role, UserStatus, EmploymentType, AttendanceStatus, LeaveType, LeaveStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Dayflow HRMS Database Seeding...');

  // Clear existing records
  await prisma.document.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.salary.deleteMany();
  await prisma.leaveRequest.deleteMany();
  await prisma.leaveBalance.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.bankDetails.deleteMany();
  await prisma.employeeProfile.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 1. Admin User
  const adminUser = await prisma.user.create({
    data: {
      employeeId: 'EMP-001',
      email: 'admin@dayflow.local',
      passwordHash,
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      profile: {
        create: {
          firstName: 'Alexander',
          lastName: 'Wright',
          phone: '+1 (555) 019-2834',
          dateOfBirth: new Date('1985-04-12'),
          gender: 'Male',
          address: '742 Evergreen Terrace',
          city: 'San Francisco',
          state: 'CA',
          postalCode: '94107',
          designation: 'VP of Human Resources',
          department: 'Executive',
          employmentType: EmploymentType.FULL_TIME,
          joiningDate: new Date('2020-01-15'),
          bankDetails: {
            create: {
              accountHolderName: 'Alexander Wright',
              accountNumber: '987654321011',
              ifscCode: 'CHAS0001234',
              bankName: 'Chase Bank',
              branchName: 'Financial District SF',
            },
          },
        },
      },
    },
    include: { profile: true },
  });

  // 2. HR User
  const hrUser = await prisma.user.create({
    data: {
      employeeId: 'EMP-002',
      email: 'hr@dayflow.local',
      passwordHash,
      role: Role.HR,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      profile: {
        create: {
          firstName: 'Sophia',
          lastName: 'Martinez',
          phone: '+1 (555) 014-9821',
          dateOfBirth: new Date('1990-08-25'),
          gender: 'Female',
          address: '1088 Mission Street',
          city: 'San Francisco',
          state: 'CA',
          postalCode: '94103',
          designation: 'HR Lead Specialist',
          department: 'Human Resources',
          employmentType: EmploymentType.FULL_TIME,
          joiningDate: new Date('2021-03-01'),
          manager: 'Alexander Wright',
          bankDetails: {
            create: {
              accountHolderName: 'Sophia Martinez',
              accountNumber: '876543210922',
              ifscCode: 'BOFA0005678',
              bankName: 'Bank of America',
              branchName: 'Soma Branch',
            },
          },
        },
      },
    },
    include: { profile: true },
  });

  // 3. Five Employees
  const employeeSeeds = [
    {
      employeeId: 'EMP-003',
      email: 'emp1@dayflow.local',
      firstName: 'David',
      lastName: 'Chen',
      designation: 'Senior Frontend Engineer',
      department: 'Engineering',
      employmentType: EmploymentType.FULL_TIME,
      joiningDate: new Date('2022-05-10'),
      basic: 7000,
      hra: 2500,
      allowances: 1500,
      deductions: 1000,
    },
    {
      employeeId: 'EMP-004',
      email: 'emp2@dayflow.local',
      firstName: 'Emily',
      lastName: 'Watson',
      designation: 'UI/UX Product Designer',
      department: 'Design',
      employmentType: EmploymentType.FULL_TIME,
      joiningDate: new Date('2022-09-01'),
      basic: 6500,
      hra: 2200,
      allowances: 1300,
      deductions: 900,
    },
    {
      employeeId: 'EMP-005',
      email: 'emp3@dayflow.local',
      firstName: 'Marcus',
      lastName: 'Vance',
      designation: 'Backend Systems Architect',
      department: 'Engineering',
      employmentType: EmploymentType.FULL_TIME,
      joiningDate: new Date('2021-11-15'),
      basic: 8000,
      hra: 3000,
      allowances: 1800,
      deductions: 1200,
    },
    {
      employeeId: 'EMP-006',
      email: 'emp4@dayflow.local',
      firstName: 'Priya',
      lastName: 'Sharma',
      designation: 'Marketing Growth Lead',
      department: 'Marketing',
      employmentType: EmploymentType.CONTRACT,
      joiningDate: new Date('2023-02-01'),
      basic: 5500,
      hra: 1800,
      allowances: 1000,
      deductions: 700,
    },
    {
      employeeId: 'EMP-007',
      email: 'emp5@dayflow.local',
      firstName: 'Lucas',
      lastName: 'Miller',
      designation: 'Software Engineering Intern',
      department: 'Engineering',
      employmentType: EmploymentType.INTERN,
      joiningDate: new Date('2024-01-10'),
      basic: 3000,
      hra: 800,
      allowances: 400,
      deductions: 200,
    },
  ];

  const createdEmployees = [];

  for (const empData of employeeSeeds) {
    const user = await prisma.user.create({
      data: {
        employeeId: empData.employeeId,
        email: empData.email,
        passwordHash,
        role: Role.EMPLOYEE,
        status: UserStatus.ACTIVE,
        emailVerified: true,
        profile: {
          create: {
            firstName: empData.firstName,
            lastName: empData.lastName,
            phone: `+1 (555) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
            dateOfBirth: new Date('1994-06-15'),
            gender: empData.firstName === 'Emily' || empData.firstName === 'Priya' ? 'Female' : 'Male',
            address: '100 Tech Way',
            city: 'San Francisco',
            state: 'CA',
            postalCode: '94105',
            designation: empData.designation,
            department: empData.department,
            employmentType: empData.employmentType,
            joiningDate: empData.joiningDate,
            manager: 'Sophia Martinez',
            bankDetails: {
              create: {
                accountHolderName: `${empData.firstName} ${empData.lastName}`,
                accountNumber: `4455${Math.floor(10000000 + Math.random() * 90000000)}`,
                ifscCode: 'WFOM0009988',
                bankName: 'Wells Fargo',
                branchName: 'Market Street SF',
              },
            },
          },
        },
      },
      include: { profile: true },
    });

    createdEmployees.push(user);

    // Leave balances
    const isIntern = empData.employmentType === EmploymentType.INTERN;
    await prisma.leaveBalance.createMany({
      data: [
        { employeeId: user.profile!.id, leaveType: LeaveType.PAID, totalDays: 18, usedDays: 3, remainingDays: 15 },
        { employeeId: user.profile!.id, leaveType: LeaveType.SICK, totalDays: 12, usedDays: 2, remainingDays: 10 },
        { employeeId: user.profile!.id, leaveType: LeaveType.CASUAL, totalDays: 7, usedDays: 1, remainingDays: 6 },
        { employeeId: user.profile!.id, leaveType: LeaveType.UNPAID, totalDays: 10, usedDays: 0, remainingDays: 10 },
        { employeeId: user.profile!.id, leaveType: LeaveType.BEREAVEMENT, totalDays: 5, usedDays: 0, remainingDays: 5 },
        ...(isIntern ? [{ employeeId: user.profile!.id, leaveType: LeaveType.EXAM, totalDays: 5, usedDays: 0, remainingDays: 5 }] : []),
      ],
    });

    // Salary Structure
    const gross = empData.basic + empData.hra + empData.allowances;
    const net = gross - empData.deductions;
    await prisma.salary.create({
      data: {
        employeeId: user.profile!.id,
        basicSalary: empData.basic,
        hra: empData.hra,
        allowances: empData.allowances,
        deductions: empData.deductions,
        grossSalary: gross,
        netSalary: net,
        effectiveFrom: new Date('2024-01-01'),
      },
    });

    // Generate Attendance Records for past 30 days
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) continue; // Skip weekends

      // Randomize attendance status
      const rand = Math.random();
      let status: AttendanceStatus = AttendanceStatus.PRESENT;
      let checkIn: Date | null = new Date(date);
      checkIn.setHours(9, Math.floor(Math.random() * 15), 0);

      let checkOut: Date | null = new Date(date);
      checkOut.setHours(17, Math.floor(Math.random() * 30), 0);

      let workedHours = 8.2;

      if (rand > 0.92) {
        status = AttendanceStatus.ABSENT;
        checkIn = null;
        checkOut = null;
        workedHours = 0;
      } else if (rand > 0.84) {
        status = AttendanceStatus.HALF_DAY;
        checkOut = new Date(date);
        checkOut.setHours(13, 0, 0);
        workedHours = 4.0;
      }

      await prisma.attendance.create({
        data: {
          employeeId: user.profile!.id,
          date,
          checkIn,
          checkOut,
          workedHours,
          status,
          remarks: status === AttendanceStatus.ABSENT ? 'Unexplained absence' : 'Regular workday',
        },
      });
    }

    // Leave requests
    await prisma.leaveRequest.create({
      data: {
        employeeId: user.profile!.id,
        leaveType: LeaveType.PAID,
        startDate: new Date('2024-09-01'),
        endDate: new Date('2024-09-03'),
        numberOfDays: 3,
        reason: 'Family vacation and personal downtime',
        status: LeaveStatus.PENDING,
      },
    });

    await prisma.leaveRequest.create({
      data: {
        employeeId: user.profile!.id,
        leaveType: LeaveType.SICK,
        startDate: new Date('2024-07-10'),
        endDate: new Date('2024-07-11'),
        numberOfDays: 2,
        reason: 'Flu recovery and doctor appointment',
        status: LeaveStatus.APPROVED,
        approvedById: hrUser.id,
        approvalComment: 'Approved. Get well soon!',
        approvedAt: new Date('2024-07-09'),
      },
    });

    // Sample Notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Welcome to Dayflow HRMS',
        message: 'Your employee profile is fully initialized. Explore your attendance, leaves, and salary details.',
        type: 'INFO',
      },
    });
  }

  console.log('✅ Dayflow HRMS Database Seeding Complete!');
  console.log('--------------------------------------------------');
  console.log('🔑 Seeded Credentials for Testing:');
  console.log('👉 ADMIN: admin@dayflow.local / Password123! (ID: EMP-001)');
  console.log('👉 HR:    hr@dayflow.local    / Password123! (ID: EMP-002)');
  console.log('👉 EMP 1: emp1@dayflow.local  / Password123! (ID: EMP-003)');
  console.log('👉 EMP 2: emp2@dayflow.local  / Password123! (ID: EMP-004)');
  console.log('👉 EMP 5: emp5@dayflow.local  / Password123! (ID: EMP-007) [INTERN]');
  console.log('--------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
