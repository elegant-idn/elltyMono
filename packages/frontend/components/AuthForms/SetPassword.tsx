import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import axios from "axios";
import clsx from "clsx";
import { Formik } from "formik";
import { useTranslation } from "next-i18next";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { Api } from "../../api";
import { ChangeAuthFormAction } from "../../redux/actions";
import { RootState } from "../../redux/store";
import BtnPrimary from "../BtnPrimary";
import { InputPassword } from "../Inputs";
import s from "./Forms.module.scss";

interface FormProps {
  menu?: boolean;
}

const RegisterCode: React.FC<React.PropsWithChildren<FormProps>> = ({
  menu,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.mainReducer.user);
  const [error, setError] = React.useState<string>("");

  const { t }: any = useTranslation("AuthModal");
  const newPasswordLocal = t("newPassword", { returnObjects: true });
  const i18nErrors = t("errors", { returnObjects: true });

  return (
    <div className={clsx(menu && s.menu)}>
      <Formik
        initialValues={{
          password: "",
          confirmPassword: "",
        }}
        validationSchema={Yup.object({
          password: Yup.string()
            .min(4, t("errors.passwordMustBe", { count: 4 }))
            .max(25, t("errors.charactersOrLess", { count: 25 }))
            .required(i18nErrors.required),
          // .matches(
          //   "^(?=.*[A-Za-z])(?=.*d)(?=.*[@$!%*#?&])[A-Za-zd@$!%*#?&]{8,}$",
          //   "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
          // ),
          confirmPassword: Yup.string()
            .required(i18nErrors.required)
            .oneOf([Yup.ref("password"), null], i18nErrors.passwordsMustMatch),
        })}
        onSubmit={(values, actions) => {
          const body = JSON.stringify({
            email: user.email,
            password: values.password,
          });

          Api.post("/auth/password/change", body)
            .then((result) => {
              // request<User>({method: 'POST', url: '/auth/password/change', data: JSON.stringify(body)}).then(result => {
              if (result.status === 200) {
                // console.log(result);
                // dispatch(SetUser({
                //   email: result.data.email,
                //   status: result.data.status,
                //   role: result.data.role,
                // }))
                dispatch(ChangeAuthFormAction("passwordReset"));
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
                {newPasswordLocal.title}
              </Box>

              {error && <div className={s.formError}>{error}</div>}

              <Box
                className={s.formSubtitle}
                sx={{
                  fontSize: ".75rem",
                  marginBottom: "20px",
                }}
              >
                {newPasswordLocal.text}
              </Box>

              <InputPassword
                name="password"
                label={`${newPasswordLocal.newPass}`}
                type="password"
                placeholder={`${newPasswordLocal.newPassPlaceHold}`}
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                errors={props.errors.password}
                touched={props.touched.password}
                value={props.values.password}
              />

              <InputPassword
                name="confirmPassword"
                label={`${newPasswordLocal.newPassConfirm}`}
                type="password"
                placeholder={`${newPasswordLocal.newPassConfirmPlaceHold}`}
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                errors={props.errors.confirmPassword}
                touched={props.touched.confirmPassword}
                value={props.values.confirmPassword}
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
                  {newPasswordLocal.btn}
                </BtnPrimary>
              </Box>

              <Box
                className={s.bottomLink}
                sx={{ fontSize: ".75rem", textAlign: "center" }}
              >
                {newPasswordLocal.tipText}
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
                  {newPasswordLocal.tipLink}
                </Typography>
              </Box>
            </Box>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default RegisterCode;
