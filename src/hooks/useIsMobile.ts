import { useState, useEffect } from 'react';

const useIsMobile = (breakpoint = '(max-width: 768px)') => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(breakpoint);
    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    // Initial check
    setIsMobile(mediaQuery.matches);

    // Listen for changes
    mediaQuery.addEventListener('change', handleMediaQueryChange);

    // Clean up
    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, [breakpoint]);

  return isMobile;
};

export default useIsMobile;