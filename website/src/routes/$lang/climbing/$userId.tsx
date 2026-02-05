import { createFileRoute } from '@tanstack/react-router';
import { Trans } from '@lingui/react/macro';

import { Bar } from '~/components/Bar';
import { Completion } from '~/components/Completion';
import { Cpr } from '~/components/Cpr';
import { Timeline } from '~/components/Timeline';
import { readDataFrame } from '~/utils/readDataFrame.functions';

export const Route = createFileRoute('/$lang/climbing/$userId')({
  loader: async (options) => {
    return await readDataFrame({ data: +options.params.userId });
  },
  component: RouteClimbing,
});

export function Climbing({
  cpr,
  timeline,
  bar,
  completion,
}: {
  cpr: any;
  timeline: any;
  bar: any;
  completion: any;
}) {
  return (
    <section>
      <h1>
        <Trans>Climbing</Trans>
      </h1>
      <Completion data={completion} />
      <Cpr data={cpr} />
      <Timeline data={timeline} />
      <Bar data={bar} />
    </section>
  );
}

function RouteClimbing() {
  const { cpr, timeline, bar, completion } = Route.useLoaderData();

  return (
    <Climbing cpr={cpr} timeline={timeline} bar={bar} completion={completion} />
  );
}
