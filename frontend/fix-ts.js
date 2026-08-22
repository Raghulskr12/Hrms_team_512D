const fs = require('fs');

const fixes = [
  {
    file: 'src/app/(admin)/admin/employees/[id]/page.tsx',
    replace: [['setEmployee(data);', 'setEmployee(data || null);']]
  },
  {
    file: 'src/app/(admin)/admin/employees/page.tsx',
    replace: [
      ['setEmployees(res.employees || []);', 'setEmployees(res?.employees || []);'],
      ['setTotal(res.total || 0);', 'setTotal(res?.total || 0);']
    ]
  },
  {
    file: 'src/app/(dashboard)/attendance/page.tsx',
    replace: [['setTodayAttendance(attRes);', 'setTodayAttendance(attRes || null);'], ['setAttendance(data);', 'setAttendance(data || null);']]
  },
  {
    file: 'src/app/(dashboard)/dashboard/page.tsx',
    replace: [
      ['setEmployee(empData);', 'setEmployee(empData || null);'],
      ['setTodayAttendance(attData);', 'setTodayAttendance(attData || null);']
    ]
  },
  {
    file: 'src/app/(dashboard)/profile/page.tsx',
    replace: [['setProfile(data);', 'setProfile(data || null);']]
  },
  {
    file: 'src/app/(dashboard)/salary/page.tsx',
    replace: [['setProfile(data);', 'setProfile(data || null);']]
  },
  {
    file: 'src/components/employee/ProfileBankTab.tsx',
    replace: [['setBankDetails(data);', 'setBankDetails(data || null);']]
  },
  {
    file: 'src/components/employee/ProfileSalaryTab.tsx',
    replace: [['setSalary(data);', 'setSalary(data || null);']]
  },
  {
    file: 'src/context/AuthContext.tsx',
    replace: [['setUser(userRes);', 'setUser(userRes || null);']]
  }
];

for (const fix of fixes) {
  try {
    let content = fs.readFileSync(fix.file, 'utf8');
    for (const [from, to] of fix.replace) {
      content = content.replace(from, to);
    }
    fs.writeFileSync(fix.file, content, 'utf8');
    console.log('Fixed', fix.file);
  } catch (e) {
    console.error('Failed to fix', fix.file, e.message);
  }
}
