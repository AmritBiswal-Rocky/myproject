// src/components/CalendarView.js
import React, { useEffect, useState, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { supabase } from '../supabaseClient';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const localizer = momentLocalizer(moment);

const CalendarView = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    if (!user?.uid) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('id, description, date')
        .eq('user_id', user.uid);

      if (error) {
        toast.error('❌ Failed to load tasks');
        return;
      }

      const mappedEvents = data.map((task) => ({
        id: task.id,
        title: task.description,
        start: new Date(task.date),
        end: new Date(task.date),
        allDay: true,
      }));

      setEvents(mappedEvents);
    } catch (err) {
      toast.error('⚠️ Unexpected error fetching tasks');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800 dark:text-white">
        📅 Your Calendar
      </h2>

      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400 animate-pulse">Loading...</p>
      ) : (
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          className="rounded shadow bg-white dark:bg-gray-900 p-2"
        />
      )}
    </div>
  );
};

export default CalendarView;
