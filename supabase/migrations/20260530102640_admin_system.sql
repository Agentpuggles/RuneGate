/*
  # Admin System Migration

  1. New Tables
    - `admin_users` - Tracks who can access admin panel
    - `announcements` - Site-wide announcements
    - `banned_users` - Banned users list
    - `site_settings` - Global site settings
  
  2. Security
    - RLS enabled on all tables
    - Only admins can access admin tables
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL UNIQUE,
  role text NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'moderator')),
  created_at timestamptz DEFAULT now(),
  created_by text
);

-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  type text NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'warning', 'maintenance', 'event')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  created_by text
);

-- Create banned_users table
CREATE TABLE IF NOT EXISTS banned_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL UNIQUE,
  reason text,
  banned_by text,
  banned_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  is_permanent boolean DEFAULT false
);

-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  key text PRIMARY KEY,
  value text,
  description text,
  updated_at timestamptz DEFAULT now(),
  updated_by text
);

-- Create audit_log table
CREATE TABLE IF NOT EXISTS audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL,
  actor_id text,
  target_id text,
  details jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE banned_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_users
CREATE POLICY "Admins can view admin_users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()::text)
  );

CREATE POLICY "Super admins can manage admin_users"
  ON admin_users FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()::text AND role = 'super_admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()::text AND role = 'super_admin')
  );

-- RLS Policies for announcements
CREATE POLICY "Anyone can view active announcements"
  ON announcements FOR SELECT
  TO authenticated
  USING (is_active = true OR EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()::text));

CREATE POLICY "Admins can manage announcements"
  ON announcements FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()::text))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()::text));

-- RLS Policies for banned_users
CREATE POLICY "Admins can view banned_users"
  ON banned_users FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()::text));

CREATE POLICY "Admins can manage banned_users"
  ON banned_users FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()::text))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()::text));

-- RLS Policies for site_settings
CREATE POLICY "Admins can manage settings"
  ON site_settings FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()::text))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()::text));

-- RLS Policies for audit_log
CREATE POLICY "Admins can view audit_log"
  ON audit_log FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()::text));

CREATE POLICY "Admins can insert audit_log"
  ON audit_log FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()::text));

-- Insert default admin (admin username has user_id matching their id from prisma)
-- We'll handle this in the seed or first login

-- Insert default site settings
INSERT INTO site_settings (key, value, description) VALUES
  ('site_name', 'RuneGate', 'Site display name'),
  ('maintenance_mode', 'false', 'Enable maintenance mode'),
  ('registration_enabled', 'true', 'Allow new user registration'),
  ('max_gold_per_day', '1000', 'Maximum gold earned per day'),
  ('xp_multiplier', '1.0', 'Global XP multiplier')
ON CONFLICT (key) DO NOTHING;
