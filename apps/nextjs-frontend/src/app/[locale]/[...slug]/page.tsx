import { type JSX } from "react";
import { redirect } from "next/navigation";
import { renderGymRoute } from "@/components/gym/render-gym-route.tsx";
import {
  loadGymSnapshot,
  loadMyAttendance,
  loadMyPayroll,
  runWithGymSnapshot,
} from "@/lib/gym-data.ts";
import {
  getOptionalGymSession,
  requireGymSession,
  runWithGymSession,
} from "@/lib/gym-auth.ts";

export const dynamic = "force-dynamic";

export default async function GymRoutePage({
  params,
  searchParams,
}: {
  readonly params: Promise<{ locale: string; slug: string[] }>;
  readonly searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<JSX.Element> {
  const { slug, locale } = await params;
  const resolvedSearchParams = await searchParams;

  if (slug[0] === "login") {
    const session = await getOptionalGymSession();

    if (session) {
      redirect(
        session.user.role === "PT"
          ? `/${locale}/pts/attendance`
          : `/${locale}/dashboard`,
      );
    }

    return renderGymRoute(slug, {
      locale,
      searchParams: resolvedSearchParams,
    });
  }

  const session = await requireGymSession(locale);

  if (session.user.role === "PT") {
    if (slug[0] === "pts" && slug[1] === "attendance") {
      const attendance = await loadMyAttendance(session.accessToken);

      return runWithGymSession(session, () =>
        renderGymRoute(slug, {
          locale,
          currentUser: session.user,
          searchParams: resolvedSearchParams,
          ptAttendance: attendance,
        }),
      );
    }

    if (slug[0] === "payroll" && slug.length === 1) {
      const payrollEntries = await loadMyPayroll(session.accessToken);

      return runWithGymSession(session, () =>
        renderGymRoute(slug, {
          locale,
          currentUser: session.user,
          searchParams: resolvedSearchParams,
          ptPayrollEntries: payrollEntries,
        }),
      );
    }

    redirect(`/${locale}/pts/attendance`);
  }

  const snapshot = await loadGymSnapshot(session.accessToken);

  return runWithGymSession(
    session,
    () =>
      runWithGymSnapshot(snapshot, () =>
        renderGymRoute(slug, {
          locale,
          currentUser: session.user,
          searchParams: resolvedSearchParams,
        }),
      ),
  );
}
