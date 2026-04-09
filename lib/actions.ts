"use server";

import { insertRegistration } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type FormState = {
  success: boolean;
  message: string;
};

export async function registerAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const player_name = formData.get("player_name")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim() ?? "";
  const game = formData.get("game")?.toString().trim() ?? "";

  if (!player_name || !email || !game) {
    return { success: false, message: "buh talbariig boglono uu." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, message: "email buruu baina." };
  }

  try {
    await insertRegistration({ player_name, email, game });
    revalidatePath("/dashboard");
    return { success: true, message: `${player_name} amjilttai burtgelee` };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { success: false, message: `aldaa: ${msg}` };
  }
}
