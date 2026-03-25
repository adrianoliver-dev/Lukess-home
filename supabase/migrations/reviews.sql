-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  verified_purchase BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Everyone can view reviews
CREATE POLICY "Allow public read access to reviews"
  ON public.reviews FOR SELECT
  USING (true);

-- Authenticated users can insert their own reviews
CREATE POLICY "Allow authenticated users to insert reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Users can update/delete their own reviews (optional based on UX)
CREATE POLICY "Allow users to update their own reviews"
  ON public.reviews FOR UPDATE
  USING (auth.uid() = user_id);
