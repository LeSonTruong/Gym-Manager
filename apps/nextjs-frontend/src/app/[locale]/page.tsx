import {getTranslations} from 'next-intl/server';
import {type JSX} from 'react';

export default async function Home(): Promise<JSX.Element> {
  const t = await getTranslations('pages.home');
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:4000';
  const cards = ['frontend', 'backend', 'shared', 'ops'] as const;
  const steps = ['env', 'infra', 'domain'] as const;

  return (
    <section className="grid gap-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">{t('eyebrow')}</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-slate-900">{t('title')}</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">{t('description')}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={`${backendUrl}/api/docs`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            {t('actions.apiDocs')}
          </a>
          <a
            href="#structure"
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-500 hover:text-slate-900"
          >
            {t('actions.structure')}
          </a>
        </div>
      </div>

      <div id="structure" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article key={card} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">{t(`cards.${card}.title`)}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{t(`cards.${card}.description`)}</p>
          </article>
        ))}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-slate-900 p-8 text-slate-100 shadow-sm">
        <h2 className="text-xl font-semibold">{t('nextSteps.title')}</h2>
        <ol className="mt-4 grid gap-3 text-sm leading-6 text-slate-300">
          {steps.map((step, index) => (
            <li key={step} className="flex gap-3">
              <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold">
                {index + 1}
              </span>
              <span>{t(`nextSteps.items.${step}`)}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
