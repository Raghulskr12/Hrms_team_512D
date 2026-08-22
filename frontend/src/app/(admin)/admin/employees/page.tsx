'use client';

import React, { useState, useEffect } from 'react';
import { employeeService } from '../../../../services/employeeService';
import { EmployeeProfile } from '../../../../types';
import { EmployeeFilter } from '../../../../components/employee/EmployeeFilter';
import { EmployeeCard } from '../../../../components/employee/EmployeeCard';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../../components/ui/Table';
import { Badge } from '../../../../components/ui/Badge';
import { LoadingSpinner } from '../../../../components/ui/LoadingSpinner';
import { EmptyState } from '../../../../components/ui/EmptyState';
import { LayoutGrid, List } from 'lucide-react';
import Link from 'next/link';

export default function AdminEmployeesPage() {
  const [employees, setEmployees] = useState<EmployeeProfile[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await employeeService.getAll({
        search,
        status: statusFilter,
        department: departmentFilter,
      });

      setEmployees(res.employees || []);
      setTotal(res.total || 0);
    } catch (e) {
      console.error('Error fetching employees:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEmployees();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, statusFilter, departmentFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Employee Directory ({total})</h2>
          <p className="text-xs text-slate-400 mt-0.5">Search, filter, and inspect detailed employee profiles.</p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-lg self-start">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            title="Grid Cards View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'table' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            title="Table List View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Component */}
      <EmployeeFilter
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        departmentFilter={departmentFilter}
        onDepartmentChange={setDepartmentFilter}
      />

      {/* Content */}
      {loading ? (
        <LoadingSpinner message="Loading employee directory..." />
      ) : employees.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {employees.map((emp) => (
              <EmployeeCard key={emp.id} employee={emp} />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee ID</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell className="font-mono text-xs text-slate-300">{emp.user?.employeeId}</TableCell>
                  <TableCell className="font-semibold text-slate-100">{emp.firstName} {emp.lastName}</TableCell>
                  <TableCell>{emp.department}</TableCell>
                  <TableCell className="text-slate-300">{emp.designation}</TableCell>
                  <TableCell className="text-xs text-slate-400">{emp.employmentType}</TableCell>
                  <TableCell>
                    <Badge variant={emp.user?.status === 'ACTIVE' ? 'success' : 'neutral'}>
                      {emp.user?.status || 'ACTIVE'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/employees/${emp.id}`}
                      className="text-xs font-semibold text-purple-400 hover:underline"
                    >
                      View Profile →
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )
      ) : (
        <EmptyState title="No employees found" description="Try clearing search queries or adjusting filters." />
      )}
    </div>
  );
}
