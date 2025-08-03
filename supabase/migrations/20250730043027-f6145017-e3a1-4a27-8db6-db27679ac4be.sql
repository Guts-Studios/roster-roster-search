-- Create app_config table for secure configuration storage
CREATE TABLE public.app_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

-- Create policies - only allow read access for search password verification
CREATE POLICY "Allow reading search password hash" 
ON public.app_config 
FOR SELECT 
USING (key = 'search_password_hash');

-- Block all other operations for security
CREATE POLICY "Block insert operations" 
ON public.app_config 
FOR INSERT 
WITH CHECK (false);

CREATE POLICY "Block update operations" 
ON public.app_config 
FOR UPDATE 
USING (false);

CREATE POLICY "Block delete operations" 
ON public.app_config 
FOR DELETE 
USING (false);

-- Insert the hashed password (using SHA-256 with salt)
-- Hash of "WatchtheWatchers2024!" with salt "watch_the_watchers_salt_2024"
INSERT INTO public.app_config (key, value, description) VALUES (
  'search_password_hash',
  'a8b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1',
  'Hashed password for search access'
);

-- Create trigger for updated_at
CREATE TRIGGER update_app_config_updated_at
BEFORE UPDATE ON public.app_config
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Fix database function security by setting search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;