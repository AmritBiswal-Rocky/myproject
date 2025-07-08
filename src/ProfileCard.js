// src/ProfileCard.js
import React from 'react';
import PropTypes from 'prop-types';

function ProfileCard({ profile }) {
  if (!profile) return null;

  return (
    <div className="flex items-center space-x-4 p-4 bg-white shadow rounded-2xl border w-full max-w-md mx-auto mt-6">
      <img
        src={profile.avatar_url || '/default-avatar.png'}
        alt="Avatar"
        className="w-16 h-16 rounded-full object-cover border"
      />
      <div>
        <p className="text-lg font-semibold">{profile.full_name || 'Unnamed User'}</p>
        <p className="text-gray-600">{profile.email}</p>
      </div>
    </div>
  );
}

ProfileCard.propTypes = {
  profile: PropTypes.shape({
    avatar_url: PropTypes.string,
    full_name: PropTypes.string,
    email: PropTypes.string,
  }),
};

export default ProfileCard;
