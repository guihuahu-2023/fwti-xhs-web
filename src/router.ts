import { createSignal } from 'solid-js';

function normalizeRoute(value: string): string {
  const raw = value.trim().replace(/^#/, '');
  if (!raw || raw === '/') return '/';
  return raw.startsWith('/') ? raw : `/${raw}`;
}

function readRoute(): string {
  if (typeof window === 'undefined') return '/';
  return normalizeRoute(window.location.hash);
}

const [routePath, setRoutePath] = createSignal(readRoute());

export function currentRoute() {
  return routePath;
}

export function startRouter(): () => void {
  if (typeof window === 'undefined') return () => undefined;
  const handleHashChange = () => {
    setRoutePath(readRoute());
    window.scrollTo({ top: 0, behavior: 'instant' });
  };
  window.addEventListener('hashchange', handleHashChange);
  handleHashChange();
  return () => window.removeEventListener('hashchange', handleHashChange);
}

export function navigate(path: string, options?: { replace?: boolean }): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  const route = normalizeRoute(path);
  const target = `#${route}`;
  if (options?.replace) {
    window.history.replaceState(null, '', target);
    setRoutePath(route);
    window.scrollTo({ top: 0, behavior: 'instant' });
  } else if (window.location.hash === target) {
    setRoutePath(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    window.location.hash = route;
  }
  return Promise.resolve();
}
