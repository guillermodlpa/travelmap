import { ResponsiveContext } from 'grommet';
import { useContext, useEffect } from 'react';

const ViewportSizeListener: React.FC<{ onSize: (size: string) => void }> = ({ onSize }) => {
  const size = useContext(ResponsiveContext);
  useEffect(() => {
    onSize(size);
  }, [size, onSize]);
  return null;
};

export default ViewportSizeListener;
