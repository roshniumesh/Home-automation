import React from 'react';
import { Filter, SortAsc } from 'lucide-react';

interface TaskFiltersProps {
  filters: {
    completed?: boolean;
    priority?: string;
    sort?: string;
  };
  onFilterChange: (filters: any) => void;
  taskCounts: {
    total: number;
    completed: number;
    pending: number;
  };
}

const TaskFilters: React.FC<TaskFiltersProps> = ({ filters, onFilterChange, taskCounts }) => {
  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters };
    if (value === '' || value === undefined) {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters & Sort</h3>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            Total: {taskCounts.total}
          </span>
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
            Done: {taskCounts.completed}
          </span>
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
            Pending: {taskCounts.pending}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={filters.completed === undefined ? '' : filters.completed.toString()}
            onChange={(e) => handleFilterChange('completed', e.target.value === '' ? undefined : e.target.value === 'true')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Tasks</option>
            <option value="false">Pending</option>
            <option value="true">Completed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <select
            value={filters.priority || ''}
            onChange={(e) => handleFilterChange('priority', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            value={filters.sort || ''}
            onChange={(e) => handleFilterChange('sort', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Newest First</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={() => onFilterChange({})}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;