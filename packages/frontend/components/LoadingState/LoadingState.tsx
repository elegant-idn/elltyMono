import clsx from "clsx";
import React, { PropsWithChildren } from "react";
import s from "./LoadingState.module.scss";

interface LoadingStateProps {
  isLoading?: boolean;
}

export const LoadingState: React.FC<PropsWithChildren<LoadingStateProps>> = ({
  isLoading,
  children,
}) => {
  return (
    <div
      className={clsx(s.loadingContainer, {
        [s.isLoading]: !!isLoading,
      })}
    >
      {children}
    </div>
  );
};
