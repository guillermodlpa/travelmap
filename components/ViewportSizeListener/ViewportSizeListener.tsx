import { ResponsiveContext } from 'grommet';
import { useContext, useEffect } from 'react';

export default function ViewportSizeListener({
  onSize,
}: {
  onSize: (size: ResponsiveViewportSize) => void;
}) {
  const size = useContext(ResponsiveContext) as ResponsiveViewportSize;
  useEffect(() => {
    onSize(size);
  }, [size, onSize]);
  return null;
}
