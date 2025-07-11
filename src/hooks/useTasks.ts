import { useState, useEffect } from 'react';
import { Task, TaskFormData } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchTasks = async (filters?: { completed?: boolean; priority?: string; sort?: string }) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      if (filters?.completed !== undefined) {
        queryParams.append('completed', filters.completed.toString());
      }
      if (filters?.priority) {
        queryParams.append('priority', filters.priority);
      }
      if (filters?.sort) {
        queryParams.append('sort', filters.sort);
      }

      const response = await fetch(`http://localhost:5000/api/tasks?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const data = await response.json();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: TaskFormData) => {
    try {
      const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const newTask = await response.json();
      setTasks(prev => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      throw err instanceof Error ? err : new Error('An error occurred');
    }
  };

  const updateTask = async (taskId: string, updates: Partial<TaskFormData>) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      const updatedTask = await response.json();
      setTasks(prev => prev.map(task => task._id === taskId ? updatedTask : task));
      return updatedTask;
    } catch (err) {
      throw err instanceof Error ? err : new Error('An error occurred');
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      setTasks(prev => prev.filter(task => task._id !== taskId));
    } catch (err) {
      throw err instanceof Error ? err : new Error('An error occurred');
    }
  };

  const toggleTask = async (taskId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to toggle task');
      }

      const updatedTask = await response.json();
      setTasks(prev => prev.map(task => task._id === taskId ? updatedTask : task));
      return updatedTask;
    } catch (err) {
      throw err instanceof Error ? err : new Error('An error occurred');
    }
  };

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
  };
};