-- NANO WORLD SCHOOL - SUPABASE DATABASE SCHEMA

-- 1. CONTACT SUBMISSIONS TABLE
-- Stores all admission enquiries from the contact form
CREATE TABLE IF NOT EXISTS contact_submissions (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    grade TEXT NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'Pending' -- Pending, Read, Replied
);

-- 2. SITE SETTINGS TABLE
-- Stores global configuration like social links and contact info
CREATE TABLE IF NOT EXISTS site_settings (
    id INT PRIMARY KEY DEFAULT 1,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    site_name TEXT DEFAULT 'Nano World School',
    contact_email TEXT DEFAULT 'info@nanoworldschool.com',
    contact_phone TEXT DEFAULT '+91 98765 43210',
    address TEXT DEFAULT 'Plot No. 45, Nano World School Road, Hyderabad',
    facebook_url TEXT,
    instagram_url TEXT,
    twitter_url TEXT,
    youtube_url TEXT,
    CONSTRAINT single_row CHECK (id = 1) -- Ensure only one settings row exists
);

-- 3. GALLERY TABLE
-- Manages images for the school gallery
CREATE TABLE IF NOT EXISTS gallery (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    url TEXT NOT NULL,
    title TEXT,
    category TEXT DEFAULT 'Campus' -- Campus, Activities, Events
);

-- 4. PROFILES TABLE
-- Stores additional info for admin users
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    full_name TEXT,
    role TEXT DEFAULT 'Editor', -- Super Admin, Editor
    avatar_url TEXT
);

-- 5. SITE CONTENT TABLE
-- Stores page-specific content in JSON format for easy management
CREATE TABLE IF NOT EXISTS site_content (
    id TEXT PRIMARY KEY, -- 'home', 'about', 'academics'
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    content JSONB NOT NULL
);

-- RLS (Row Level Security) POLICIES --

-- Enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Public Access (Read-only for specific tables)
CREATE POLICY "Public read access for gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Public read access for site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public read access for site_content" ON site_content FOR SELECT USING (true);

-- Submission Access (Write-only for public)
CREATE POLICY "Public can submit enquiries" ON contact_submissions FOR INSERT WITH CHECK (true);

-- Admin Access (Full access for authenticated users)
CREATE POLICY "Admins can manage enquiries" ON contact_submissions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage gallery" ON gallery FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage content" ON site_content FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Users can manage own profiles" ON profiles FOR ALL USING (auth.uid() = id);


-- TRIGGER: Create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- SEED DATA --
INSERT INTO site_settings (id, facebook_url, instagram_url) 
VALUES (1, 'https://facebook.com/nanoworld', 'https://instagram.com/nanoworld')
ON CONFLICT (id) DO NOTHING;
