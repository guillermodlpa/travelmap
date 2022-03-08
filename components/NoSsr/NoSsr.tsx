import { useEffect, useState } from 'react';

const NoSsr: React.FC = ({ children }) => {
  const [mountedState, setMountedState] = useState(false);

  useEffect(() => {
    setMountedState(true);
  }, []);

  return <>{mountedState ? children : null}</>;
};

export default NoSsr;
