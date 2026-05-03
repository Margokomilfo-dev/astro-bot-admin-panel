import type { Message } from "./types";
import {
  formatMessageDay,
  formatMessageTime,
  getMessageDayKey,
} from "./utils";

type MessageListProps = {
  messages: Message[];
};

export function MessageList({ messages }: MessageListProps) {
  const messageGroups = messages.reduce<
    Array<{ key: string; label: string; messages: Message[] }>
  >((groups, message) => {
    const key = getMessageDayKey(message.created_at);
    const currentGroup = groups.at(-1);

    if (currentGroup?.key === key) {
      currentGroup.messages.push(message);
      return groups;
    }

    groups.push({
      key,
      label: formatMessageDay(message.created_at),
      messages: [message],
    });

    return groups;
  }, []);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
      <div className="space-y-4">
        {messageGroups.map((group) => (
          <section key={group.key} className="space-y-2.5">
            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-slate-300/80" />
              <time className="rounded-full bg-white/85 px-2.5 py-0.5 text-[11px] font-semibold text-slate-500 shadow-sm ring-1 ring-slate-200">
                {group.label}
              </time>
              <span className="h-px flex-1 bg-slate-300/80" />
            </div>

            <div className="rounded-md bg-white px-3 py-1.5 shadow-sm ring-1 ring-slate-200">
              {group.messages.map((message) => (
                <article
                  key={message.id}
                  className="border-b border-slate-100 last:border-b-0"
                >
                  <div className="flex w-full items-start gap-4 py-2 text-slate-900">
                    <p className="min-w-0 flex-1 whitespace-pre-wrap break-words text-left text-sm leading-5">
                      {message.text}
                    </p>
                    <time className="shrink-0 pt-0.5 text-right text-[10px] font-medium leading-none text-slate-400">
                      {formatMessageTime(message.created_at)}
                    </time>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
