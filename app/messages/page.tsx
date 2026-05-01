import { getAuthorizedUserEmail, getMessages } from "./queries";
import { formatDate, getDisplayName } from "./utils";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const [messages, userEmail] = await Promise.all([
    getMessages(),
    getAuthorizedUserEmail(),
  ]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      {userEmail ? (
        <p className="mb-6 text-left text-sm font-medium text-slate-600">
          {userEmail}
        </p>
      ) : null}

      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            SupportBot — Сообщения
          </h1>
        </header>

        {messages.length === 0 ? (
          <section className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
            <h2 className="text-lg font-semibold">Сообщений пока нет</h2>
            <p className="mt-2 text-sm text-slate-500">
              Новые сообщения из Supabase появятся здесь.
            </p>
          </section>
        ) : (
          <section className="space-y-4">
            {messages.map((message) => (
              <article
                key={message.id}
                className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                  <h2 className="text-base font-bold">
                    {getDisplayName(message)}
                  </h2>
                  <time className="text-sm text-slate-500">
                    {formatDate(message.created_at)}
                  </time>
                </div>

                <p className="whitespace-pre-wrap text-base leading-7 text-slate-800">
                  {message.text}
                </p>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
