import { supabase } from './supabase';

class AuthService {
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { success: false, error: error.message };
      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || error?.message?.includes('AuthRetryableFetchError')) {
        return {
          success: false,
          error: 'Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.'
        };
      }
      return { success: false, error: 'Something went wrong during login. Please try again.' };
    }
  }

  async signUp(email, password, userData = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: userData }
      });
      if (error) return { success: false, error: error.message };
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message || 'Something went wrong during signup.' };
    }
  }

  async handleOAuthRedirect() {
    try {
      const { data, error } = await supabase.auth.getSessionFromUrl();
      if (error) return { success: false, error: error.message };
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to handle redirect.' };
    }
  }

  async signInWithGoogle() {
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || 'Google sign-in failed.' };
    }
  }
}

const authService = new AuthService();
export default authService;
