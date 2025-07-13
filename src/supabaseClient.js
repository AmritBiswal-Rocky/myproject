// src/supabaseClient.js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oftitgyftywcpojqhyue.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mdGl0Z3lmdHl3Y3BvanFoeXVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyMDM1NzcsImV4cCI6MjA2MDc3OTU3N30.S6qRaq1lFSbJRY1zwuVXG4X0KHTyjQ00ztIVxPs7Bco';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Sets the Supabase session using a Firebase ID token
 * @param {string} firebaseToken - Firebase ID token
 */
export async function setSupabaseSession(firebaseToken) {
  const { error } = await supabase.auth.setSession({
    access_token: firebaseToken,
    refresh_token: firebaseToken, // Firebase doesn't provide refresh_token, just reusing
  });

  if (error) {
    console.error('❌ Error setting Supabase session:', error.message);
  } else {
    console.log('✅ Supabase session set successfully');
  }
}

/**
 * Syncs Firebase user info to Supabase `profiles` table
 * @param {Object} firebaseUser - The Firebase user object
 */
export async function syncFirebaseUserToSupabase(firebaseUser) {
  if (!firebaseUser) {
    console.warn('⚠️ Firebase user is null. Skipping profile sync.');
    return;
  }

  const { email, uid, displayName, photoURL } = firebaseUser;

  const { error } = await supabase.from('profiles').upsert(
    {
      id: uid,
      email,
      full_name: displayName,
      avatar_url: photoURL,
    },
    { onConflict: ['id'] } // Ensure id is unique
  );

  if (error) {
    console.error('❌ Error syncing user to Supabase:', error.message);
  } else {
    console.log('✅ User synced to Supabase profiles table');
  }
}
