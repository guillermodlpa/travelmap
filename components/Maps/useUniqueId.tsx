import { useRef } from 'react';

const getIncrementalId = (() => {
  let lastId = 0;
  return () => {
    lastId = lastId + 1;
    return lastId;
  };
})();

const useUniqueId = (prefix = '') => {
  const idRef = useRef<string>();
  if (idRef.current === undefined) {
    idRef.current = `${prefix}${getIncrementalId()}`;
  }
  return idRef.current;
};

export default useUniqueId;
