import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-16 text-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
          Admin panel
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">
          Telegram bot messages
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-zinc-600">
          Open the public messages page to view every message saved in Supabase.
        </p>
        <Link
          href="/messages"
          className="inline-flex h-11 w-fit items-center justify-center rounded-md bg-zinc-950 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
        >
          View messages
        </Link>
      </div>
    </main>
  );
}
