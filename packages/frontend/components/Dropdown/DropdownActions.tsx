import React from "react";
import s from "./DropdownActions.module.scss";

interface DropdownActionsProps {
  children: React.ReactNode;
}

export const DropdownActions: React.FC<DropdownActionsProps> = ({
  children,
}) => {
  return <div className={s.actions}>{children}</div>;
};
