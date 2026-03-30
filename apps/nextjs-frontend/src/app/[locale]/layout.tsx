import {type JSX} from 'react';
import type {Metadata} from 'next';
import {Manrope, Space_Grotesk} from 'next/font/google';
import {ConfirmDialog} from 'primereact/confirmdialog';
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
// eslint-disable-next-line import-x/order
import './globals.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/bootstrap4-light-blue/theme.css';
import {AppShell} from '@/components/app-shell/app-shell.component.tsx';
import {ReactQueryProvider} from '@/providers/react-query/react-query.provider';
import {ToastProvider} from '@/providers/toast/toast.provider';
import {routing} from '@/i18n/routing.ts';
import {ZodErrorProvider} from '@/providers/zod-error/zod-error.provider';

const bodyFont = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
});

const displayFont = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: 'Gym Manager',
  description: 'Gym management MVP built on Next.js, NestJS and shared domain contracts.',
};

export default async function Layout({
  children,
  params,
}: {
  readonly children: React.ReactNode;
  readonly params: Promise<{locale: string}>;
}): Promise<JSX.Element> {
  // Ensure that the incoming `locale` is valid
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>
        <NextIntlClientProvider>
          <ZodErrorProvider>
            <ToastProvider>
              <ConfirmDialog />
              <ReactQueryProvider>
                <AppShell>{children}</AppShell>
              </ReactQueryProvider>
            </ToastProvider>
          </ZodErrorProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
