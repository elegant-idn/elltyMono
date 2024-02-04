import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import axios from "axios";
import clsx from "clsx";
import { Formik } from "formik";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React from "react";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { Api } from "../../api";
import {
  ChangeAuthFormAction,
  SetUser,
  ToggleAuthModalAction,
} from "../../redux/actions";
import { User } from "../../types";
import { useTemporaryUserToken } from "../../utils/useTemporaryUserToken";
import BtnPrimary from "../BtnPrimary";
import { InputPassword, InputText } from "../Inputs";
import Link from "../Link";
import s from "./Forms.module.scss";
import Socials from "./Socials";

interface FormProps {
  menu?: boolean;
}

const RegisterForm: React.FC<React.PropsWithChildren<FormProps>> = ({
  menu,
}) => {
  const dispatch = useDispatch();
  const [error, setError] = React.useState<string>("");
  const { t } = useTranslation(["AuthModal", "Checkout"]);
  const registerLocal: Record<string, string> = t("register", {
    returnObjects: true,
  });
  const i18nErrors: Record<string, string> = t("errors", {
    returnObjects: true,
  });
  const router = useRouter();
  const [cookie] = useCookies();
  const temporaryUserToken = useTemporaryUserToken(undefined);

  const checkoutI18n: Record<string, string> = t("form.policy", {
    returnObjects: true,
    ns: "Checkout",
  });

  return (
    <div className={clsx(menu && s.menu)}>
      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
        }}
        validationSchema={Yup.object({
          name: Yup.string()
            .max(15, t("errors.charactersOrLess", { count: 15 }))
            .required(i18nErrors.required),
          email: Yup.string()
            .email(i18nErrors.invalidEmail)
            .required(i18nErrors.required),
          password: Yup.string()
            .min(4, t("errors.passwordMustBe", { count: 4 }))
            .max(25, t("errors.charactersOrLess", { count: 25 }))
            .required(i18nErrors.required),
        })}
        onSubmit={(values, actions) => {
          const body = JSON.stringify({
            firstName: values.name,
            email: values.email,
            password: values.password,
            language: cookie.locale,
            temporaryUserToken,
          });

          Api.post<User>("/auth/signup", body)
            .then((result) => {
              // console.log(result);
              if (result.data.message == "Not a valid email") {
                setError(i18nErrors.invalidEmail);
                return;
              }
              if (result.data.message == "Email already used") {
                dispatch(ChangeAuthFormAction("registerCode"));
                dispatch(
                  SetUser({
                    email: values.email,
                  })
                );
                return;
              }
              if (result.data.message == "Email already confirmed") {
                dispatch(ChangeAuthFormAction("logIn"));
                dispatch(
                  SetUser({
                    email: values.email,
                  })
                );
                return;
              }
              if (result.status === 201) {
                dispatch(
                  SetUser({
                    email: result.data.email,
                    // status: result.data.status,
                    // role: result.data.role,
                  })
                );
                dispatch(ChangeAuthFormAction("registerCode"));
              }
            })
            .catch((reason) => {
              if (axios.isAxiosError(reason)) {
                console.log(reason?.response);
                // console.log(reason?.response?.data.message);
              }
              reason?.response?.data.message
                ? setError(reason?.response?.data.message)
                : setError(i18nErrors.somethingWrong);
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
                  marginBottom: "20px",
                }}
              >
                {registerLocal.title}
              </Box>

              {error && <div className={s.formError}>{error}</div>}

              <InputText
                name="name"
                label={`${registerLocal.name}`}
                type="text"
                placeholder={`${registerLocal.namePlaceHold}`}
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                errors={props.errors.name}
                touched={props.touched.name}
                value={props.values.name}
              />
              <InputText
                name="email"
                label={`${registerLocal.email}`}
                type="text"
                placeholder={`${registerLocal.emailPlaceHold}`}
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                errors={props.errors.email}
                touched={props.touched.email}
                value={props.values.email}
              />
              <InputPassword
                name="password"
                label={`${registerLocal.pass}`}
                type="password"
                placeholder={`${registerLocal.passPlaceHold}`}
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                errors={props.errors.password}
                touched={props.touched.password}
                value={props.values.password}
              />
              {/* <div>By continuing, you agree to Ellty's Terms of Use and Privacy Policy.</div> */}
              <div className={s.policy}>
                {checkoutI18n.text}{" "}
                <Link
                  href="/policy/terms-of-use"
                  onClick={() => {
                    dispatch(ToggleAuthModalAction(null));
                  }}
                >
                  {checkoutI18n.link1}
                </Link>{" "}
                {checkoutI18n.separator}{" "}
                <Link
                  href="/policy/privacy-policy"
                  onClick={() => {
                    dispatch(ToggleAuthModalAction(null));
                  }}
                >
                  {checkoutI18n.link2}
                </Link>
                .
              </div>
            </Box>

            <Box className={s.bottom}>
              <Box
                className={s.submitBtn}
                sx={{
                  marginBottom: "10px",
                  button: {
                    fontSize: ".875rem",
                    width: "100%",
                  },
                }}
              >
                <BtnPrimary loading={props.isSubmitting}>
                  {registerLocal.btn}
                </BtnPrimary>
              </Box>

              <Socials locale={router.locale} dividerLabel={registerLocal.or} />

              <Box className={s.bottomLink} sx={{ fontSize: ".75rem" }}>
                {registerLocal.tipText}
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
                  {registerLocal.tipLink}
                </Typography>
              </Box>
            </Box>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default RegisterForm;
