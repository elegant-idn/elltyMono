import React from "react";
import Router, { useRouter } from "next/router";
import s from "./Forms.module.scss";
import clsx from "clsx";
import { Formik } from "formik";
import * as Yup from "yup";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  ChangeAuthFormAction,
  SetUser,
  ToggleAuthModalAction,
  ToggleMenuAction,
} from "../../redux/actions";
import { RootState } from "../../redux/store";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { InputText, InputPassword, InputCheckbox } from "../Inputs";
import BtnPrimary from "../BtnPrimary";
import Socials from "./Socials";
import { Api, request } from "../../api";
import gaEvent from "../../utils/gaEvent";
import { useTranslation } from "next-i18next";
import { User } from "../../types";
import { useTemporaryUserToken } from "../../utils/useTemporaryUserToken";

interface LoginFormProps {
  menu?: boolean;
}

const LoginForm: React.FC<React.PropsWithChildren<LoginFormProps>> = ({
  menu,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.mainReducer.user);
  const afterAuthAction = useSelector(
    (state: RootState) => state.mainReducer.afterAuthAction
  );

  const [_, setCookie] = useCookies();
  const [error, setError] = React.useState<string>("");
  const router = useRouter();
  const temporaryUserToken = useTemporaryUserToken(undefined);

  const { t }: any = useTranslation("AuthModal");
  const loginLocal = t("login", { returnObjects: true });
  const i18nErrors = t("errors", { returnObjects: true });

  return (
    <div className={clsx(menu && s.menu)}>
      <Formik
        initialValues={{
          email: user?.email ? String(user.email) : "",
          password: "",
          acceptedTerms: true,
        }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email(i18nErrors.invalidEmail)
            .required(i18nErrors.required),
          password: Yup.string()
            .min(4, t("errors.passwordMustBe", { count: 4 }))
            .max(25, t("errors.charactersOrLess", { count: 25 }))
            .required(i18nErrors.required),
          // acceptedTerms: Yup.boolean()
          //   .required("Required")
          //   .oneOf([true], "You must accept the terms and conditions."),
        })}
        onSubmit={(values, actions) => {
          setError("");

          const body = {
            email: values.email,
            password: values.password,
            temporaryUserToken,
          };

          Api.post<User>("/auth/signin", JSON.stringify(body))
            .then((result) => {
              // console.log();
              if (result.status === 200) {
                const { accessToken, ...userData } = result.data;
                // console.log(result);

                switch (userData.status) {
                  case "active": {
                    // console.log(result.data);
                    const user = {
                      accessToken: `Bearer ${accessToken}`,
                      ...userData,
                    };

                    try {
                      const gaCallback = () => {
                        setCookie("user", user, {
                          path: "/",
                          expires: new Date(userData.expiresIn),
                        });

                        menu
                          ? dispatch(ToggleMenuAction(null))
                          : dispatch(ToggleAuthModalAction(null));
                        Router.reload();
                      };

                      dispatch(SetUser(userData));
                      gaEvent("finish_log_in");

                      setCookie("user_token", `Bearer ${accessToken}`, {
                        path: "/",
                        expires: new Date(userData.expiresIn),
                      });

                      setCookie("user", user, {
                        path: "/",
                        expires: new Date(userData.expiresIn),
                      });

                      const reloadAfterRouteChange =
                        afterAuthAction && afterAuthAction();

                      if (reloadAfterRouteChange) {
                        Router.events.on("routeChangeComplete", () => {
                          Router.reload();
                        });
                      } else {
                        Router.reload();
                      }

                      if (menu) {
                        dispatch(ToggleMenuAction(null));
                      } else {
                        dispatch(ToggleAuthModalAction(null));
                      }
                      // menu ? dispatch(ToggleMenuAction(null)) : dispatch(ToggleAuthModalAction(null))
                    } catch (e) {
                      console.log(e);
                    }

                    return;
                  }

                  case "deleted": {
                    // dispatch(SetUser({
                    //   email: result.data.email,
                    //   status: result.data.status,
                    //   role: result.data.role,
                    // }))
                    // dispatch(ChangeAuthFormAction('emailCode'));
                    setError("This account has been deleted");
                    return;
                  }

                  case "notActive": {
                    // dispatch(SetUser({
                    //   email: result.data.email,
                    //   status: result.data.status,
                    //   role: result.data.role,
                    // }))
                    dispatch(ChangeAuthFormAction("registerCode"));
                    return;
                  }

                  default: {
                    // console.log(result.data.status);
                  }
                }
                // Error if the user is not in the database
                setError(result.data.message);
              }
            })
            .catch((reason) => {
              if (axios.isAxiosError(reason)) {
                console.log(reason);
                // alert(reason)
                reason?.response?.data.message
                  ? // Error if the user is in the database, but the password is entered incorrectly
                    setError(reason?.response?.data.message)
                  : setError(i18nErrors.somethingWrong);
              }
            })
            .finally(() => {
              actions.setSubmitting(false);
            });
        }}
      >
        {(props) => (
          <form onSubmit={props.handleSubmit} className={clsx(s.form)}>
            <Box>
              <Box
                className={s.formTitle}
                sx={{
                  fontSize: "1.125rem",
                  fontWeight: "var(--bold-text)",
                  marginBottom: "20px",
                }}
              >
                {loginLocal.title}
              </Box>

              {error && <div className={s.formError}>{error}</div>}

              <InputText
                name="email"
                label={`${loginLocal.email}`}
                type="text"
                placeholder={`${loginLocal.emailPlaceHold}`}
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                errors={props.errors.email}
                touched={props.touched.email}
                value={props.values.email}
              />
              <InputPassword
                name="password"
                label={`${loginLocal.pass}`}
                type="password"
                placeholder={`${loginLocal.passPlaceHold}`}
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                errors={props.errors.password}
                touched={props.touched.password}
                value={props.values.password}
              />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "20px",
                }}
              >
                <InputCheckbox
                  name="acceptedTerms"
                  label={`${loginLocal.remember}`}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  errors={props.errors.acceptedTerms}
                  touched={props.touched.acceptedTerms}
                  value={props.values.acceptedTerms}
                  checked={props.values.acceptedTerms}
                  variant="gray"
                />

                {/* @ts-ignore */}
                <Typography
                  onClick={() => {
                    dispatch(ChangeAuthFormAction("forgotPassword"));
                  }}
                  as="span"
                  sx={{
                    fontSize: ".75rem",
                    lineHeight: ".75rem",
                    color: "var(--blue-color)",
                    cursor: "pointer",
                    "&:hover": {
                      color: "var(--darkblue-color)",
                    },
                  }}
                >
                  {" "}
                  {loginLocal.forgot}
                </Typography>
              </Box>
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
                  {loginLocal.btn}
                </BtnPrimary>
              </Box>

              <Socials locale={router.locale} dividerLabel={loginLocal.or} />

              <Box className={s.bottomLink} sx={{ fontSize: ".75rem" }}>
                {loginLocal.tipText}
                {/* @ts-ignore */}
                <Typography
                  onClick={() => {
                    dispatch(ChangeAuthFormAction("signUp"));
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
                  {loginLocal.tipLink}
                </Typography>
              </Box>
            </Box>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default LoginForm;
