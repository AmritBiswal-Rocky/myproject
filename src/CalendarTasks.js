// src/CalendarTasks.js
import React, { useEffect, useState, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAuth } from './hooks/useAuth';
import { supabase } from './supabaseClient';
import { connectSocket } from './socket';
import { toast } from 'react-hot-toast';

const localizer = momentLocalizer(moment);

function CalendarTasks() {
  const { user, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);
  const [editDescription, setEditDescription] = useState('');
  const [editDate, setEditDate] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDate, setNewDate] = useState('');

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const idToken = await user.getIdToken();
      const res = await fetch('/api/tasks', {
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(`Failed to fetch tasks: ${res.status} - ${error}`);
      }

      const data = await res.json();
      setTasks(
        Array.isArray(data)
          ? data.map((task) => ({
              ...task,
              start: new Date(task.date),
              end: new Date(task.date),
              title: task.description,
            }))
          : []
      );
    } catch (err) {
      console.error('❌ Error fetching tasks:', err.message || err);
      toast.error('Failed to load tasks');
      setTasks([]);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchTasks();

      const socket = connectSocket();
      socket.on('task_update', () => {
        console.log('📬 Task update received');
        fetchTasks();
      });

      return () => {
        socket.off('task_update');
      };
    }
  }, [authLoading, user, fetchTasks]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newDescription || !newDate) {
      toast.error('Please enter both description and date');
      return;
    }

    try {
      const idToken = await user.getIdToken();
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: newDescription,
          date: new Date(newDate).toISOString(),
        }),
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(`Task creation failed: ${res.status} - ${error}`);
      }

      setNewDescription('');
      setNewDate('');
      toast.success('Task added!');
    } catch (error) {
      console.error('❌ Error adding task:', error.message || error);
      toast.error('Failed to add task');
    }
  };

  const handleSelectEvent = (task) => {
    setEditingTask(task);
    setEditDescription(task.description);
    setEditDate(moment(task.date).format('YYYY-MM-DDTHH:mm'));
  };

  const handleSave = async () => {
    if (!editingTask || !editDescription.trim() || !editDate) {
      toast.error('Please complete all fields');
      return;
    }

    const { error } = await supabase
      .from('tasks')
      .update({
        description: editDescription.trim(),
        date: new Date(editDate).toISOString(),
      })
      .eq('id', editingTask.id);

    if (error) {
      console.error('❌ Error updating task:', error.message || error);
      toast.error('Failed to update task');
    } else {
      setEditingTask(null);
      toast.success('Task updated');
    }
  };

  const handleCancel = () => setEditingTask(null);

  const handleDelete = async () => {
    if (!editingTask) return;
    const confirmed = window.confirm('Are you sure you want to delete this task?');
    if (!confirmed) return;

    try {
      const { error } = await supabase.from('tasks').delete().eq('id', editingTask.id);

      if (error) {
        console.error('❌ Error deleting task:', error.message || error);
        toast.error('Failed to delete task');
      } else {
        setEditingTask(null);
        toast.success('Task deleted');
      }
    } catch (error) {
      console.error('❌ Delete exception:', error.message || error);
      toast.error('Error deleting task');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Your Tasks Calendar</h2>

      <form onSubmit={handleAddTask} className="mb-6 space-y-2">
        <label htmlFor="newDescription" className="block font-medium text-gray-700">
          Description
        </label>
        <input
          id="newDescription"
          type="text"
          placeholder="Task description"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          className="border border-gray-300 rounded p-2 w-full"
        />

        <label htmlFor="newDate" className="block font-medium text-gray-700">
          Date & Time
        </label>
        <input
          id="newDate"
          type="datetime-local"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          className="border border-gray-300 rounded p-2 w-full"
        />

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Add Task
        </button>
      </form>

      {loading ? (
        <p className="text-center text-gray-600 dark:text-gray-300">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No tasks found. Add some tasks to get started!
        </p>
      ) : (
        <Calendar
          localizer={localizer}
          events={tasks}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          onSelectEvent={handleSelectEvent}
        />
      )}

      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Edit Task
            </h3>

            <label
              htmlFor="editDescription"
              className="block mb-2 font-medium text-gray-700 dark:text-gray-300"
            >
              Description
            </label>
            <input
              id="editDescription"
              type="text"
              className="border border-gray-300 dark:border-gray-600 rounded w-full p-2 mb-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />

            <label
              htmlFor="editDate"
              className="block mb-2 font-medium text-gray-700 dark:text-gray-300"
            >
              Date & Time
            </label>
            <input
              id="editDate"
              type="datetime-local"
              className="border border-gray-300 dark:border-gray-600 rounded w-full p-2 mb-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
            />

            <div className="flex justify-between items-center gap-4">
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Delete
              </button>
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CalendarTasks;
