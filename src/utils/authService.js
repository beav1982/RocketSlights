import { supabase } from './supabase';

class AuthService {
  // Sign in with email and password
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('AuthRetryableFetchError')) {
        return { 
          success: false, 
          error: 'Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.'
        };
      }
      return { success: false, error: 'Something went wrong during login. Please try again.' };
    }
  }

  // Sign up with email and password
  async signUp(email, password, userData = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message || 'Something went wrong during signup.' };
    }
  }

  // Handle OAuth or magic link redirect after Supabase returns
  async handleOAuthRedirect() {
    try {
      const { data, error } = await supabase.auth.getSessionFromUrl();
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message || "Failed to handle redirect." };
    }
  }

  // 🔧 Missing function patched in
  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to retrieve session.' };
    }
  }

  // Optional - profile fetch from DB (stubbed)
  async getUserProfile(userId) {
    return { success: true, data: null }; // Stub — update if using user metadata table
  }
}

const authService = new AuthService();
export default authService;
