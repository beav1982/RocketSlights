-- Location: supabase/migrations/20250116150000_fix_rls_policies_comprehensive.sql
-- Comprehensive RLS policy fix for game room creation issues

-- Drop all existing problematic policies
DROP POLICY IF EXISTS "authenticated_users_can_create_rooms" ON public.game_rooms;
DROP POLICY IF EXISTS "hosts_can_update_own_rooms" ON public.game_rooms;
DROP POLICY IF EXISTS "hosts_can_delete_own_rooms" ON public.game_rooms;
DROP POLICY IF EXISTS "users_can_view_open_rooms" ON public.game_rooms;
DROP POLICY IF EXISTS "authenticated_users_can_join_sessions" ON public.player_sessions;
DROP POLICY IF EXISTS "users_can_update_own_sessions" ON public.player_sessions;
DROP POLICY IF EXISTS "users_can_leave_sessions" ON public.player_sessions;
DROP POLICY IF EXISTS "participants_view_sessions" ON public.player_sessions;

-- Update helper functions to be more robust
CREATE OR REPLACE FUNCTION public.is_authenticated_user()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT auth.uid() IS NOT NULL;
$$;

CREATE OR REPLACE FUNCTION public.user_exists_in_profiles(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = user_uuid
);
$$;

-- Update existing helper functions for better error handling
CREATE OR REPLACE FUNCTION public.is_room_host(room_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.game_rooms gr
    WHERE gr.id = room_uuid 
    AND gr.host_id = auth.uid()
    AND auth.uid() IS NOT NULL
);
$$;

CREATE OR REPLACE FUNCTION public.is_room_participant(room_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.player_sessions ps
    WHERE ps.room_id = room_uuid 
    AND ps.user_id = auth.uid()
    AND auth.uid() IS NOT NULL
);
$$;

-- Simple and permissive RLS policies for game_rooms
CREATE POLICY "authenticated_users_full_access_game_rooms"
ON public.game_rooms
FOR ALL
TO authenticated
USING (public.is_authenticated_user())
WITH CHECK (public.is_authenticated_user() AND host_id = auth.uid());

-- Allow viewing of waiting rooms to all authenticated users
CREATE POLICY "authenticated_users_can_view_waiting_rooms"
ON public.game_rooms
FOR SELECT
TO authenticated
USING (
    public.is_authenticated_user() AND 
    (status = 'waiting'::public.game_status OR public.is_room_participant(id))
);

-- Simple and permissive RLS policies for player_sessions
CREATE POLICY "authenticated_users_full_access_player_sessions"
ON public.player_sessions
FOR ALL
TO authenticated
USING (public.is_authenticated_user())
WITH CHECK (public.is_authenticated_user() AND user_id = auth.uid());

-- Allow viewing sessions for room participants
CREATE POLICY "participants_can_view_sessions"
ON public.player_sessions
FOR SELECT
TO authenticated
USING (public.is_authenticated_user() AND public.is_room_participant(room_id));

-- Update the auto-generate room code function to handle edge cases
CREATE OR REPLACE FUNCTION public.generate_room_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    code TEXT;
    exists_check BOOLEAN;
    attempt_count INTEGER := 0;
    max_attempts INTEGER := 100;
BEGIN
    LOOP
        attempt_count := attempt_count + 1;
        
        -- Prevent infinite loops
        IF attempt_count > max_attempts THEN
            RAISE EXCEPTION 'Unable to generate unique room code after % attempts', max_attempts;
        END IF;
        
        -- Generate a 6-character alphanumeric code
        code := upper(
            substring(
                translate(
                    encode(gen_random_bytes(6), 'base64'),
                    '+/=',
                    'ABC'
                ),
                1,
                6
            )
        );
        
        -- Ensure it's exactly 6 characters and alphanumeric
        IF length(code) = 6 AND code ~ '^[A-Z0-9]+$' THEN
            -- Check if code already exists
            SELECT EXISTS(
                SELECT 1 FROM public.game_rooms 
                WHERE room_code = code 
                AND status != 'cancelled'::public.game_status
            ) INTO exists_check;
            
            -- If code doesn't exist, we can use it
            IF NOT exists_check THEN
                RETURN code;
            END IF;
        END IF;
    END LOOP;
END;
$$;

-- Update the trigger function to ensure room codes are always generated
CREATE OR REPLACE FUNCTION public.auto_generate_room_code()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Always generate a new room code if not provided or empty
    IF NEW.room_code IS NULL OR NEW.room_code = '' THEN
        NEW.room_code := public.generate_room_code();
    END IF;
    
    -- Ensure host_id is set to current user if not provided
    IF NEW.host_id IS NULL THEN
        NEW.host_id := auth.uid();
    END IF;
    
    -- Validate that the host exists in user_profiles
    IF NOT public.user_exists_in_profiles(NEW.host_id) THEN
        RAISE EXCEPTION 'Host user does not exist in user_profiles table';
    END IF;
    
    RETURN NEW;
END;
$$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS auto_generate_room_code_trigger ON public.game_rooms;
CREATE TRIGGER auto_generate_room_code_trigger
    BEFORE INSERT ON public.game_rooms
    FOR EACH ROW
    EXECUTE FUNCTION public.auto_generate_room_code();

-- Update the room player count functions to be more robust
CREATE OR REPLACE FUNCTION public.increment_room_players(room_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.game_rooms 
    SET current_players = current_players + 1,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = room_id;
    
    -- Check if update was successful
    IF NOT FOUND THEN
        RAISE NOTICE 'Room % not found for player increment', room_id;
    END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.decrement_room_players(room_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.game_rooms 
    SET current_players = GREATEST(current_players - 1, 0),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = room_id;
    
    -- Check if update was successful
    IF NOT FOUND THEN
        RAISE NOTICE 'Room % not found for player decrement', room_id;
    END IF;
END;
$$;

-- Create a function to validate user session before game operations
CREATE OR REPLACE FUNCTION public.validate_user_session()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_id UUID;
    profile_exists BOOLEAN;
BEGIN
    -- Get current user ID
    user_id := auth.uid();
    
    -- Check if user is authenticated
    IF user_id IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Check if user profile exists
    SELECT EXISTS(
        SELECT 1 FROM public.user_profiles 
        WHERE id = user_id
    ) INTO profile_exists;
    
    RETURN profile_exists;
END;
$$;

-- Grant necessary permissions to ensure functions work
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';