import { useState } from "react";
import { useIsMac } from "./useIsMac";

let persistedIsMacValue = false;
export const useIsMacValue = () => {
  const [isMac, setIsMac] = useState(persistedIsMacValue);

  useIsMac((newIsMac) => {
    persistedIsMacValue = newIsMac;
    setIsMac(newIsMac);
  });

  return isMac;
};
