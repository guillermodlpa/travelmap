import { useEffect, useState } from 'react';

export default function NoSsr({ children }: { children: React.ReactNode }) {
  const [mountedState, setMountedState] = useState(false);

  useEffect(() => {
    setMountedState(true);
  }, []);

  return <>{mountedState ? children : null}</>;
}
