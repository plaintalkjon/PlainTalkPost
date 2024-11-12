import supabase from '../utility/SupabaseClient.js';

export const login = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);
  return data.session;
};

export const signup = async (email, password, username) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  // Insert additional user data (username) into 'users_extended'
  const userId = data.user.id;
  const { error: profileError } = await supabase
    .from('users_extended')
    .insert([{ user_id: userId, username }]);

  if (profileError) throw new Error(profileError.message);
  
  return data.session;
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error('Logout failed');
};
