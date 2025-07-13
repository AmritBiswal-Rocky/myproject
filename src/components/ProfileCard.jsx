// src/components/ProfileCard.jsx
import React from 'react';

const ProfileCard = ({ profile, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 shadow rounded-2xl border w-full max-w-md mx-auto mt-6 animate-pulse">
        <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-48"></div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 shadow rounded-2xl border w-full max-w-md mx-auto mt-6">
      <div className="w-16 h-16 rounded-full overflow-hidden">
        <img
          src={
            profile.avatar_url
              ? profile.avatar_url
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name || 'User')}`
          }
          alt="Avatar"
          className="object-cover w-full h-full"
        />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {profile.full_name || 'Anonymous'}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">{profile.email || 'No email'}</p>
      </div>
    </div>
  );
};

export default ProfileCard;
