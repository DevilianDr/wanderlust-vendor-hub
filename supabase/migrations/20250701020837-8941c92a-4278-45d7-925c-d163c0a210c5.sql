
-- Create articles table for place articles
CREATE TABLE public.articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  location TEXT NOT NULL, -- Used to match with properties
  excerpt TEXT, -- Short description for article previews
  featured_image TEXT, -- Main article image URL
  images TEXT[], -- Array of additional image URLs
  author_id UUID REFERENCES auth.users(id),
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on articles table
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Create policies for articles
CREATE POLICY "Anyone can view published articles" 
  ON public.articles 
  FOR SELECT 
  USING (published = true);

CREATE POLICY "Authors can view their own articles" 
  ON public.articles 
  FOR SELECT 
  USING (auth.uid() = author_id);

CREATE POLICY "Authors can create articles" 
  ON public.articles 
  FOR INSERT 
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their own articles" 
  ON public.articles 
  FOR UPDATE 
  USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their own articles" 
  ON public.articles 
  FOR DELETE 
  USING (auth.uid() = author_id);

-- Create index for location-based queries
CREATE INDEX idx_articles_location ON public.articles(location);
CREATE INDEX idx_articles_published ON public.articles(published);
