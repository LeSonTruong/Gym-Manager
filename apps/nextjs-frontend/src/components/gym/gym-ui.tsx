import {type JSX, type ReactNode} from 'react';
import {type BadgeTone} from '@/lib/gym-data.ts';

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
  slate: 'border-slate-300 bg-slate-100 text-slate-700',
  emerald: 'border-emerald-300 bg-emerald-100 text-emerald-700',
  amber: 'border-amber-300 bg-amber-100 text-amber-800',
  rose: 'border-rose-300 bg-rose-100 text-rose-700',
  sky: 'border-sky-300 bg-sky-100 text-sky-700',
};

export function PageHeader({eyebrow, title, description, actions}: PageHeaderProps): JSX.Element {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_30px_70px_rgba(15,23,42,0.08)] backdrop-blur lg:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-600">{eyebrow}</p>
          <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight text-slate-950 lg:text-4xl">{title}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 lg:text-base">{description}</p>
        </div>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : undefined}
      </div>
    </section>
  );
}

export function StatsGrid({items}: StatsGridProps): JSX.Element {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <article
          key={item.label}
          className="rounded-[1.75rem] border border-white/70 bg-white/80 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.06)] backdrop-blur"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{item.label}</p>
          <p className="mt-3 font-display text-3xl font-semibold tracking-tight text-slate-950">{item.value}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{item.note}</p>
        </article>
      ))}
    </section>
  );
}

export function SectionCard({title, description, children}: SectionCardProps): JSX.Element {
  return (
    <section className="rounded-[1.75rem] border border-white/70 bg-white/82 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.06)] backdrop-blur lg:p-6">
      <div className="mb-5">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-slate-950">{title}</h2>
        {description ? <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p> : undefined}
      </div>
      {children}
    </section>
  );
}

export function Badge({children, tone = 'slate'}: {readonly children: ReactNode; readonly tone?: BadgeTone}): JSX.Element {
  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${badgeToneClassMap[tone]}`}>
      {children}
    </span>
  );
}

export function DataTable({headers, rows, emptyMessage = 'Khong co du lieu.'}: DataTableProps): JSX.Element {
  return (
    <div className="overflow-hidden rounded-[1.25rem] border border-slate-200/80">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-100/80 text-xs uppercase tracking-[0.18em] text-slate-500">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-4 py-3 font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white/80 text-slate-700">
            {rows.length > 0 ? (
              rows.map((row, rowIndex) => (
                <tr key={`row-${rowIndex}`}>
                  {row.map((cell, cellIndex) => (
                    <td key={`cell-${rowIndex}-${cellIndex}`} className="px-4 py-3 align-top">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-6 text-sm text-slate-500" colSpan={headers.length}>
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

export function KeyValueList({items}: KeyValueListProps): JSX.Element {
  return (
    <dl className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <div key={item.label} className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4">
          <dt className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{item.label}</dt>
          <dd className="mt-2 text-sm leading-6 text-slate-800">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
