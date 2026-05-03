import { ChatPanel } from "./chat-panel";
import { ClientsSidebar } from "./clients-sidebar";
import { Header } from "./header";
import {
  getAuthorizedManager,
  getClients,
  getManagers,
  getMessagesByClientId,
} from "./queries";

export const dynamic = "force-dynamic";

type MessagesPageProps = {
  searchParams: Promise<{
    client?: string | string[];
  }>;
};

export default async function MessagesPage({ searchParams }: MessagesPageProps) {
  const manager = await getAuthorizedManager();
  const managers = await getManagers();
  const clients = await getClients(managers);
  const query = await searchParams;
  const clientParam = Array.isArray(query.client) ? query.client[0] : query.client;
  const selectedClient =
    clients.find((client) => client.id === clientParam) ?? clients[0] ?? null;
  const messages = selectedClient
    ? await getMessagesByClientId(selectedClient.id)
    : [];
  const managerName = `${manager.name} ${manager.surname}`;

  return (
    <main className="min-h-screen bg-[#eef2f5] px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-7xl flex-col">
        <Header managerName={managerName} managerPosition={manager.position} />

        <section className="h-[calc(100vh-9rem)] min-h-[560px] overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          <div className="grid h-full min-w-[820px] grid-cols-[320px_minmax(0,1fr)]">
            <ClientsSidebar
              clients={clients}
              selectedClientId={selectedClient?.id}
            />
            <div className="flex min-h-0 flex-col bg-[#e9eef3]">
              <ChatPanel
                selectedClient={selectedClient}
                messages={messages}
                managers={managers}
                currentManager={manager}
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
