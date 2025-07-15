-- Debug RLS policies for personnel table
-- Run this in Supabase Dashboard > SQL Editor to see current policies

-- Check all policies on personnel table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'personnel';

-- Check if RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'personnel';

-- Test if we can select data directly (this should work if policies are correct)
SELECT COUNT(*) as total_records FROM personnel;
SELECT first_name, last_name, badge_number FROM personnel WHERE first_name ILIKE '%Javier%' LIMIT 5;