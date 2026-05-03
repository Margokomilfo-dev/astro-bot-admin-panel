import { AssignmentForm } from "./assignment-form";
import { MessageList } from "./message-list";
import { ReplyComposer } from "./reply-composer";
import type { Client, Manager, Message } from "./types";
import { getDisplayName, getInitials } from "./utils";

type ChatPanelProps = {
  selectedClient: Client | null;
  messages: Message[];
  managers: Manager[];
  currentManager: Manager;
};

export function ChatPanel({
  selectedClient,
  messages,
  managers,
  currentManager,
}: ChatPanelProps) {
  if (!selectedClient) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-center">
        <div>
          <h2 className="text-lg font-semibold">No client selected</h2>
          <p className="mt-2 text-sm text-slate-500">
            Add clients in Supabase to see their conversations here.
          </p>
        </div>
      </div>
    );
  }

  const assignedManager = selectedClient.assignment?.current_manager;
  const canReply = assignedManager?.id === currentManager.id;
  const disabledReason = !assignedManager
    ? "Assign this client to a manager before replying."
    : canReply
      ? null
      : `This client is assigned to ${assignedManager.name} ${assignedManager.surname}. Reassign it to yourself before replying.`;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">
            {getInitials(selectedClient)}
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold">
              {getDisplayName(selectedClient)}
            </h2>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <span>Chat ID {selectedClient.telegram_chat_id}</span>
              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700 ring-1 ring-amber-200">
                Not resolved
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${
                  selectedClient.assignment?.current_manager
                    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                    : "bg-slate-100 text-slate-500 ring-slate-200"
                }`}
              >
                {selectedClient.assignment?.current_manager
                  ? `Assigned to ${selectedClient.assignment.current_manager.name} ${selectedClient.assignment.current_manager.surname}`
                  : "No assign"}
              </span>
            </div>
          </div>
        </div>
        <AssignmentForm selectedClient={selectedClient} managers={managers} />
      </div>

      {messages.length === 0 ? (
        <div className="flex flex-1 items-center justify-center p-8 text-center">
          <div>
            <h3 className="text-lg font-semibold">Сообщений пока нет</h3>
            <p className="mt-2 text-sm text-slate-500">
              Сообщения выбранного клиента появятся здесь.
            </p>
          </div>
        </div>
      ) : (
        <MessageList messages={messages} />
      )}

      <ReplyComposer
        key={selectedClient.id}
        clientId={selectedClient.id}
        canReply={canReply}
        disabledReason={disabledReason}
      />
    </>
  );
}
