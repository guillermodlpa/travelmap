import { ResponsiveContext } from 'grommet';
import { useContext, useEffect } from 'react';

const ViewportSizeListener: React.FC<{ onSize: (size: ResponsiveViewportSize) => void }> = ({
  onSize,
}) => {
  const size = useContext(ResponsiveContext) as ResponsiveViewportSize;
  useEffect(() => {
    onSize(size);
  }, [size, onSize]);
  return null;
};

export default ViewportSizeListener;
