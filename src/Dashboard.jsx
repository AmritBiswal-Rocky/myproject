import React from 'react';
import ProfileSection from './components/ProfileSection';
import ProfileEditSection from './components/ProfileEditSection';

function Dashboard() {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-bold">User Profile</h1>

      {/* Profile display */}
      <ProfileSection />

      {/* Profile edit input */}
      <ProfileEditSection />
    </div>
  );
}

export default Dashboard;
