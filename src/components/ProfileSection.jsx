// src/components/ProfileSection.jsx
import React, { useEffect, useState } from 'react';
import { fetchUserProfile } from '../api/profile';
import { getAuth } from 'firebase/auth';
import toast from 'react-hot-toast';
import ProfileCard from './ProfileCard';

const ProfileSection = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          const data = await fetchUserProfile(user.uid);
          setProfile(data);
          toast.success('Profile loaded successfully');
        } else {
          toast.error('User not authenticated');
        }
      } catch (error) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  return (
    <div className="p-4 rounded-lg bg-white shadow">
      <h2 className="text-lg font-semibold mb-4">Profile</h2>
      <ProfileCard profile={profile} loading={loading} />
    </div>
  );
};

export default ProfileSection;
