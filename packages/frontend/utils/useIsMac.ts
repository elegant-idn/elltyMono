import React from "react";
import { getIsMac } from "./getIsMac";

export const useIsMac = (callback: (isMac: boolean) => void) => {
  React.useEffect(() => {
    callback(getIsMac());
  }, [callback]);
};
