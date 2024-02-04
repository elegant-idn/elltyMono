import { Drawer, Popper, useMediaQuery } from "@mui/material";
import { useTranslation } from "next-i18next";
import React, { useRef, useState } from "react";
import { useClickOutside } from "../../../../../utils/useClickOutside";
import BtnOutline from "../../../../BtnOutline";
import { Checkbox } from "../../../../Checkbox";
import s from "./DeleteImagesPopper.module.scss";
import { DeleteImagePopperContent } from "./Content";

interface DeleteImagesPopperProps {
  anchorElement: any;
  onDelete: () => unknown;
  onClose: () => unknown;
  onCancel?: () => unknown;
}

export const DeleteImagesPopper: React.FC<DeleteImagesPopperProps> = ({
  anchorElement,
  onDelete,
  onClose,
  onCancel,
}) => {
  const ref = useRef(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useClickOutside(ref, onClose, anchorElement);

  const content = (
    <DeleteImagePopperContent
      onCancel={() => {
        onCancel?.();
        onClose();
      }}
      onSubmit={onDelete}
      ref={ref}
    />
  );

  return isMobile ? (
    <Drawer
      anchor="bottom"
      open={!!anchorElement}
      onClose={onClose}
      ref={anchorElement}
      sx={{
        "& .MuiDrawer-paper": {
          bgcolor: "transparent",
          borderRadius: "16px 16px 0 0",
        },
      }}
    >
      {content}
    </Drawer>
  ) : (
    <Popper anchorEl={anchorElement} id="popper" open placement="bottom-start">
      {content}
    </Popper>
  );
};
