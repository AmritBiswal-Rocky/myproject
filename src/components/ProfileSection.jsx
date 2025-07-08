import React, { useEffect, useState } from 'react';
import { fetchUserProfile } from '../api/profile';
import { getAuth } from 'firebase/auth';
import toast from 'react-hot-toast';

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

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="p-4 rounded-lg bg-white shadow">
      <h2 className="text-lg font-semibold">Profile</h2>
      <p>
        <strong>Full Name:</strong> {profile?.fullName || 'N/A'}
      </p>
      <p>
        <strong>Joined:</strong> {profile?.joinDate || 'N/A'}
      </p>
    </div>
  );
};

export default ProfileSection;
