
CREATE TABLE public.cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'other',
  membership_number TEXT,
  barcode_value TEXT NOT NULL,
  barcode_format TEXT NOT NULL DEFAULT 'CODE128',
  notes TEXT,
  expiry_date DATE,
  color TEXT DEFAULT '#1a1a1a',
  image_url TEXT,
  is_favorite BOOLEAN NOT NULL DEFAULT false,
  open_count INTEGER NOT NULL DEFAULT 0,
  last_opened_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.cards TO authenticated;
GRANT ALL ON public.cards TO service_role;

ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own cards" ON public.cards
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX cards_user_id_idx ON public.cards(user_id);
CREATE INDEX cards_user_fav_idx ON public.cards(user_id, is_favorite);

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER cards_set_updated_at BEFORE UPDATE ON public.cards
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
