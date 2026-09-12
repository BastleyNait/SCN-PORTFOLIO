import { useCallback, useEffect, useState } from 'react';

/**
 * The smallest router this site needs: one landing page plus a handful of
 * case-study URLs. vercel.json already rewrites every path to index.html, so
 * a deep link lands here and this hook decides what to render.
 *
 * A routing library would be four times the code and ten times the bytes for
 * a single route shape.
 */
export const CASE_STUDY_PREFIX = '/case-studies/';

export function parseRoute(pathname) {
  if (pathname.startsWith(CASE_STUDY_PREFIX)) {
    const slug = pathname.slice(CASE_STUDY_PREFIX.length).replace(/\/+$/, '');
    if (slug) return { name: 'case-study', slug };
  }
  return { name: 'home' };
}

export function useRoute() {
  const [pathname, setPathname] = useState(() =>
    typeof window === 'undefined' ? '/' : window.location.pathname
  );

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  /* Pushes a new URL without a reload, then puts the reader at the top of the
     new view. Scroll restoration on back is the browser's job, not ours. */
  const navigate = useCallback((to) => {
    if (to === window.location.pathname) return;
    window.history.pushState({}, '', to);
    setPathname(to);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return { route: parseRoute(pathname), navigate };
}
