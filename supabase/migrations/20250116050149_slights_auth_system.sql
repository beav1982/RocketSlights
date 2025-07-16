-- Location: supabase/migrations/20250116050149_slights_auth_system.sql
-- Slights: A Game of Minor Inconveniences - Authentication System

-- 1. Custom Types
CREATE TYPE public.user_role AS ENUM ('admin', 'player', 'moderator');
CREATE TYPE public.game_status AS ENUM ('waiting', 'in_progress', 'completed', 'cancelled');
CREATE TYPE public.player_status AS ENUM ('active', 'inactive', 'banned');

-- 2. Core Tables
-- User profiles table (intermediary for auth.users)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    role public.user_role DEFAULT 'player'::public.user_role,
    status public.player_status DEFAULT 'active'::public.player_status,
    games_played INTEGER DEFAULT 0,
    games_won INTEGER DEFAULT 0,
    total_score INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Game rooms table
CREATE TABLE public.game_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_code TEXT NOT NULL UNIQUE,
    host_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    max_players INTEGER DEFAULT 8,
    current_players INTEGER DEFAULT 1,
    status public.game_status DEFAULT 'waiting'::public.game_status,
    score_limit INTEGER DEFAULT 5,
    settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ
);

-- Player sessions table
CREATE TABLE public.player_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    room_id UUID NOT NULL REFERENCES public.game_rooms(id) ON DELETE CASCADE,
    is_judge BOOLEAN DEFAULT false,
    current_score INTEGER DEFAULT 0,
    cards_in_hand JSONB DEFAULT '[]'::jsonb,
    joined_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMPTZ,
    UNIQUE(user_id, room_id)
);

-- Game cards table
CREATE TABLE public.game_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_type TEXT NOT NULL CHECK (card_type IN ('slight', 'curse')),
    content TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL
);

-- Game rounds table
CREATE TABLE public.game_rounds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES public.game_rooms(id) ON DELETE CASCADE,
    round_number INTEGER NOT NULL,
    judge_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    slight_card_id UUID NOT NULL REFERENCES public.game_cards(id) ON DELETE CASCADE,
    winner_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    winning_card_id UUID REFERENCES public.game_cards(id) ON DELETE SET NULL,
    submissions JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'judging', 'completed')),
    started_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMPTZ,
    UNIQUE(room_id, round_number)
);

-- 3. Essential Indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_display_name ON public.user_profiles(display_name);
CREATE INDEX idx_game_rooms_room_code ON public.game_rooms(room_code);
CREATE INDEX idx_game_rooms_host_id ON public.game_rooms(host_id);
CREATE INDEX idx_game_rooms_status ON public.game_rooms(status);
CREATE INDEX idx_player_sessions_user_id ON public.player_sessions(user_id);
CREATE INDEX idx_player_sessions_room_id ON public.player_sessions(room_id);
CREATE INDEX idx_game_cards_type ON public.game_cards(card_type);
CREATE INDEX idx_game_rounds_room_id ON public.game_rounds(room_id);
CREATE INDEX idx_game_rounds_judge_id ON public.game_rounds(judge_id);

-- 4. RLS Setup
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_rounds ENABLE ROW LEVEL SECURITY;

-- 5. Helper Functions
CREATE OR REPLACE FUNCTION public.is_room_participant(room_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.player_sessions ps
    WHERE ps.room_id = room_uuid AND ps.user_id = auth.uid()
)
$$;

CREATE OR REPLACE FUNCTION public.is_room_host(room_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.game_rooms gr
    WHERE gr.id = room_uuid AND gr.host_id = auth.uid()
)
$$;

CREATE OR REPLACE FUNCTION public.has_admin_role()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'::public.user_role
)
$$;

CREATE OR REPLACE FUNCTION public.can_view_room(room_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.game_rooms gr
    WHERE gr.id = room_uuid AND (
        gr.status = 'waiting'::public.game_status OR
        public.is_room_participant(room_uuid) OR
        public.has_admin_role()
    )
)
$$;

-- Function for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, display_name, role)
    VALUES (
        NEW.id, 
        NEW.email, 
        COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
        COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'player'::public.user_role)
    );
    RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- Triggers for updated_at timestamps
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_game_rooms_updated_at
    BEFORE UPDATE ON public.game_rooms
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. RLS Policies
CREATE POLICY "users_own_profile" ON public.user_profiles FOR ALL
USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "public_can_view_profiles" ON public.user_profiles FOR SELECT
USING (true);

