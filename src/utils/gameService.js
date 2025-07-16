import { supabase } from './supabase';
import { 
  getAllSlightCards, 
  getAllCurseCards, 
  getRandomSlightCard, 
  getRandomCurseCards,
  getCardsByType
} from '../constants/gameCards';

class GameService {
  // Get all available game rooms
  async getGameRooms() {
    try {
      const { data, error } = await supabase
        .from('game_rooms')
        .select(`
          *,
          host:user_profiles!game_rooms_host_id_fkey(id, display_name, avatar_url),
          player_sessions(id, user_id)
        `)
        .eq('status', 'waiting')
        .order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.'
        };
      }
      return { success: false, error: 'Failed to load game rooms' };
    }
  }

  // Create a new game room - Enhanced with better error handling
  async createGameRoom(roomData) {
    try {
      // Validate user session first
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { 
          success: false, 
          error: 'User not authenticated. Please log in and try again.' 
        };
      }

      // Validate user profile exists
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        return { 
          success: false, 
          error: 'User profile not found. Please refresh the page and try again.' 
        };
      }

      // Create room with validated user
      const { data, error } = await supabase
        .from('game_rooms')
        .insert({
          room_code: roomData.roomCode || null, // Will auto-generate if not provided
          host_id: user.id, // Use authenticated user ID
          name: roomData.name || `${user.email?.split('@')[0] || 'Player'}'s Game`,
          max_players: roomData.maxPlayers || 8,
          score_limit: roomData.scoreLimit || 5,
          settings: roomData.settings || {},
          current_players: 1 // Host counts as first player
        })
        .select()
        .single();

      if (error) {
        console.log('Room creation error:', error);
        
        // Handle specific RLS errors
        if (error.message?.includes('row-level security policy')) {
          return { 
            success: false, 
            error: 'Permission denied. Please ensure you are properly logged in and try again.' 
          };
        }
        
        if (error.message?.includes('duplicate key')) {
          return { 
            success: false, 
            error: 'Room code already exists. Please try again.' 
          };
        }
        
        return { success: false, error: `Failed to create room: ${error.message}` };
      }

      // Join the host to the room automatically
      const joinResult = await this.joinGameRoom(data.id, user.id);
      if (!joinResult.success) {
        console.log('Warning: Failed to join host to room:', joinResult.error);
        // Don't fail room creation if join fails, just log it
      }

      return { success: true, data: data };
    } catch (error) {
      console.log('Create room error:', error);
      
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.'
        };
      }
      
      return { success: false, error: 'Failed to create game room. Please try again.' };
    }
  }

  // Join a game room - Enhanced with better validation
  async joinGameRoom(roomId, userId) {
    try {
      // Validate user session
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || user.id !== userId) {
        return { 
          success: false, 
          error: 'User authentication mismatch. Please log in again.' 
        };
      }

      // Check if user is already in the room
      const { data: existingSession } = await supabase
        .from('player_sessions')
        .select('id')
        .eq('user_id', userId)
        .eq('room_id', roomId)
        .single();

      if (existingSession) {
        return { success: true, data: existingSession };
      }

      // Check room capacity
      const { data: room } = await supabase
        .from('game_rooms')
        .select('current_players, max_players, status')
        .eq('id', roomId)
        .single();

      if (room?.current_players >= room?.max_players) {
        return { success: false, error: 'Room is full' };
      }

      if (room?.status !== 'waiting') {
        return { success: false, error: 'Cannot join room - game already started' };
      }

      // Join the room
      const { data, error } = await supabase
        .from('player_sessions')
        .insert({
          user_id: userId,
          room_id: roomId,
          joined_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.log('Join room error:', error);
        
        if (error.message?.includes('duplicate key')) {
          return { success: false, error: 'You are already in this room' };
        }
        
        return { success: false, error: `Failed to join room: ${error.message}` };
      }

      // Update room player count
      try {
        const { error: rpcError } = await supabase.rpc('increment_room_players', { room_id: roomId });
        if (rpcError) {
          console.log('Warning: Failed to update room player count:', rpcError);
        }
      } catch (rpcError) {
        console.log('RPC Error:', rpcError);
      }

      return { success: true, data: data };
    } catch (error) {
      console.log('Join room error:', error);
      
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.'
        };
      }
      
      return { success: false, error: 'Failed to join game room. Please try again.' };
    }
  }

  // Leave a game room
  async leaveGameRoom(roomId, userId) {
    try {
      const { error } = await supabase
        .from('player_sessions')
        .delete()
        .eq('room_id', roomId)
        .eq('user_id', userId);

      if (error) {
        return { success: false, error: error.message };
      }

      // Update room player count
      const { error: rpcError } = await supabase.rpc('decrement_room_players', { room_id: roomId });
      if (rpcError) {
        console.log('Warning: Failed to update room player count:', rpcError);
      }

      return { success: true };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.'
        };
      }
      return { success: false, error: 'Failed to leave game room' };
    }
  }

  // Get game cards - Enhanced to use local card data
  async getGameCards(cardType = null) {
    try {
      // First, try to get cards from database
      let query = supabase
        .from('game_cards')
        .select('*')
        .eq('is_active', true);

      if (cardType) {
        query = query.eq('card_type', cardType);
      }

      const { data, error } = await query;

      if (error) {
        // If database fails, fall back to local card data
        console.log('Database unavailable, using local card data');
        return this.getLocalGameCards(cardType);
      }

      // If database is empty or no cards, use local data
      if (!data || data.length === 0) {
        return this.getLocalGameCards(cardType);
      }

      return { success: true, data: data };
    } catch (error) {
      // Fall back to local card data on any error
      console.log('Database error, using local card data');
      return this.getLocalGameCards(cardType);
    }
  }

  // Get local game cards as fallback
  getLocalGameCards(cardType = null) {
    try {
      let cards = [];
      
      if (cardType === 'slight') {
        cards = getAllSlightCards();
      } else if (cardType === 'curse') {
        cards = getAllCurseCards();
      } else {
        cards = [...getAllSlightCards(), ...getAllCurseCards()];
      }

      return { success: true, data: cards };
    } catch (error) {
      return { success: false, error: 'Failed to load local game cards' };
    }
  }

  // Get random slight card for game rounds
  getRandomSlightCard() {
    return getRandomSlightCard();
  }

  // Get random curse cards for player hands
  getRandomCurseCards(count = 7) {
    return getRandomCurseCards(count);
  }

  // Get all cards by type
  getCardsByType(type) {
    return getCardsByType(type);
  }

  // Get user's game statistics
  async getUserStats(userId) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('games_played, games_won, total_score')
        .eq('id', userId)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data };
    } catch (error) {
      return { success: false, error: 'Failed to load user statistics' };
    }
  }

  // Subscribe to real-time game room updates
  subscribeToGameRoom(roomId, callback) {
    return supabase
      .channel(`game_room_${roomId}`)
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'game_rooms',
          filter: `id=eq.${roomId}`
        },
        callback
      )
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'player_sessions',
          filter: `room_id=eq.${roomId}`
        },
        callback
      )
      .subscribe();
  }

  // Subscribe to real-time game updates
  subscribeToGameUpdates(callback) {
    return supabase
      .channel('game_updates')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'game_rooms'
        },
        callback
      )
      .subscribe();
  }

  // Unsubscribe from real-time updates
  unsubscribeFromChannel(channel) {
    return supabase.removeChannel(channel);
  }
}

export default new GameService();