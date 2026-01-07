-- Create table for access codes
CREATE TABLE public.access_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  is_used BOOLEAN NOT NULL DEFAULT false,
  used_by UUID REFERENCES auth.users(id),
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.access_codes ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone authenticated can check if code exists (read)
CREATE POLICY "Authenticated users can view codes"
ON public.access_codes
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Policy: Authenticated users can update unused codes (to claim them)
CREATE POLICY "Authenticated users can claim unused codes"
ON public.access_codes
FOR UPDATE
USING (auth.uid() IS NOT NULL AND is_used = false)
WITH CHECK (auth.uid() IS NOT NULL AND used_by = auth.uid());

-- Add column to profiles to track if user has validated code
ALTER TABLE public.profiles ADD COLUMN code_validated BOOLEAN DEFAULT false;

-- Insert initial access codes (10 codes)
INSERT INTO public.access_codes (code) VALUES
  ('LEVE2024'),
  ('FIT2024'),
  ('SAUDE2024'),
  ('LEVEFIT01'),
  ('LEVEFIT02'),
  ('LEVEFIT03'),
  ('LEVEFIT04'),
  ('LEVEFIT05'),
  ('LEVEFIT06'),
  ('LEVEFIT07');