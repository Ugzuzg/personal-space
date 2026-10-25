import { createFileRoute } from '@tanstack/react-router';

import { readDataFrame } from '~/utils/readDataFrame.functions';

import { Climbing } from './$userId';

export const Route = createFileRoute('/$lang/climbing/')({
  loader: async () => {
    return await readDataFrame({ data: 230474 });
  },
  component: ClimbingIndex,
});

function ClimbingIndex() {
  const { cpr, timeline, bar, completion, completionHistory } = Route.useLoaderData();

  return (
    <Climbing cpr={cpr} timeline={timeline} bar={bar} completion={completion} completionHistory={completionHistory} />
  );
}
