import type { Message } from "./types";

export function getDisplayName(message: Message) {
  const fullName = [message.first_name, message.last_name]
    .filter(Boolean)
    .join(" ");

  if (fullName) {
    return fullName;
  }

  if (message.username) {
    return `@${message.username}`;
  }

  return `User ${message.user_id}`;
}

export function formatDate(value: string | null) {
  if (!value) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
