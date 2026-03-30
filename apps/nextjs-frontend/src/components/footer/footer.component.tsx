'use server';

import {getTranslations} from 'next-intl/server';
import {type JSX} from 'react';
import {LocaleSelect} from './components/LocaleSelect/locale-select.component';

export async function Footer(): Promise<JSX.Element> {
  const t = await getTranslations('components.footer');

  return (
    <footer className="border-t border-slate-200 bg-slate-50 px-2 py-6 text-slate-700 md:px-4">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{t('title')}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{t('description')}</p>
        </div>
        <div className="flex flex-col items-start gap-3 md:items-end">
          <div className="w-44">
            <LocaleSelect />
          </div>
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} {t('copyrightNotice')}
          </p>
        </div>
      </div>
    </footer>
  );
}
