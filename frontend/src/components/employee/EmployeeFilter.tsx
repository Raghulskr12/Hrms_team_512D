import React from 'react';
import { Search } from 'lucide-react';

interface EmployeeFilterProps {
  search: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  departmentFilter: string;
  onDepartmentChange: (dept: string) => void;
}

export const EmployeeFilter: React.FC<EmployeeFilterProps> = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  departmentFilter,
  onDepartmentChange,
}) => {
  const statusTabs = [
    { id: 'ALL', label: 'All Employees' },
    { id: 'ACTIVE', label: 'Active' },
    { id: 'INACTIVE', label: 'Inactive' },
  ];

  const departments = ['ALL', 'Engineering', 'Human Resources', 'Design', 'Marketing', 'Executive'];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 self-start">
          {statusTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onStatusChange(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                statusFilter === tab.id
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Department Filters */}
        <div className="flex items-center space-x-3 flex-1 md:max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name, email, or employee ID..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <select
            value={departmentFilter}
            onChange={(e) => onDepartmentChange(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-purple-500"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept === 'ALL' ? 'All Departments' : dept}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
