-- Location: supabase/migrations/20250116123000_fix_game_room_rls_policies.sql
-- Fix RLS policies for game room creation and management

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "hosts_manage_rooms" ON public.game_rooms;
DROP POLICY IF EXISTS "users_manage_own_sessions" ON public.player_sessions;

-- Create separate policies for different operations on game_rooms
CREATE POLICY "authenticated_users_can_create_rooms" ON public.game_rooms 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = host_id);

CREATE POLICY "hosts_can_update_own_rooms" ON public.game_rooms 
FOR UPDATE 
TO authenticated 
USING (public.is_room_host(id)) 
WITH CHECK (public.is_room_host(id));

CREATE POLICY "hosts_can_delete_own_rooms" ON public.game_rooms 
FOR DELETE 
TO authenticated 
USING (public.is_room_host(id));

-- Create separate policies for player_sessions table
CREATE POLICY "authenticated_users_can_join_sessions" ON public.player_sessions 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_can_update_own_sessions" ON public.player_sessions 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_can_leave_sessions" ON public.player_sessions 
FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);

-- Add missing RPC functions for room player count management
CREATE OR REPLACE FUNCTION public.increment_room_players(room_id UUID)
RETURNS VOID
LANGUAGE sql
SECURITY DEFINER
AS $$
UPDATE public.game_rooms 
SET current_players = current_players + 1,
    updated_at = CURRENT_TIMESTAMP
WHERE id = room_id;
$$;

CREATE OR REPLACE FUNCTION public.decrement_room_players(room_id UUID)
RETURNS VOID
LANGUAGE sql
SECURITY DEFINER
AS $$
UPDATE public.game_rooms 
SET current_players = GREATEST(current_players - 1, 0),
    updated_at = CURRENT_TIMESTAMP
WHERE id = room_id;
$$;

-- Add function to generate unique room codes
CREATE OR REPLACE FUNCTION public.generate_room_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    code TEXT;
    exists_check BOOLEAN;
BEGIN
    LOOP
        -- Generate a 6-character alphanumeric code
        code := upper(substring(encode(gen_random_bytes(4), 'base64') from 1 for 6));
        code := replace(replace(replace(code, '+', ''), '/', ''), '=', '');
        
        -- Ensure it's exactly 6 characters
        IF length(code) >= 6 THEN
            code := substring(code from 1 for 6);
        ELSE
            CONTINUE;
        END IF;
        
        -- Check if code already exists
        SELECT EXISTS(SELECT 1 FROM public.game_rooms WHERE room_code = code) INTO exists_check;
        
        -- If code doesn't exist, we can use it
        IF NOT exists_check THEN
            EXIT;
        END IF;
    END LOOP;
    
    RETURN code;
END;
$$;

-- Add trigger to auto-generate room codes if not provided
CREATE OR REPLACE FUNCTION public.auto_generate_room_code()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF NEW.room_code IS NULL OR NEW.room_code = '' THEN
        NEW.room_code := public.generate_room_code();
    END IF;
    RETURN NEW;
END;
$$;

-- Create trigger for auto-generating room codes
DROP TRIGGER IF EXISTS auto_generate_room_code_trigger ON public.game_rooms;
CREATE TRIGGER auto_generate_room_code_trigger
    BEFORE INSERT ON public.game_rooms
    FOR EACH ROW
    EXECUTE FUNCTION public.auto_generate_room_code();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;