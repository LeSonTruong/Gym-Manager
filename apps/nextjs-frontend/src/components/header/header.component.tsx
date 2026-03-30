import {type JSX} from 'react';
import {Link} from '@/i18n/navigation.ts';

export function Header(): JSX.Element {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-2 py-4 md:px-4">
        <Link href="/" className="flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Next Nest Turbo
          </span>
          <span className="text-lg font-semibold text-slate-900">Fullstack Template</span>
        </Link>
        <span className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600">
          Next.js + NestJS + Turborepo
        </span>
      </div>
    </header>
  );
}
