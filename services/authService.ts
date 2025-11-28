import { supabase } from './supabaseClient';

/**
 * Validates user credentials using Supabase Auth.
 * Note: To support "admin" as a username, we automatically append a domain.
 * In Supabase, you should create a user with email: admin@sttock.com
 */
export const validateCredentials = async (username: string, password: string): Promise<boolean> => {
  try {
    // If input is already an email, use it. Otherwise, assume it's the admin username.
    // changed .local to .com to pass standard email validation regex
    const email = username.includes('@') ? username : `${username}@sttock.com`;

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.error("Auth error:", error.message);
      return false;
    }

    return !!data.session;
  } catch (e) {
    console.error("Unexpected auth error:", e);
    return false;
  }
};

export const signUp = async (username: string, password: string): Promise<{ success: boolean; message?: string }> => {
  try {
    const email = username.includes('@') ? username : `${username}@sttock.com`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Optional: meta data
        data: { username: username }
      }
    });

    if (error) {
      return { success: false, message: error.message };
    }

    // In some Supabase configs, email confirmation is required.
    // However, if auto-confirm is on (default for some setups) or purely for dev:
    if (data.user && !data.session) {
       return { success: true, message: "Account created! You may need to verify your email before logging in." };
    }

    return { success: true };
  } catch (e) {
    console.error("Sign up error:", e);
    return { success: false, message: "An unexpected error occurred." };
  }
};

export const signOut = async () => {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error("Error signing out:", error);
  }
};

export const getCurrentSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      // It's common to have no session, but we log real errors
      if (error.message !== 'No session found') {
         console.warn("Session retrieval warning:", error.message);
      }
      return null;
    }
    return data.session;
  } catch (e) {
    console.error("Unexpected error getting session:", e);
    return null;
  }
};