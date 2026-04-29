import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-900 text-white">
          <Compass className="h-6 w-6" />
        </div>
        <p className="font-display text-sm font-semibold uppercase tracking-wide text-accent-600">
          404
        </p>
        <h1 className="mt-1 font-display text-3xl font-semibold text-ink-900">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="mt-6 inline-block">
          <Button variant="primary" size="md">
            Back to Directory
          </Button>
        </Link>
      </div>
    </div>
  );
}
