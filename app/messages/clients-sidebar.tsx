import Link from "next/link";

import type { Client } from "./types";
import { getDisplayName, getInitials } from "./utils";

type ClientsSidebarProps = {
  clients: Client[];
  selectedClientId?: string;
};

export function ClientsSidebar({
  clients,
  selectedClientId,
}: ClientsSidebarProps) {
  return (
    <aside className="border-r border-slate-200 bg-[#f7f8fa]">
      <div className="border-b border-slate-200 px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-950">Clients</h2>
            <p className="mt-1 text-sm text-slate-500">
              {clients.length} in Supabase
            </p>
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500 shadow-sm ring-1 ring-slate-200">
            All
          </span>
        </div>
      </div>

      {clients.length === 0 ? (
        <div className="p-5 text-sm text-slate-500">
          No clients found in Supabase.
        </div>
      ) : (
        <nav className="max-h-[calc(100vh-13rem)] space-y-1 overflow-y-auto p-3">
          {clients.map((client) => {
            const isActive = client.id === selectedClientId;

            return (
              <Link
                key={client.id}
                href={`/messages?client=${client.id}`}
                className={`flex items-center gap-3 rounded-md px-3 py-3 transition-colors ${
                  isActive
                    ? "bg-white text-slate-950 shadow-sm ring-1 ring-slate-200"
                    : "text-slate-700 hover:bg-white hover:text-slate-950"
                }`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    isActive
                      ? "bg-slate-950 text-white"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {getInitials(client)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">
                    {getDisplayName(client)}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-slate-500">
                    Telegram ID {client.telegram_user_id}
                  </span>
                  <span className="mt-2 flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700 ring-1 ring-amber-200">
                      Not resolved
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${
                        client.assignment?.current_manager
                          ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                          : "bg-slate-100 text-slate-500 ring-slate-200"
                      }`}
                    >
                      {client.assignment?.current_manager
                        ? client.assignment.current_manager.name
                        : "No assign"}
                    </span>
                  </span>
                </span>
              </Link>
            );
          })}
        </nav>
      )}
    </aside>
  );
}
