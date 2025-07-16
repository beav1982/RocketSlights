// utils/authService.js

import { supabase } from './supabase';

class AuthService {
  async signIn(email, password) {
    // ... existing code
  }

  async signUp(email, password, userData = {}) {
    // ... existing code
  }

  async handleOAuthRedirect() {
    // ... existing code
  }

  // ✅ Add this missing method
  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to get session' };
    }
  }

  // (Optional) You may want to also include a signOut method
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to sign out' };
    }
  }
}

const authService = new AuthService();
export default authService;
