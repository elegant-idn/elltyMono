import { Box } from "@mui/material";
import React from "react";
import s from "./TitleContainer.module.scss";

interface TitleContainerProps {
  title: React.ReactNode;
  children?: React.ReactNode;
}

export const TitleContainer: React.FC<TitleContainerProps> = ({
  title,
  children,
}) => {
  return (
    <div className={s.frozenContainer}>
      <Box className={s.blockTitle}>{title}</Box>

      {children}
    </div>
  );
};
