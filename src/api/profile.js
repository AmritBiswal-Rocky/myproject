import { supabase } from '../supabaseClient';

export const fetchUserProfile = async (uid) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('full_name, joined_at')
    .eq('id', uid)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const updateUserProfile = async (uid, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', uid)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};
