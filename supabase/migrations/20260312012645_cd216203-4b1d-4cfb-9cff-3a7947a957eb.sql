
-- Create categories table
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Categories are viewable by everyone"
  ON public.categories FOR SELECT
  TO public
  USING (true);

-- Authenticated insert
CREATE POLICY "Authenticated users can insert categories"
  ON public.categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated delete
CREATE POLICY "Authenticated users can delete categories"
  ON public.categories FOR DELETE
  TO authenticated
  USING (true);

-- Seed initial categories
INSERT INTO public.categories (name) VALUES
  ('Cadeaux de naissance'),
  ('Décorations du Ramadan'),
  ('Gift Box');
