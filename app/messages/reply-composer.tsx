"use client";

import { useState } from "react";

type ReplyComposerProps = {
  clientId: string;
  canReply: boolean;
  disabledReason: string | null;
};

function getDraftStorageKey(clientId: string) {
  return `messages:reply-draft:${clientId}`;
}

export function ReplyComposer({
  clientId,
  canReply,
  disabledReason,
}: ReplyComposerProps) {
  const [draft, setDraft] = useState(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return window.localStorage.getItem(getDraftStorageKey(clientId)) ?? "";
  });

  function handleDraftChange(value: string) {
    setDraft(value);

    const storageKey = getDraftStorageKey(clientId);

    if (value) {
      window.localStorage.setItem(storageKey, value);
    } else {
      window.localStorage.removeItem(storageKey);
    }
  }

  return (
    <div className="border-t border-slate-200 bg-white px-5 py-4">
      {disabledReason ? (
        <p className="mb-2 text-xs font-medium text-slate-500">
          {disabledReason}
        </p>
      ) : null}
      <div
        className={`flex items-end gap-3 rounded-md border px-3 py-2 shadow-inner ${
          canReply
            ? "border-slate-200 bg-slate-50"
            : "border-slate-200 bg-slate-100"
        }`}
      >
        <textarea
          rows={2}
          value={draft}
          onChange={(event) => handleDraftChange(event.target.value)}
          placeholder={
            canReply
              ? "Write a reply to the client..."
              : "Assign this client to yourself before replying..."
          }
          disabled={!canReply}
          className="min-h-10 flex-1 resize-none bg-transparent text-sm leading-5 text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:text-slate-400"
        />
        <button
          type="button"
          disabled={!canReply}
          className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
        >
          Send
        </button>
      </div>
    </div>
  );
}
