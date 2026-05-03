"use server";

import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
} from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function logoutAction() {
  const supabase = await createSupabaseServerClient();

  await supabase.auth.signOut();

  redirect("/login");
}

export async function assignClientAction(formData: FormData) {
  const clientId = String(formData.get("clientId") ?? "");
  const managerId = String(formData.get("managerId") ?? "");

  if (!clientId || !managerId) {
    throw new Error("Missing client or manager for assignment.");
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect("/login");
  }

  const admin = createSupabaseAdminClient();
  const { data: currentManager, error: managerError } = await admin
    .from("managers")
    .select("id")
    .eq("user_id", data.user.id)
    .single();

  if (managerError) {
    throw new Error(managerError.message);
  }

  const { error: assignmentError } = await admin
    .from("client_assignments")
    .upsert(
      {
        client_id: clientId,
        current_manager_id: managerId,
        assigned_by_manager_id: currentManager.id,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "client_id" },
    );

  if (assignmentError) {
    throw new Error(assignmentError.message);
  }

  revalidatePath("/messages");
  redirect(`/messages?client=${clientId}`);
}
