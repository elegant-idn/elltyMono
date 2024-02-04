import { useEffect } from "react";

export const useWindowEvent = (
  event: Parameters<typeof window.addEventListener>[0],
  callback: () => unknown
) => {
  useEffect(() => {
    window.addEventListener(event, callback);

    return () => {
      window.removeEventListener(event, callback);
    };
  }, [callback, event]);
};
