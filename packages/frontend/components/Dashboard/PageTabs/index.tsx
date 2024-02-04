import React from "react";
import s from "./PageTabs.module.scss";
import { Box } from "@mui/material";

interface PageTabsProps {
  children: React.ReactNode;
}

export const PageTabs: React.FC<PageTabsProps> = ({ children }) => {
  return (
    <div className={s.rowControls}>
      <Box className={s.tabs}>{children}</Box>
    </div>
  );
};
