'use client';

import { useEffect, useState } from 'react';
import { API_BASE_URL, API_ENDPOINTS } from '@/lib/api-config';

interface Task {
  id: number;
  title: string;
  note: string;
  due_date: string | null;
  completed: boolean;
  created_at: string;
}

interface TodoListProps {
  showModal: boolean;
  onClose: () => void;
}

export default function TodoList({ showModal, onClose }: TodoListProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTask, setNewTask] = useState({
    title: '',
    note: '',
    date: '',
    time: ''
  });
  const [loading, setLoading] = useState(false);
  const [quickAddTitle, setQuickAddTitle] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchTasks = async (date: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_ENDPOINTS.tasks}?date=${date}`, {
        headers
      });
      const data = await res.json();
      const tasksArray = Array.isArray(data) ? data : [];
      setTasks(tasksArray.sort((a: Task, b: Task) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()));
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      setTasks([]);
    }
  };

  useEffect(() => {
    fetchTasks(selectedDate);
  }, [selectedDate]);

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAddTitle.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(API_ENDPOINTS.tasks, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          title: quickAddTitle,
          note: '',
          date: selectedDate,
          time: ''
        })
      });

      if (res.ok) {
        setQuickAddTitle('');
        fetchTasks(selectedDate);
      } else {
        console.error('Failed to add task:', res.status, res.statusText);
      }
    } catch (error) {
      console.error('Failed to add task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(API_ENDPOINTS.tasks, {
        method: 'POST',
        headers,
        body: JSON.stringify(newTask)
      });

      if (res.ok) {
        setNewTask({ title: '', note: '', date: '', time: '' });
        fetchTasks(selectedDate);
      } else {
        console.error('Failed to add task:', res.status, res.statusText);
      }
    } catch (error) {
      console.error('Failed to add task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (taskId: number, completed: boolean) => {
    try {
      const token = localStorage.getItem('adminToken');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      await fetch(`${API_ENDPOINTS.tasks}/${taskId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ completed: !completed })
      });
      fetchTasks(selectedDate);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    setTaskToDelete(taskId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;

    try {
      const token = localStorage.getItem('adminToken');
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      await fetch(`${API_ENDPOINTS.tasks}/${taskToDelete}`, {
        method: 'DELETE',
        headers
      });
      fetchTasks(selectedDate);
      setShowDeleteConfirm(false);
      setTaskToDelete(null);
      setSuccessMessage('Task deleted successfully!');
      setShowSuccessNotification(true);
      setTimeout(() => setShowSuccessNotification(false), 3000);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const cancelDeleteTask = () => {
    setShowDeleteConfirm(false);
    setTaskToDelete(null);
  };

  const getRelativeTime = (dateStr: string | null) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 0) return 'Overdue';
    if (diffMins < 60) return `Due in ${diffMins}m`;
    if (diffHours < 24) return `Due in ${diffHours}h`;
    if (diffDays < 7) return `Due in ${diffDays}d`;
    return null;
  };

  const getPriorityColor = (dateStr: string | null, completed: boolean) => {
    if (completed) return 'bg-gray-100 border-gray-200';
    if (!dateStr) return 'bg-white border-gray-300';
    
    const date = new Date(dateStr);
    const now = new Date();
    const diffHours = (date.getTime() - now.getTime()) / 3600000;

    if (diffHours < 0) return 'bg-red-50 border-red-300';
    if (diffHours < 2) return 'bg-orange-50 border-orange-300';
    if (diffHours < 24) return 'bg-yellow-50 border-yellow-300';
    return 'bg-white border-gray-300';
  };

  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return 'No due date';
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (!showModal) return null;

  return (
    <>
      {/* TodoList Modal - Enhanced */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-auto max-h-[85vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <i className="ri-task-line text-2xl text-white"></i>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">My Tasks</h2>
                  <p className="text-red-100 text-sm">Stay organized and productive</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-white/20 hover:bg-white/30 text-white p-2.5 rounded-xl transition-all duration-200 backdrop-blur-sm"
                  title="Add detailed task"
                >
                  <i className="ri-add-line text-xl"></i>
                </button>
                <button
                  onClick={onClose}
                  className="bg-white/20 hover:bg-white/30 text-white p-2.5 rounded-xl transition-all duration-200 backdrop-blur-sm"
                  title="Close"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Date Selector */}
          <div className="p-4 bg-gradient-to-r from-red-50 to-red-50 border-b border-red-100">
            <div className="flex items-center space-x-3">
              <i className="ri-calendar-line text-red-600"></i>
              <input
                id="date-select"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="flex-1 px-4 py-2 border-2 border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm font-medium text-gray-900 bg-white"
              />
            </div>
          </div>

          {/* Quick Add Form */}
          <div className="p-4 bg-gradient-to-r from-red-50 to-red-50 border-b border-red-100">
            <form onSubmit={handleQuickAdd} className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <i className="ri-add-circle-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  value={quickAddTitle}
                  onChange={(e) => setQuickAddTitle(e.target.value)}
                  placeholder="Quick add task..."
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm text-gray-900 bg-white placeholder-gray-400"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !quickAddTitle.trim()}
                className="bg-gradient-to-r from-red-500 to-red-500 text-white px-4 py-2.5 rounded-lg hover:from-red-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-sm shadow-md hover:shadow-lg"
              >
                <i className="ri-add-line"></i>
              </button>
            </form>
          </div>

          {/* Success Notification */}
          {showSuccessNotification && (
            <div className="mx-4 mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {successMessage}
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70]">
              <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-500 rounded-xl flex items-center justify-center">
                    <i className="ri-delete-bin-line text-xl text-white"></i>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Confirm Deletion</h3>
                </div>
                <p className="text-gray-600 mb-6">Are you sure you want to delete this task? This action cannot be undone.</p>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={cancelDeleteTask}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeleteTask}
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-500 text-white rounded-lg hover:from-red-600 hover:to-red-600 transition-all duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tasks List */}
          <div className="p-4 max-h-[400px] overflow-y-auto">
            {tasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-checkbox-circle-line text-4xl text-red-400"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks for this date</h3>
                <p className="text-sm text-gray-600">Add a task to get started!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {tasks.map((task) => {
                  const relativeTime = getRelativeTime(task.due_date);
                  const priorityColor = getPriorityColor(task.due_date, task.completed);

                  return (
                    <div
                      key={task.id}
                      className={`group ${priorityColor} border-2 rounded-xl p-4 transition-all duration-200 hover:shadow-md hover:scale-[1.01]`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => handleToggleComplete(task.id, task.completed)}
                            className="w-5 h-5 text-red-600 focus:ring-red-500 border-gray-300 rounded cursor-pointer"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className={`font-semibold text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                {task.title}
                              </h3>
                              {task.note && (
                                <p className={`text-xs mt-1 ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {task.note}
                                </p>
                              )}
                              <div className="flex items-center space-x-3 mt-2">
                                <div className="flex items-center space-x-1 text-xs text-gray-600">
                                  <i className="ri-time-line"></i>
                                  <span>{formatDateTime(task.due_date)}</span>
                                </div>
                                {relativeTime && !task.completed && (
                                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                    relativeTime === 'Overdue' ? 'bg-red-100 text-red-700' :
                                    relativeTime.includes('m') || relativeTime.includes('h') ? 'bg-orange-100 text-orange-700' :
                                    'bg-yellow-100 text-yellow-700'
                                  }`}>
                                    {relativeTime}
                                  </span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="flex-shrink-0 text-gray-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition-all duration-200 opacity-0 group-hover:opacity-100"
                              title="Delete task"
                            >
                              <i className="ri-delete-bin-line text-lg"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Task Modal - Enhanced */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-auto">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-500 rounded-xl flex items-center justify-center">
                <i className="ri-add-circle-line text-xl text-white"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Add New Task</h3>
            </div>
            <form onSubmit={(e) => { handleAddTask(e); setShowAddModal(false); }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Title *</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
                    placeholder="Task title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Note</label>
                  <textarea
                    value={newTask.note}
                    onChange={(e) => setNewTask({ ...newTask, note: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 resize-none"
                    placeholder="Optional note"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Date</label>
                    <input
                      type="date"
                      value={newTask.date}
                      onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Time</label>
                    <input
                      type="time"
                      value={newTask.time}
                      onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
                    />
                  </div>
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-500 text-white py-3 px-4 rounded-lg hover:from-red-600 hover:to-red-600 disabled:opacity-50 transition-all duration-200 font-semibold shadow-md"
                >
                  {loading ? 'Adding...' : 'Add Task'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
