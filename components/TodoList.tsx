'use client';

import { useEffect, useState } from 'react';

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

  const fetchTasks = async (date: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks?date=${date}`);
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





  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      });

      if (res.ok) {
        setNewTask({ title: '', note: '', date: '', time: '' });
        fetchTasks(selectedDate);
      }
    } catch (error) {
      console.error('Failed to add task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (taskId: number, completed: boolean) => {
    try {
      await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed })
      });
      fetchTasks(selectedDate);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'DELETE'
      });
      fetchTasks(selectedDate);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return 'No due date';
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  if (!showModal) return null;

  return (
    <>
      {/* TodoList Modal */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-auto max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-black">To-Do List</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                title="Add task"
              >
                <i className="ri-add-line text-lg"></i>
              </button>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
                title="Close"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="date-select" className="text-sm text-black mr-2">View tasks for:</label>
            <input
              id="date-select"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-2 py-1 border border-gray-300 rounded-md text-sm text-black"
            />
          </div>

          {/* Tasks List */}
          <div className="space-y-2">
            {tasks.length === 0 ? (
              <p className="text-black text-center py-2">No tasks for this date.</p>
            ) : (
              tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 flex-1">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleComplete(task.id, task.completed)}
                      className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-medium text-sm ${task.completed ? 'line-through text-black' : 'text-black'}`}>
                        {task.title}
                      </h3>
                      {task.note && (
                      <p className={`text-xs text-black`}>
                        {task.note}
                      </p>
                      )}
                      <p className="text-xs text-black">
                        Due: {formatDateTime(task.due_date)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-red-600 hover:text-red-800 p-1 flex-shrink-0"
                    title="Delete task"
                  >
                    <i className="ri-delete-bin-line text-base"></i>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-4 text-black">Add New Task</h3>
            <form onSubmit={(e) => { handleAddTask(e); setShowAddModal(false); }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Title *</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
                    placeholder="Task title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Note</label>
                  <input
                    type="text"
                    value={newTask.note}
                    onChange={(e) => setNewTask({ ...newTask, note: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
                    placeholder="Optional note"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Date</label>
                    <input
                      type="date"
                      value={newTask.date}
                      onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Time</label>
                    <input
                      type="time"
                      value={newTask.time}
                      onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
                    />
                  </div>
                </div>
              </div>
              <div className="flex space-x-2 mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add Task'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-300 text-black py-2 px-4 rounded-md hover:bg-gray-400"
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
