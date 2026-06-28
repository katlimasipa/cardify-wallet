import { supabase } from "@/integrations/supabase/client";

export interface Card {
  id: string;
  user_id: string;
  name: string;
  category: string;
  membership_number: string | null;
  barcode_value: string;
  barcode_format: string;
  notes: string | null;
  expiry_date: string | null;
  color: string | null;
  image_url: string | null;
  is_favorite: boolean;
  open_count: number;
  last_opened_at: string | null;
  created_at: string;
  updated_at: string;
}

export async function listCards(): Promise<Card[]> {
  const { data, error } = await supabase
    .from("cards" as any)
    .select("*")
    .order("is_favorite", { ascending: false })
    .order("last_opened_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as Card[];
}

export async function getCard(id: string): Promise<Card> {
  const { data, error } = await supabase.from("cards" as any).select("*").eq("id", id).single();
  if (error) throw error;
  return data as unknown as Card;
}

export async function createCard(input: Partial<Card>) {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error("Not signed in");
  const { data, error } = await supabase
    .from("cards" as any)
    .insert({ ...input, user_id: u.user.id } as any)
    .select()
    .single();
  if (error) throw error;
  return data as unknown as Card;
}

export async function updateCard(id: string, patch: Partial<Card>) {
  const { data, error } = await supabase
    .from("cards" as any)
    .update(patch as any)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as unknown as Card;
}

export async function deleteCard(id: string) {
  const { error } = await supabase.from("cards" as any).delete().eq("id", id);
  if (error) throw error;
}

export async function bumpOpen(id: string, current: number) {
  await supabase
    .from("cards" as any)
    .update({ open_count: current + 1, last_opened_at: new Date().toISOString() } as any)
    .eq("id", id);
}
