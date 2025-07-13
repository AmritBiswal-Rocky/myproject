// src/CalendarTasks.jsx
import React from 'react';
import { supabase } from './supabaseClient'; // ← stays the same
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import AddTask from './components/AddTask'; // ← path is correct

const CalendarTasks = ({ tasks, loading, fetchTasks }) => {
  const navigate = useNavigate();

  /* ─────────────────── helpers ─────────────────── */

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) {
        toast.error('❌ Failed to delete task');
      } else {
        toast.success('🗑️ Task deleted!');
        fetchTasks();
      }
    } catch (err) {
      console.error('⚠️ Delete error:', err);
      toast.error('⚠️ Something went wrong');
    }
  };

  const goToCalendarView = () => navigate('/calendar-view');

  const getPriorityBadge = (priority) => {
    const base = 'text-xs font-semibold px-2 py-1 rounded-full';
    if (priority === 'High') return `${base} bg-red-100 text-red-800`;
    if (priority === 'Medium') return `${base} bg-yellow-100 text-yellow-800`;
    if (priority === 'Low') return `${base} bg-green-100 text-green-800`;
    return `${base} bg-gray-100 text-gray-700`;
  };

  const getTagBadge = (tag) => (
    <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 ml-2">
      {tag || 'Untagged'}
    </span>
  );

  /* ─────────────────── render ─────────────────── */

  if (loading) {
    return (
      <div className="p-4 space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded p-3 shadow animate-pulse"
          >
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mb-1" />
            <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3">
      {/* ── add‑new‑task form ── */}
      <AddTask fetchTasks={fetchTasks} />

      {tasks.length === 0 ? (
        <>
          <p className="text-center text-gray-500 dark:text-gray-400">
            No tasks found for this date.
          </p>
          <div className="flex justify-center mt-4">
            <button
              onClick={goToCalendarView}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              📅 View Full Calendar
            </button>
          </div>
        </>
      ) : (
        <>
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded p-3 shadow flex justify-between items-center"
            >
              <div>
                <p className="text-gray-900 dark:text-white">{task.description}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{task.date}</p>

                <div className="mt-1 flex items-center space-x-2">
                  <span className={getPriorityBadge(task.priority)}>
                    {task.priority ? `${task.priority} Priority` : 'No Priority'}
                  </span>
                  {getTagBadge(task.tag)}
                </div>
              </div>

              <button
                onClick={() => handleDelete(task.id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                🗑️
              </button>
            </div>
          ))}

          <div className="flex justify-center mt-6">
            <button
              onClick={goToCalendarView}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              📅 View Full Calendar
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CalendarTasks;
