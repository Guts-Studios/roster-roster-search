-- Fix for search functionality: Add public read access policy
-- Run this SQL in your Supabase Dashboard > SQL Editor

CREATE POLICY "Allow public read access to personnel" 
ON public.personnel 
FOR SELECT 
TO anon
USING (true);