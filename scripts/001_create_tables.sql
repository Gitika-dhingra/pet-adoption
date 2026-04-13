-- Pet Adoption & Animal Shelter Management System Database Schema

-- Profiles table for user data
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'full_name', NULL)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Pets table
CREATE TABLE IF NOT EXISTS public.pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  species TEXT NOT NULL CHECK (species IN ('dog', 'cat', 'bird', 'rabbit', 'other')),
  breed TEXT,
  age_months INTEGER,
  gender TEXT CHECK (gender IN ('male', 'female', 'unknown')),
  size TEXT CHECK (size IN ('small', 'medium', 'large')),
  color TEXT,
  description TEXT,
  image_url TEXT,
  is_vaccinated BOOLEAN DEFAULT FALSE,
  is_neutered BOOLEAN DEFAULT FALSE,
  is_house_trained BOOLEAN DEFAULT FALSE,
  good_with_kids BOOLEAN DEFAULT FALSE,
  good_with_pets BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'pending', 'adopted')),
  shelter_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;

-- Anyone can view available pets
CREATE POLICY "pets_select_all" ON public.pets FOR SELECT USING (true);

-- Adoption applications table
CREATE TABLE IF NOT EXISTS public.adoption_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'withdrawn')),
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.adoption_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "applications_select_own" ON public.adoption_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "applications_insert_own" ON public.adoption_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "applications_update_own" ON public.adoption_applications FOR UPDATE USING (auth.uid() = user_id);

-- Injury reports table
CREATE TABLE IF NOT EXISTS public.injury_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  animal_type TEXT NOT NULL,
  description TEXT NOT NULL,
  location_description TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  image_url TEXT,
  severity TEXT CHECK (severity IN ('minor', 'moderate', 'severe', 'critical')),
  status TEXT DEFAULT 'reported' CHECK (status IN ('reported', 'responding', 'resolved')),
  reporter_phone TEXT,
  reporter_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.injury_reports ENABLE ROW LEVEL SECURITY;

-- Anyone can insert injury reports (even anonymous)
CREATE POLICY "injury_reports_insert_all" ON public.injury_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "injury_reports_select_own" ON public.injury_reports FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- Favorites table
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, pet_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "favorites_select_own" ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "favorites_insert_own" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "favorites_delete_own" ON public.favorites FOR DELETE USING (auth.uid() = user_id);
