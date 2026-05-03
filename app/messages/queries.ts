import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
} from "@/lib/supabase/server";
import { redirect } from "next/navigation";

import type { Client, ClientAssignment, Manager, Message } from "./types";

const managerSelect = "id, name, surname, position, user_id, created_at";

export async function getClients(managers: Manager[]) {
  const supabase = createSupabaseAdminClient();

  const { data: clients, error } = await supabase
    .from("clients")
    .select(
      "id, telegram_chat_id, telegram_user_id, username, first_name, last_name, created_at",
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const { data: assignments, error: assignmentsError } = await supabase
    .from("client_assignments")
    .select(
      "id, client_id, current_manager_id, assigned_by_manager_id, updated_at",
    );

  if (assignmentsError) {
    throw new Error(assignmentsError.message);
  }

  const managerById = new Map(managers.map((manager) => [manager.id, manager]));
  const assignmentByClientId = new Map(
    assignments.map((assignment) => [
      assignment.client_id,
      {
        ...assignment,
        current_manager: assignment.current_manager_id
          ? managerById.get(assignment.current_manager_id) ?? null
          : null,
        assigned_by_manager: assignment.assigned_by_manager_id
          ? managerById.get(assignment.assigned_by_manager_id) ?? null
          : null,
      } satisfies ClientAssignment,
    ]),
  );

  return clients.map((client): Client => {
    return {
      ...client,
      assignment: assignmentByClientId.get(client.id) ?? null,
      status: "not_resolved",
    };
  });
}

export async function getManagers() {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("managers")
    .select(managerSelect)
    .order("surname", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data satisfies Manager[];
}

export async function getMessagesByClientId(clientId: string) {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("messages")
    .select(
      "id, client_id, text, created_at, clients!inner(telegram_chat_id, telegram_user_id, username, first_name, last_name)",
    )
    .eq("client_id", clientId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data.map((message): Message => {
    const client = message.clients;

    return {
      id: message.id,
      client_id: message.client_id,
      chat_id: client.telegram_chat_id,
      user_id: client.telegram_user_id,
      username: client.username,
      first_name: client.first_name,
      last_name: client.last_name,
      text: message.text,
      created_at: message.created_at,
    };
  });
}

export async function getAuthorizedManager() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect("/login");
  }

  const admin = createSupabaseAdminClient();
  const { data: manager, error: managerError } = await admin
    .from("managers")
    .select(managerSelect)
    .eq("user_id", data.user.id)
    .single();

  if (managerError) {
    throw new Error(managerError.message);
  }

  return manager satisfies Manager;
}
