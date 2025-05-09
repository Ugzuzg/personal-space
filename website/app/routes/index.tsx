import { Link, Navigate, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <ul>
        <li>
          <Link to="/$lang" params={{ lang: 'en' }}>
            English
          </Link>
        </li>
        <li>
          <Link to="/$lang" params={{ lang: 'be' }}>
            Беларуская
          </Link>
        </li>
      </ul>
    </>
  );
}
