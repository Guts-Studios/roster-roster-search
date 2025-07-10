-- Update RLS policies to allow public access for personnel data
DROP POLICY "Only authenticated users can view personnel" ON public.personnel;
DROP POLICY "Only authenticated users can insert personnel" ON public.personnel;
DROP POLICY "Only authenticated users can update personnel" ON public.personnel;
DROP POLICY "Only authenticated users can delete personnel" ON public.personnel;

-- Create new policies for public read access but authenticated write access
CREATE POLICY "Allow public read access to personnel" 
ON public.personnel 
FOR SELECT 
USING (true);

CREATE POLICY "Only authenticated users can insert personnel" 
ON public.personnel 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Only authenticated users can update personnel" 
ON public.personnel 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Only authenticated users can delete personnel" 
ON public.personnel 
FOR DELETE 
TO authenticated
USING (true);