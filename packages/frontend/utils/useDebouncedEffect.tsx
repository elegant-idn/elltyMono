import React from "react";

const useDebouncedEffect = (effect: any, deps: any, delay: number) => {
  React.useEffect(() => {
    const handler = setTimeout(() => effect(), delay);

    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...(deps || []), delay]);
};

export default useDebouncedEffect;
