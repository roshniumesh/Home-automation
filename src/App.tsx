import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useTasks } from './hooks/useTasks';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import Header from './components/Layout/Header';
import TaskForm from './components/Tasks/TaskForm';
import TaskCard from './components/Tasks/TaskCard';
import TaskFilters from './components/Tasks/TaskFilters';
import { Task, TaskFormData } from './types';
import { Plus, ListTodo, CheckCircle2 } from 'lucide-react';

const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {isLogin ? (
          <LoginForm onToggleMode={() => setIsLogin(false)} />
        ) : (
          <RegisterForm onToggleMode={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState<any>({});
  
  const {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
  } = useTasks();

  const handleCreateTask = async (taskData: TaskFormData) => {
    await createTask(taskData);
    setShowTaskForm(false);
  };

  const handleUpdateTask = async (taskData: TaskFormData) => {
    if (editingTask) {
      await updateTask(editingTask._id, taskData);
      setEditingTask(null);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(false);
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
  };

  const handleToggleTask = async (taskId: string) => {
    await toggleTask(taskId);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    fetchTasks(newFilters);
  };

  const taskCounts = {
    total: tasks.length,
    completed: tasks.filter(task => task.completed).length,
    pending: tasks.filter(task => !task.completed).length,
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your tasks...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Task Filters */}
          <TaskFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            taskCounts={taskCounts}
          />

          {/* Create Task Button */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Your Tasks</h2>
            <button
              onClick={() => setShowTaskForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Task</span>
            </button>
          </div>

          {/* Task Form */}
          {showTaskForm && (
            <TaskForm
              onSubmit={handleCreateTask}
              onCancel={() => setShowTaskForm(false)}
            />
          )}

          {/* Edit Task Form */}
          {editingTask && (
            <TaskForm
              onSubmit={handleUpdateTask}
              onCancel={() => setEditingTask(null)}
              initialData={{
                title: editingTask.title,
                description: editingTask.description,
                priority: editingTask.priority,
                dueDate: editingTask.dueDate ? editingTask.dueDate.split('T')[0] : '',
              }}
              isEditing={true}
            />
          )}

          {/* Tasks List */}
          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <ListTodo className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
              <p className="text-gray-500 mb-6">Create your first task to get started with TaskTracker!</p>
              <button
                onClick={() => setShowTaskForm(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Create Your First Task</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {tasks.map(task => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onToggle={handleToggleTask}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          )}

          {/* Completion Stats */}
          {tasks.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                  <h3 className="text-lg font-semibold text-gray-900">Progress</h3>
                </div>
                <div className="text-sm text-gray-600">
                  {taskCounts.completed} of {taskCounts.total} tasks completed
                </div>
              </div>
              
              <div className="mt-4">
                <div className="bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full transition-all duration-300"
                    style={{
                      width: `${taskCounts.total > 0 ? (taskCounts.completed / taskCounts.total) * 100 : 0}%`
                    }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {taskCounts.total > 0 
                    ? `${Math.round((taskCounts.completed / taskCounts.total) * 100)}% complete`
                    : 'No tasks to track'
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return user ? <Dashboard /> : <AuthScreen />;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;