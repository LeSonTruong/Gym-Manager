import { type JSX } from "react";
import { renderGymRoute } from "@/components/gym/render-gym-route.tsx";
import { loadGymSnapshot, runWithGymSnapshot } from "@/lib/gym-data.ts";

export const dynamic = "force-dynamic";

export default async function Home(): Promise<JSX.Element> {
  const snapshot = await loadGymSnapshot();

  return runWithGymSnapshot(snapshot, () => renderGymRoute([]));
}
