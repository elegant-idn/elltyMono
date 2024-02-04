import React from "react";
import s from "./NotificationIsland.module.scss";
import clsx from "clsx";

interface NotificationIslandProps {
  children: React.ReactNode;
  position?: "fixed" | "relative";
  maxWidth?: number;
}

export const NotificationIsland: React.FC<NotificationIslandProps> = ({
  children,
  position = "fixed",
  maxWidth = 405,
}) => {
  return (
    <div
      className={clsx(s.container, { [s.fixed]: position === "fixed" })}
      style={{ maxWidth }}
    >
      {children}
    </div>
  );
};