CREATE POLICY "users_can_view_open_rooms" ON public.game_rooms FOR SELECT
USING (public.can_view_room(id));

CREATE POLICY "hosts_manage_rooms" ON public.game_rooms FOR ALL
USING (public.is_room_host(id)) WITH CHECK (public.is_room_host(id));

CREATE POLICY "participants_view_sessions" ON public.player_sessions FOR SELECT
USING (public.is_room_participant(room_id));

CREATE POLICY "users_manage_own_sessions" ON public.player_sessions FOR ALL
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "public_can_view_cards" ON public.game_cards FOR SELECT
USING (true);

CREATE POLICY "admins_manage_cards" ON public.game_cards FOR ALL
USING (public.has_admin_role()) WITH CHECK (public.has_admin_role());

CREATE POLICY "participants_view_rounds" ON public.game_rounds FOR SELECT
USING (public.is_room_participant(room_id));

CREATE POLICY "hosts_manage_rounds" ON public.game_rounds FOR ALL
USING (public.is_room_host(room_id)) WITH CHECK (public.is_room_host(room_id));

-- 7. Sample Game Content
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    player_uuid UUID := gen_random_uuid();
    room_uuid UUID := gen_random_uuid();
    slight_card_uuid UUID := gen_random_uuid();
    curse_card_uuid UUID := gen_random_uuid();
BEGIN
    -- Create sample auth users
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@slights.game', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"display_name": "Game Master", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (player_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'player@slights.game', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"display_name": "Player One", "role": "player"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Sample game cards
    INSERT INTO public.game_cards (id, card_type, content, created_by) VALUES
        (slight_card_uuid, 'slight', 'Left only one sheet on the toilet roll...', admin_uuid),
        (gen_random_uuid(), 'slight', 'Talked through the entire movie...', admin_uuid),
        (gen_random_uuid(), 'slight', 'Used the last of the milk and put the empty carton back...', admin_uuid),
        (gen_random_uuid(), 'slight', 'Parked in two spaces at the grocery store...', admin_uuid),
        (gen_random_uuid(), 'slight', 'Left dirty dishes in the sink overnight...', admin_uuid),
        (curse_card_uuid, 'curse', 'May your socks always be damp.', admin_uuid),
        (gen_random_uuid(), 'curse', 'May your phone battery die at 20%.', admin_uuid),
        (gen_random_uuid(), 'curse', 'May you always get stuck behind slow walkers.', admin_uuid),
        (gen_random_uuid(), 'curse', 'May your earbuds tangle every time you put them away.', admin_uuid),
        (gen_random_uuid(), 'curse', 'May your coffee always be lukewarm.', admin_uuid);

    -- Sample game room
    INSERT INTO public.game_rooms (id, room_code, host_id, name, max_players, current_players, status) VALUES
        (room_uuid, 'DEMO123', admin_uuid, 'Welcome to Slights!', 8, 2, 'waiting'::public.game_status);

    -- Sample player session
    INSERT INTO public.player_sessions (user_id, room_id, current_score, cards_in_hand) VALUES
        (admin_uuid, room_uuid, 0, '[{"id": "' || curse_card_uuid || '", "content": "May your socks always be damp."}]'::jsonb),
        (player_uuid, room_uuid, 0, '[{"id": "' || gen_random_uuid() || '", "content": "May your phone battery die at 20%."}]'::jsonb);

END $$;

-- 8. Cleanup function for development
CREATE OR REPLACE FUNCTION public.cleanup_test_data()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    auth_user_ids_to_delete UUID[];
BEGIN
    -- Get auth user IDs first
    SELECT ARRAY_AGG(id) INTO auth_user_ids_to_delete
    FROM auth.users
    WHERE email LIKE '%@slights.game' OR email LIKE '%@example.com';

    -- Delete in dependency order
    DELETE FROM public.game_rounds WHERE room_id IN (
        SELECT id FROM public.game_rooms WHERE host_id = ANY(auth_user_ids_to_delete)
    );
    DELETE FROM public.player_sessions WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.game_rooms WHERE host_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.game_cards WHERE created_by = ANY(auth_user_ids_to_delete);
    DELETE FROM public.user_profiles WHERE id = ANY(auth_user_ids_to_delete);
    DELETE FROM auth.users WHERE id = ANY(auth_user_ids_to_delete);

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key constraint prevents deletion: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Cleanup failed: %', SQLERRM;
END;
$$;