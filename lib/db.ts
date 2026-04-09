import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
  const { error } = await supabase.from("registrations").insert(data);
  if (error) throw new Error(error.message);
}

export async function getAllRegistrations(): Promise<Registration[]> {
  const { data, error } = await supabase
    .from("registrations")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}
