import s from "./Forms.module.scss";
import clsx from "clsx";
import { useDispatch } from "react-redux";
import {
  ChangeAuthFormAction,
  ToggleAuthModalAction,
  ToggleMenuAction,
} from "../../redux/actions";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import BtnPrimary from "../BtnPrimary";
import { useTranslation } from "next-i18next";

interface FormProps {
  menu?: boolean;
}

const PasswordReset: React.FC<React.PropsWithChildren<FormProps>> = ({
  menu,
}) => {
  const dispatch = useDispatch();

  const { t }: any = useTranslation("AuthModal");
  const resetSuccessfulLocal = t("resetSuccessful", { returnObjects: true });

  return (
    <div className={clsx(menu && s.menu, s.passwordResetForm)}>
      <Box className={s.form}>
        <Box></Box>
        <Box>
          <Box
            sx={{
              marginBottom: "24px",
              img: {
                display: "block",
                width: "80px",
                margin: "0 auto",
              },
            }}
          >
            <img className={s.checkSvg} src="/auth/password-reset.svg" />
          </Box>
          <Box
            className={s.formTitle}
            sx={{
              fontSize: "1.125rem",
              fontWeight: "var(--bold-text)",
              textAlign: "center",
              marginBottom: "10px",
            }}
          >
            {resetSuccessfulLocal.title}
          </Box>
          <Box
            className={s.formSubtitle}
            sx={{
              fontSize: ".75rem",
              textAlign: "center",
              marginBottom: "10px",
            }}
          >
            {resetSuccessfulLocal.text}
          </Box>
        </Box>

        <Box className={s.bottom}>
          <Box
            className={s.submitBtn}
            sx={{
              marginBottom: "20px",
              button: {
                fontSize: ".875rem",
                width: "100%",
              },
            }}
          >
            <BtnPrimary
              onClick={() => {
                menu
                  ? dispatch(ToggleMenuAction(null))
                  : dispatch(ToggleAuthModalAction(null));
              }}
            >
              {resetSuccessfulLocal.btn}
            </BtnPrimary>
          </Box>

          <Box
            className={s.bottomLink}
            sx={{ fontSize: ".75rem", textAlign: "center" }}
          >
            {resetSuccessfulLocal.tipText}
            {/* @ts-ignore */}
            <Typography
              onClick={() => {
                dispatch(ChangeAuthFormAction("logIn"));
              }}
              as="span"
              sx={{
                fontSize: ".75rem",
                color: "var(--blue-color)",
                cursor: "pointer",
                "&:hover": {
                  color: "var(--darkblue-color)",
                },
              }}
            >
              {" "}
              {resetSuccessfulLocal.tipLink}
            </Typography>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default PasswordReset;
