import { useState, useCallback } from 'react';

// Type definition for the callback function
type DebouncedFunction<T extends (...args: any[]) => void> = (...args: Parameters<T>) => void;

const useDebounce = <T extends (...args: any[]) => void>(callback: T, delay: number) => {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const debouncedFunction = useCallback<DebouncedFunction<T>>(
    (...args) => {
      if (timeoutId) clearTimeout(timeoutId); // Clear previous timeout

      const id = setTimeout(() => {
        callback(...args); // Call the function after the delay
      }, delay);

      setTimeoutId(id); // Store the timeout ID
    },
    [timeoutId, callback, delay] // Dependencies for useCallback
  );

  return debouncedFunction;
};

export default useDebounce;
