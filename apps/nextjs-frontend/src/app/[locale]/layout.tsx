import { type JSX } from "react";
import type { Metadata } from "next";
import { ConfirmDialog } from "primereact/confirmdialog";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
// eslint-disable-next-line import-x/order
import "./globals.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import { logoutAction } from "./gym-actions.ts";
import { AppShell } from "@/components/app-shell/app-shell.component.tsx";
import { ReactQueryProvider } from "@/providers/react-query/react-query.provider";
import { ToastProvider } from "@/providers/toast/toast.provider";
import { routing } from "@/i18n/routing.ts";
import { ZodErrorProvider } from "@/providers/zod-error/zod-error.provider";
import { getOptionalGymSession } from "@/lib/gym-auth.ts";

export const metadata: Metadata = {
  title: "Gym Manager",
  description: "Professional platform for end-to-end gym operations management.",
};

export default async function Layout({
  children,
  params,
}: {
  readonly children: React.ReactNode;
  readonly params: Promise<{ locale: string }>;
}): Promise<JSX.Element> {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const session = await getOptionalGymSession();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>
          <ZodErrorProvider>
            <ToastProvider>
              <ConfirmDialog />
              <ReactQueryProvider>
                <AppShell
                  locale={locale}
                  currentUserName={session?.user.fullName}
                  currentUserRole={session?.user.role}
                  logoutAction={logoutAction}
                >
                  {children}
                </AppShell>
              </ReactQueryProvider>
            </ToastProvider>
          </ZodErrorProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
