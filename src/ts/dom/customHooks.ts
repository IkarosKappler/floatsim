import { useEffect, useRef, useState } from "preact/hooks";

export const useInterval = (callback: () => void, delay: number) => {
  const savedCallback = useRef<Function>();
  const [clearRequested, setClearRequested] = useState<boolean>(false);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    let id = setInterval(() => {
      savedCallback.current();
    }, delay);
    if (clearRequested) {
      clearInterval(id);
    }
    return () => clearInterval(id);
  }, [clearRequested, delay]);

  // Set up the cancel-requester
  const requestClear = () => {
    setClearRequested(true);
  };

  return requestClear;
};
