import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function scrollPageToTop(behavior: ScrollBehavior = 'auto') {
  window.scrollTo({ top: 0, left: 0, behavior });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

/** Scrolls to the top whenever the public-site route changes. */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    scrollPageToTop('auto');
  }, [pathname]);

  return null;
}
