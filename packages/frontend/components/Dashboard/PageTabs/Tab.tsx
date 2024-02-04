import clsx from "clsx";
import React from "react";
import s from "./PageTabs.module.scss";

interface TabProps {
  children: React.ReactNode;
  value: string;
  currentTab: string;
  onClick: () => void;
}

export const Tab: React.FC<TabProps> = ({
  children,
  currentTab,
  value,
  onClick,
}) => {
  return (
    <button
      className={clsx(s.tab, {
        [s.selected]: value === currentTab,
      })}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
