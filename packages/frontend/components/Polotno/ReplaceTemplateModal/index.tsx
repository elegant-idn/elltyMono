import React from "react";
import usePageSizes from "../../../utils/design/usePageSizes";
import { Box, Drawer, Modal } from "@mui/material";
import s from "./ReplaceTemplateModal.module.scss";
import clsx from "clsx";
import BtnSecondary from "../../BtnSecondary";
import BtnPrimary from "../../BtnPrimary";
import { useTranslation } from "next-i18next";

interface ReplaceTemplateModalProps {
  open: boolean;
  onClose: () => unknown;
  onConfirm: () => unknown;
}

export const ReplaceTemplateModal: React.FC<ReplaceTemplateModalProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  const [pageWidth] = usePageSizes();
  const { t } = useTranslation("design", { keyPrefix: "replaceTemplate" });
  const isMobile = pageWidth < 500;

  const content = (
    <div className={s.content}>
      <h2>{t("title")}</h2>
      <p>{t("description")}</p>

      <div className={s.actions}>
        <BtnSecondary onClick={onClose}>{t("cancel")}</BtnSecondary>
        <BtnPrimary onClick={onConfirm}>{t("confirm")}</BtnPrimary>
      </div>
    </div>
  );

  return isMobile ? (
    <Drawer
      anchor={"bottom"}
      onClose={onClose}
      open={open}
      sx={{
        "& .MuiDrawer-paper": {
          bgcolor: "transparent",
          borderRadius: "16px 16px 0 0",
        },
      }}
    >
      <Box className={s.root}>{content}</Box>
    </Drawer>
  ) : (
    <Modal open={open} onClose={onClose} closeAfterTransition>
      <Box className={clsx("modal", s.modalRoot)}>{content}</Box>
    </Modal>
  );
};
