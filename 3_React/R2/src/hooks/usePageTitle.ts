import { useEffect } from 'react';

/**
 * Sets document.title dynamically for each page.
 * Restores the default app name on unmount.
 */
export const usePageTitle = (title: string): void => {
  const appName = 'R2ANTI';
  useEffect(() => {
    document.title = title ? `${title} — ${appName}` : appName;
    return () => {
      document.title = appName;
    };
  }, [title]);
};
