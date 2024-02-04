import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import clsx from "clsx";
import { useTranslation } from "next-i18next";
import React from "react";
import { useDispatch } from "react-redux";
import BtnOutline from "../BtnOutline";
import s from "./ConfirmationModal.module.scss";

interface ConfirmationModalProps {
  isOpen: boolean;
  isLoading?: boolean;
  onClose: any;
  onConfirm?: any;
  count?: number;
}

const ConfirmationModal: React.FC<
  React.PropsWithChildren<ConfirmationModalProps>
> = ({ isOpen, isLoading, onClose, onConfirm, count }) => {
  const { t }: any = useTranslation("adminPage");
  const i18nTemplatesPage = t("templatesPage", { returnObjects: true });
  const dispatch = useDispatch();

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      closeAfterTransition
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Box className={clsx("modal", s.root)}>
        <button className={s.closeBtn} onClick={onClose}></button>

        <div className={s.title}>{i18nTemplatesPage.confirmDelete}</div>
        <div className={s.text}>{t("templatesPage.deleteInfo", { count })}</div>
        <div className={s.btnWrap}>
          <BtnOutline onClick={onClose} variant="blue">
            {i18nTemplatesPage.cancelTemplate}
          </BtnOutline>
          <BtnOutline onClick={onConfirm} variant="red" disabled={isLoading}>
            {i18nTemplatesPage.deleteBtn}
          </BtnOutline>
        </div>
      </Box>
    </Modal>
  );
};

export default ConfirmationModal;
