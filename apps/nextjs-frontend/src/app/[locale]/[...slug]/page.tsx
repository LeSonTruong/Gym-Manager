import { type JSX } from "react";
import { renderGymRoute } from "@/components/gym/render-gym-route.tsx";
import { loadGymSnapshot, runWithGymSnapshot } from "@/lib/gym-data.ts";

export const dynamic = "force-dynamic";

export default async function GymRoutePage({
  params,
}: {
  readonly params: Promise<{ slug: string[] }>;
}): Promise<JSX.Element> {
  const [{ slug }, snapshot] = await Promise.all([params, loadGymSnapshot()]);

  return runWithGymSnapshot(snapshot, () => renderGymRoute(slug));
}
