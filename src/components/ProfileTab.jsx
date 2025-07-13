// src/components/ProfileTab.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import ProfileCard from './ProfileCard';
import toast from 'react-hot-toast';

const ProfileTab = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ bio: '', phone: '' });
  const [avatarUrl, setAvatarUrl] = useState(null);

  // ───────────────────────────────────────── Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          setErrorMsg('❌ Not authenticated or session expired.');
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, email, avatar_url, joined_at, bio, phone')
          .eq('id', user.id)
          .single();

        if (error || !data) {
          setErrorMsg('❌ Could not fetch profile data.');
        } else {
          // Fill gaps from Firebase metadata (if any)
          const fbUser = user.user_metadata || {};
          const updates = {};
          if (!data.full_name && fbUser.full_name) updates.full_name = fbUser.full_name;
          if (!data.avatar_url && fbUser.avatar_url) updates.avatar_url = fbUser.avatar_url;
          if (Object.keys(updates).length)
            await supabase.from('profiles').update(updates).eq('id', user.id);

          setProfile({ ...data, ...updates });
          setFormData({ bio: data.bio || '', phone: data.phone || '' });

          if (data.avatar_url) {
            const { data: urlData } = supabase.storage
              .from('avatars')
              .getPublicUrl(data.avatar_url);
            setAvatarUrl(urlData?.publicUrl);
          } else {
            setAvatarUrl(null);
          }
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

  // ───────────────────────────────────────── Handlers
  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    if (!profile?.id) return;
    const { error } = await supabase
      .from('profiles')
      .update({ bio: formData.bio, phone: formData.phone })
      .eq('id', profile.id);

    if (error) toast.error('❌ Failed to update profile');
    else {
      toast.success('✅ Profile updated!');
      setProfile((p) => ({ ...p, bio: formData.bio, phone: formData.phone }));
      setEditMode(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !profile?.id) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${profile.id}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) return toast.error('Failed to upload avatar');

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: filePath })
      .eq('id', profile.id);

    if (updateError) toast.error('Failed to update profile');
    else {
      toast.success('Avatar updated!');
      setProfile((p) => ({ ...p, avatar_url: filePath }));
      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
      setAvatarUrl(urlData?.publicUrl);
    }
  };

  const fallbackAvatar = profile?.full_name
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name)}`
    : 'https://ui-avatars.com/api/?name=User';

  // ───────────────────────────────────────── UI
  return (
    <div className="max-w-lg mx-auto mt-10 p-6">
      <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white mb-6">
        Your Profile
      </h2>

      <ProfileCard profile={profile} loading={loading} />

      {!loading && profile && (
        <>
          <div className="flex justify-center mt-4">
            <img
              src={avatarUrl || fallbackAvatar}
              alt="Avatar"
              className="w-24 h-24 rounded-full border shadow-md object-cover bg-white"
            />
          </div>

          <div className="flex flex-col items-center mt-4">
            <label htmlFor="avatar-upload" className="cursor-pointer text-blue-600 hover:underline">
              Change Avatar
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>
        </>
      )}

      {!loading && errorMsg && (
        <p className="text-red-600 dark:text-red-400 text-center mt-4">{errorMsg}</p>
      )}

      {!loading && profile && (
        <>
          {editMode ? (
            <form className="mt-4 space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label
                  htmlFor="phone"
                  className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="bio"
                  className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex justify-center gap-4 mt-2">
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  Save
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center text-gray-700 dark:text-gray-300 mt-4 space-y-2">
              <p>
                <strong>Joined At:</strong>{' '}
                {profile.joined_at ? new Date(profile.joined_at).toLocaleDateString() : '—'}
              </p>
              <p>
                <strong>Phone:</strong> {profile.phone || '—'}
              </p>
              <p>
                <strong>Bio:</strong> {profile.bio || '—'}
              </p>

              <button
                onClick={() => setEditMode(true)}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                ✏️ Edit Profile
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProfileTab;
