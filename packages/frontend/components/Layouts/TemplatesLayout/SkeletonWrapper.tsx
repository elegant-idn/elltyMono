import React from "react";

type SkeletonWrapperProps = {
  children: JSX.Element;
  containerClassName: string;
  placeholder: JSX.Element;
};

function SkeletonWrapper({
  children,
  containerClassName,
  placeholder,
}: SkeletonWrapperProps) {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <div className={containerClassName}>
      {isLoading && placeholder}
      {!isLoading && children}
    </div>
  );
}

export default SkeletonWrapper;
