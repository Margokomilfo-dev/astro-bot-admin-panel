import { logoutAction } from "./actions";

type HeaderProps = {
  managerName: string;
  managerPosition: string;
};

export function Header({ managerName, managerPosition }: HeaderProps) {
  return (
    <header className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-3xl font-bold tracking-tight">
        Astro-Bot — Сообщения
      </h1>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-semibold text-slate-800">{managerName}</p>
          <p className="mt-0.5 text-xs font-medium text-slate-500">
            {managerPosition}
          </p>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950"
          >
            Выйти
          </button>
        </form>
      </div>
    </header>
  );
}
