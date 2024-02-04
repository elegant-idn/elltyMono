import clsx from "clsx";
import React from "react";
import s from "./AuthModal.module.scss";

import { useDispatch, useSelector } from "react-redux";
import { ToggleAuthModalAction } from "../../redux/actions";
import { RootState } from "../../redux/store";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import EmailCode from "../AuthForms/EmailCode";
import ForgotPassword from "../AuthForms/ForgotPassword";
import LoginForm from "../AuthForms/Login";
import PasswordReset from "../AuthForms/PasswordReset";
import RegisterForm from "../AuthForms/Register";
import RegisterCode from "../AuthForms/RegisterCode";
import SetPassword from "../AuthForms/SetPassword";

interface AuthModalProps {}

const AuthModal: React.FC<React.PropsWithChildren<AuthModalProps>> = () => {
  const dispatch = useDispatch();
  const modalOpen = useSelector(
    (state: RootState) => state.mainReducer.openAuthModal
  );
  const formOpen = useSelector(
    (state: RootState) => state.mainReducer.authForm
  );
  // const {t}: any = useTranslation("AuthModal")
  // const variable = t("test",{returnObjects: true})
  // console.log(variable)
  const form = () => {
    switch (formOpen) {
      case "logIn":
        return <LoginForm />;
      case "signUp":
        return <RegisterForm />;
      case "registerCode":
        return <RegisterCode />;
      case "forgotPassword":
        return <ForgotPassword />;
      case "emailCode":
        return <EmailCode />;
      case "setPassword":
        return <SetPassword />;
      case "passwordReset":
        return <PasswordReset />;
      default:
        return <LoginForm />;
    }
  };

  return (
    <Modal
      open={modalOpen}
      onClose={() => {
        dispatch(ToggleAuthModalAction(null));
      }}
      closeAfterTransition
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Box className={clsx("modal", s.root)}>
        <button
          className={s.closeBtn}
          onClick={() => {
            dispatch(ToggleAuthModalAction(null));
          }}
        />
        {form()}
      </Box>
    </Modal>
  );
};

export default AuthModal;
