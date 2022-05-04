import { useEffect, useState } from 'react';

export default function useCanHoverWithEase(): boolean {
  const [canHoverWithEase, setCanHoverWithEase] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCanHoverWithEase(
        typeof window.matchMedia === 'undefined' || window.matchMedia('(hover: hover)').matches
      );
    }
  }, []);

  return canHoverWithEase;
}
