-- Create app_config table for storing application configuration
CREATE TABLE IF NOT EXISTS app_config (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;

-- Create policy to allow reading config values (but not writing)
CREATE POLICY "Allow read access to app_config" ON app_config
    FOR SELECT USING (true);

-- Insert the hashed password for search access
-- This is the SHA-256 hash of "WatchtheWatchers2024!" + "watch_the_watchers_salt_2024"
INSERT INTO app_config (key, value, description) VALUES (
    'search_password_hash',
    'f8c3bf62a9aa3e6fc1619c250e48aaae4ff99d677b4180ac049b7e7275b4c5a8',
    'Hashed password for search access - WatchtheWatchers2024!'
) ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    description = EXCLUDED.description,
    updated_at = NOW();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_app_config_updated_at 
    BEFORE UPDATE ON app_config 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();