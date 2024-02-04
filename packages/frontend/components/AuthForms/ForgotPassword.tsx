import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import axios from "axios";
import clsx from "clsx";
import { Formik } from "formik";
import { useTranslation } from "next-i18next";
import React from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { Api } from "../../api";
import { ChangeAuthFormAction, SetUser } from "../../redux/actions";
import BtnPrimary from "../BtnPrimary";
import { InputText } from "../Inputs";
import s from "./Forms.module.scss";

interface FormProps {
  menu?: boolean;
}

const ForgotPassword: React.FC<React.PropsWithChildren<FormProps>> = ({
  menu,
}) => {
  const dispatch = useDispatch();
  const [error, setError] = React.useState<string>("");

  const { t }: any = useTranslation("AuthModal");
  const forgotLocal = t("forgotPass", { returnObjects: true });
  const i18nErrors = t("errors", { returnObjects: true });

  return (
    <div className={clsx(menu && s.menu)}>
      <Formik
        initialValues={{
          email: "",
        }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email(i18nErrors.invalidEmail)
            .required(i18nErrors.required),
        })}
        onSubmit={(values, actions) => {
          const body = {
            email: values.email,
          };
          Api.post("/auth/resetPassword", JSON.stringify(body))
            .then((result) => {
              if (result.status === 200) {
                // console.log(result);
                dispatch(SetUser({ email: values.email }));
                dispatch(ChangeAuthFormAction("emailCode"));
              }
            })
            .catch((reason) => {
              if (axios.isAxiosError(reason)) {
                // console.log(reason?.response?.data.message);

                reason?.response?.data.message
                  ? setError(reason?.response?.data.message)
                  : setError(i18nErrors.somethingWrong);
              }
            })
            .finally(() => {
              actions.setSubmitting(false);
            });
        }}
      >
        {(props) => (
          <form onSubmit={props.handleSubmit} className={s.form}>
            <Box>
              <Box
                className={s.formTitle}
                sx={{
                  fontSize: "1.125rem",
                  fontWeight: "var(--bold-text)",
                  marginBottom: "10px",
                }}
              >
                {forgotLocal.title}
              </Box>

              {error && <div className={s.formError}>{error}</div>}

              <Box
                className={s.formSubtitle}
                sx={{
                  fontSize: ".75rem",
                  marginBottom: "20px",
                }}
              >
                {forgotLocal.text}
              </Box>

              <InputText
                name="email"
                label={`${forgotLocal.input}`}
                type="text"
                placeholder={`${forgotLocal.inputPlaceHold}`}
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                errors={props.errors.email}
                touched={props.touched.email}
                value={props.values.email}
              />
            </Box>

            <Box className={s.bottom}>
              <Box
                className={s.submitBtn}
                sx={{
                  marginBottom: "20px",
                  marginTop: "20px",
                  button: {
                    fontSize: ".875rem",
                    width: "100%",
                  },
                }}
              >
                <BtnPrimary loading={props.isSubmitting}>
                  {forgotLocal.btn}
                </BtnPrimary>
              </Box>

              <Box
                className={s.bottomLink}
                sx={{ fontSize: ".75rem", textAlign: "center" }}
              >
                {forgotLocal.tipText}
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
                  {forgotLocal.tipLink}
                </Typography>
              </Box>
            </Box>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default ForgotPassword;
