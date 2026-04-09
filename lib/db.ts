import { createClient } from "@supabase/supabase-js";

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(`ENV missing: url=${url ? "ok" : "missing"} key=${key ? "ok" : "missing"}`);
  }
  return createClient(url, key);
}

export type Registration = {
  id: number;
  player_name: string;
  email: string;
  game: string;
  created_at: string;
};

export async function insertRegistration(
  data: Omit<Registration, "id" | "created_at">
) {
  const { error } = await getClient().from("registrations").insert(data);
  if (error) throw new Error(error.message);
}

export async function getAllRegistrations(): Promise<Registration[]> {
  const { data, error } = await getClient()
    .from("registrations")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}
