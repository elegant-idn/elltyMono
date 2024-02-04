import React from "react";

const usePageSizes = () => {
  // window.innerHeight
  const [height, setHeight] = React.useState(
    document.documentElement.clientHeight
  );
  const [width, setWidth] = React.useState(
    document.documentElement.clientWidth
  );

  React.useEffect(() => {
    window.addEventListener("resize", () => {
      setHeight(document.documentElement.clientHeight);
      setWidth(document.documentElement.clientWidth);
    });
  }, []);

  return [width, height];
};

export default usePageSizes;
