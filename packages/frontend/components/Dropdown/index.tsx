import { Popper, SwipeableDrawer, useMediaQuery } from "@mui/material";
import React from "react";
import s from "./Dropdown.module.scss";

import clsx from "clsx";

interface DropdownProps {
  popperRef: any;
  anchor: any;
  onClose: () => unknown;
  children: React.ReactNode;
  minHeight?: number;
}

const Dropdown: React.FC<DropdownProps> = ({
  anchor,
  popperRef,
  onClose,
  children,
  minHeight = 512,
}) => {
  const isMobile = useMediaQuery("(max-width: 1000px)");

  if (isMobile) {
    return (
      <SwipeableDrawer
        onClose={onClose}
        open={!!anchor}
        onOpen={() => {}}
        classes={{
          paper: "drawerPaper",
        }}
        PaperProps={{
          style: { minHeight },
        }}
        anchor="bottom"
      >
        {children}
      </SwipeableDrawer>
    );
  }

  return (
    <Popper
      id="popper"
      ref={popperRef}
      open={!!anchor}
      anchorEl={anchor}
      className={s.popper}
      placement="bottom-start"
      popperOptions={{
        modifiers: [
          {
            name: "flip",
            enabled: true,
            options: {
              fallbackPlacements: ["bottom-end"],
            },
          },
        ],
      }}
    >
      {children}
    </Popper>
  );
};

export default Dropdown;
