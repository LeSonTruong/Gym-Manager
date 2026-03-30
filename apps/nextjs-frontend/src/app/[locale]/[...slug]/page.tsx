import {type JSX} from 'react';
import {renderGymRoute} from '@/components/gym/render-gym-route.tsx';

export default async function GymRoutePage({
  params,
}: {
  readonly params: Promise<{slug: string[]}>;
}): Promise<JSX.Element> {
  const {slug} = await params;

  return renderGymRoute(slug);
}
