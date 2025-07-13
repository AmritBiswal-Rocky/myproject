// src/components/AddTask.jsx
import React, { useState } from 'react';
import { supabase } from '../supabaseClient'; // ✅ Supabase client
import { useAuth } from '../hooks/useAuth'; // ✅ Auth hook
import toast from 'react-hot-toast';

const AddTask = ({ fetchTasks }) => {
  const { user } = useAuth();

  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [priority, setPriority] = useState('');
  const [tag, setTag] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description || !date) {
      toast.error('❗ Description and Date are required');
      return;
    }
    if (!user?.uid) {
      toast.error('⚠️ You must be logged in to add a task');
      return;
    }

    try {
      const { error } = await supabase
        .from('tasks')
        .insert([{ user_id: user.uid, description, date, priority, tag }]);

      if (error) {
        toast.error('❌ Failed to add task');
        console.error('Insert error:', error.message);
      } else {
        toast.success('✅ Task added!');
        setDescription('');
        setDate('');
        setPriority('');
        setTag('');
        fetchTasks(); // 🔄 Refresh list
      }
    } catch (err) {
      toast.error('⚠️ Something went wrong');
      console.error('Error inserting task:', err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 border dark:border-gray-700 p-4 rounded shadow space-y-3"
    >
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Add New Task</h2>

      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full px-3 py-2 border rounded"
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full px-3 py-2 border rounded"
      />

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="w-full px-3 py-2 border rounded"
      >
        <option value="">Select Priority</option>
        <option value="High">High 🔴</option>
        <option value="Medium">Medium 🟡</option>
        <option value="Low">Low 🟢</option>
      </select>

      <input
        type="text"
        placeholder="Tag (optional)"
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        className="w-full px-3 py-2 border rounded"
      />

      <button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        ➕ Add Task
      </button>
    </form>
  );
};

export default AddTask;
