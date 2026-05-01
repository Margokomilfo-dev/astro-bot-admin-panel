import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
} from "@/lib/supabase/server";

import type { Message } from "./types";

export async function getMessages() {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("messages")
    .select(
      "id, chat_id, user_id, username, first_name, last_name, text, created_at",
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as Message[];
}

export async function getAuthorizedUserEmail() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return data.user?.email ?? null;
}
