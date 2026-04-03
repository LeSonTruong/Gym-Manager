import { type JSX, type ReactNode } from 'react';
import { type BadgeTone } from '@/lib/gym-data.ts';

type PageHeaderProps = {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly actions?: ReactNode;
};

type StatItem = {
  readonly label: string;
  readonly value: string;
  readonly note: string;
};

type StatsGridProps = {
  readonly items: StatItem[];
};

type SectionCardProps = {
  readonly title: string;
  readonly description?: string;
  readonly children: ReactNode;
};

type DataTableProps = {
  readonly headers: string[];
  readonly rows: ReactNode[][];
  readonly emptyMessage?: string;
};

type KeyValueListProps = {
  readonly items: Array<{
    readonly label: string;
    readonly value: ReactNode;
  }>;
};

const badgeToneClassMap: Record<BadgeTone, string> = {
  slate: 'border-slate-300/80 bg-slate-100/90 text-slate-700',
  emerald: 'border-emerald-300/80 bg-emerald-100/90 text-emerald-800',
  amber: 'border-amber-300/80 bg-amber-100/90 text-amber-900',
  rose: 'border-rose-300/80 bg-rose-100/90 text-rose-800',
  sky: 'border-sky-300/80 bg-sky-100/90 text-sky-800',
};

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps): JSX.Element {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/84 p-6 shadow-[0_32px_78px_rgba(15,23,42,0.09)] backdrop-blur-xl lg:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent-600)]">{eyebrow}</p>
          <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight text-slate-950 lg:text-4xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
        </div>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : undefined}
      </div>
    </section>
  );
}

export function StatsGrid({ items }: StatsGridProps): JSX.Element {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <article
          key={item.label}
          className="rounded-[1.8rem] border border-white/70 bg-white/82 p-5 shadow-[0_24px_58px_rgba(15,23,42,0.07)] backdrop-blur transition hover:-translate-y-1"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{item.label}</p>
          <p className="font-display mt-3 bg-[linear-gradient(110deg,#0f172a_0%,#334155_58%,#0f172a_100%)] bg-clip-text text-3xl font-semibold tracking-tight text-transparent">{item.value}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{item.note}</p>
        </article>
      ))}
    </section>
  );
}

export function SectionCard({ title, description, children }: SectionCardProps): JSX.Element {
  return (
    <section className="rounded-[1.8rem] border border-white/70 bg-white/84 p-5 shadow-[0_24px_58px_rgba(15,23,42,0.07)] backdrop-blur-xl lg:p-6">
      <div className="mb-5">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-slate-950">{title}</h2>
        {description ? <p className="mt-2 text-sm text-slate-600">{description}</p> : undefined}
      </div>
      {children}
    </section>
  );
}

export function Badge({ children, tone = 'slate' }: { readonly children: ReactNode; readonly tone?: BadgeTone }): JSX.Element {
  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold tracking-wide ${badgeToneClassMap[tone]}`}>
      {children}
    </span>
  );
}

export function DataTable({ headers, rows, emptyMessage = 'Khong co du lieu.' }: DataTableProps): JSX.Element {
  return (
    <div className="overflow-hidden rounded-[1.35rem] border border-slate-200/80 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
      <div className="overflow-x-auto [-webkit-overflow-scrolling:touch]">
        <table className="min-w-full divide-y divide-slate-200 text-left text-[13px] sm:text-sm">
          <thead className="bg-slate-100/90 text-[10px] uppercase tracking-[0.16em] text-slate-500 sm:text-xs sm:tracking-[0.18em]">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-3 py-2.5 font-semibold sm:px-4 sm:py-3">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="pi pi-circle-fill text-[6px] text-[var(--accent-500)]" />
                    {header}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white/84 text-slate-700">
            {rows.length > 0 ? (
              rows.map((row, rowIndex) => (
                <tr key={`row-${rowIndex}`} className="transition hover:bg-slate-50/70">
                  {row.map((cell, cellIndex) => (
                    <td key={`cell-${rowIndex}-${cellIndex}`} className="px-3 py-2.5 align-top sm:px-4 sm:py-3">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-3 py-5 text-sm text-slate-500 sm:px-4 sm:py-6" colSpan={headers.length}>
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function KeyValueList({ items }: KeyValueListProps): JSX.Element {
  return (
    <dl className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <div key={item.label} className="rounded-2xl border border-slate-200/80 bg-slate-50/84 p-4 shadow-[0_8px_20px_rgba(15,23,42,0.03)]">
          <dt className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{item.label}</dt>
          <dd className="mt-2 text-sm leading-6 text-slate-800">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
