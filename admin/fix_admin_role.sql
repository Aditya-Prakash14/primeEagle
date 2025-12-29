-- Fix Admin Access - Grant Admin Role to User
-- Run this in Supabase SQL Editor: https://app.supabase.com/project/chewjrpmcvbyynxgcfcc/sql/new

-- Option 1: Update existing user to admin (Replace with your email)
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';

-- Option 2: If you don't know your email, update the first user to admin
UPDATE public.profiles 
SET role = 'admin' 
WHERE id = (SELECT id FROM public.profiles ORDER BY created_at ASC LIMIT 1);

-- Option 3: Update ALL users to admin (for testing only)
UPDATE public.profiles 
SET role = 'admin';

-- Verify the change
SELECT id, email, role, created_at 
FROM public.profiles 
ORDER BY created_at ASC;
