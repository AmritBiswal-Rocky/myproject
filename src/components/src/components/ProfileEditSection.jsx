import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { updateUserProfile } from '../api/profile';
import toast from 'react-hot-toast';

const ProfileEditSection = () => {
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        toast.error('User not authenticated');
        return;
      }
      await updateUserProfile(user.uid, { full_name: fullName });
      toast.success('Profile updated!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder="Enter new full name"
      />
      <button onClick={handleUpdate} disabled={loading}>
        {loading ? 'Updating...' : 'Update Profile'}
      </button>
    </div>
  );
};

export default ProfileEditSection;
