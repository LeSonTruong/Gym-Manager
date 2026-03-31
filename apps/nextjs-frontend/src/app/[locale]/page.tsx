import { type JSX } from "react";
import { redirect } from "next/navigation";
import { renderGymRoute } from "@/components/gym/render-gym-route.tsx";
import { loadGymSnapshot, runWithGymSnapshot } from "@/lib/gym-data.ts";
import { requireGymSession, runWithGymSession } from "@/lib/gym-auth.ts";

export const dynamic = "force-dynamic";

export default async function Home({
  params,
}: {
  readonly params: Promise<{ locale: string }>;
}): Promise<JSX.Element> {
  const { locale } = await params;
  const session = await requireGymSession(locale);

  if (session.user.role === "PT") {
    redirect(`/${locale}/pts/attendance`);
  }

  const snapshot = await loadGymSnapshot(session.accessToken);

  return runWithGymSession(
    session,
    () =>
      runWithGymSnapshot(snapshot, () =>
        renderGymRoute([], { locale, currentUser: session.user }),
      ),
  );
}
