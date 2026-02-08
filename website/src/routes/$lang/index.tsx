import { createFileRoute } from '@tanstack/react-router';
import { Trans } from '@lingui/react/macro';

export const Route = createFileRoute('/$lang/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <h1>
      <Trans>Hallo!</Trans>
      test
    </h1>
  );
}
