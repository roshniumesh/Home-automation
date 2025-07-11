import React, { useState } from 'react';
import { Task } from '../../types';
import { 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Edit3, 
  Trash2, 
  AlertCircle,
  Clock
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onEdit, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      try {
        await onDelete(task._id);
      } catch (error) {
        setIsDeleting(false);
      }
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
  const isDueSoon = task.dueDate && 
    new Date(task.dueDate) > new Date() && 
    new Date(task.dueDate).getTime() - new Date().getTime() < 24 * 60 * 60 * 1000 && 
    !task.completed;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={`
      bg-white rounded-xl shadow-md border-2 transition-all duration-300 hover:shadow-lg
      ${task.completed ? 'opacity-75 border-gray-200' : getPriorityColor(task.priority)}
      ${isDeleting ? 'opacity-50 pointer-events-none' : ''}
    `}>
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <button
            onClick={() => onToggle(task._id)}
            className={`
              flex-shrink-0 mt-1 transition-colors duration-200
              ${task.completed ? 'text-green-500' : 'text-gray-400 hover:text-green-500'}
            `}
          >
            {task.completed ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : (
              <Circle className="w-6 h-6" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className={`
                text-lg font-semibold transition-all duration-200
                ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}
              `}>
                {task.title}
              </h3>
              
              <div className="flex items-center space-x-2 ml-4">
                <span className={`
                  px-2 py-1 rounded-full text-xs font-medium
                  ${getPriorityBadgeColor(task.priority)}
                `}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
              </div>
            </div>

            {task.description && (
              <p className={`
                text-sm mb-3 transition-all duration-200
                ${task.completed ? 'text-gray-400' : 'text-gray-600'}
              `}>
                {task.description}
              </p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                {task.dueDate && (
                  <div className={`
                    flex items-center space-x-1
                    ${isOverdue ? 'text-red-600' : isDueSoon ? 'text-yellow-600' : ''}
                  `}>
                    {isOverdue ? (
                      <AlertCircle className="w-4 h-4" />
                    ) : isDueSoon ? (
                      <Clock className="w-4 h-4" />
                    ) : (
                      <Calendar className="w-4 h-4" />
                    )}
                    <span className="font-medium">
                      {formatDate(task.dueDate)}
                    </span>
                  </div>
                )}
                
                <span className="text-xs">
                  Created {new Date(task.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onEdit(task)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit task"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;