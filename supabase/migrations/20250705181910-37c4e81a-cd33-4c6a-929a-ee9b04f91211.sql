-- Create personnel table for police department roster
CREATE TABLE public.personnel (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  last_name TEXT NOT NULL,
  first_name TEXT NOT NULL,
  classification TEXT,
  badge_number TEXT UNIQUE,
  division TEXT,
  regular_pay DECIMAL(12,2),
  premiums DECIMAL(12,2),
  overtime DECIMAL(12,2),
  payout DECIMAL(12,2),
  other_pay DECIMAL(12,2),
  health_dental_vision DECIMAL(12,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.personnel ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users only (sensitive personnel data)
CREATE POLICY "Only authenticated users can view personnel" 
ON public.personnel 
FOR SELECT 
TO authenticated
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

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_personnel_updated_at
  BEFORE UPDATE ON public.personnel
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for common search fields
CREATE INDEX idx_personnel_badge_number ON public.personnel(badge_number);
CREATE INDEX idx_personnel_last_name ON public.personnel(last_name);
CREATE INDEX idx_personnel_first_name ON public.personnel(first_name);
CREATE INDEX idx_personnel_division ON public.personnel(division);