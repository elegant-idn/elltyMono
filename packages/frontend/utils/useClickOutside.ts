import React from "react";

export const useClickOutside = (
  ref: any,
  callback: () => unknown,
  ignore?: any
) => {
  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(e.target) &&
        !ignore?.contains(e.target) &&
        !document.querySelector(".modal")
      ) {
        callback();
      }
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [callback, ref, ignore]);
};
