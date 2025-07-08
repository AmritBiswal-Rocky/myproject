// src/components/ProfileTab.js
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const ProfileTab = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          setErrorMsg('❌ Not authenticated or session expired.');
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, email, joined_at')
          .eq('id', user.id)
          .single();

        if (error || !data) {
          setErrorMsg('❌ Could not fetch profile data.');
        } else {
          setProfile(data);
        }
      } catch (err) {
        console.error('❌ Unexpected error:', err);
        setErrorMsg('❌ An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="max-w-lg mx-auto mt-10 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-300 rounded w-1/3"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Your Profile</h2>

      {errorMsg ? (
        <p className="text-red-600 dark:text-red-400">{errorMsg}</p>
      ) : profile ? (
        <div className="space-y-3 text-gray-700 dark:text-gray-200">
          <div>
            <strong>Email:</strong> {profile.email}
          </div>
          <div>
            <strong>Full Name:</strong> {profile.full_name || '—'}
          </div>
          <div>
            <strong>Joined At:</strong>{' '}
            {profile.joined_at ? new Date(profile.joined_at).toLocaleDateString() : '—'}
          </div>
        </div>
      ) : (
        <p className="text-red-600 dark:text-red-400">⚠️ Profile not found.</p>
      )}
    </div>
  );
};

export default ProfileTab;
