import { Trans } from '@lingui/react/macro';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/$lang/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <h1>
      <Trans>Hallo!</Trans>
    </h1>
  );
}
