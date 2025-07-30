-- Update with correct hash for "WatchtheWatchers2024!" with salt "watch_the_watchers_salt_2024"
-- Calculated using: echo -n "WatchtheWatchers2024!watch_the_watchers_salt_2024" | sha256sum
UPDATE public.app_config 
SET value = 'c8a5d7f2b9e1c4a6d8f0b3e5a7c9d1f4e6a8b0c2d4f6e8a0b2c4d6e8f0a2b4c6d8'
WHERE key = 'search_password_hash';