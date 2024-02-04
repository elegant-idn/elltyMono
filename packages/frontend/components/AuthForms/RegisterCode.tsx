import clsx from "clsx";
import { Formik } from "formik";
import Router from "next/router";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { ToggleAuthModalAction, ToggleMenuAction } from "../../redux/actions";
import { RootState } from "../../redux/store";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useTranslation } from "next-i18next";
import { useCookies } from "react-cookie";
import { Api } from "../../api";
import gaEvent from "../../utils/gaEvent";
import BtnPrimary from "../BtnPrimary";
import { InputText } from "../Inputs";
import s from "./Forms.module.scss";

interface FormProps {
  menu?: boolean;
}

const RegisterCode: React.FC<React.PropsWithChildren<FormProps>> = ({
  menu,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.mainReducer.user);
  const [_, setCookie] = useCookies();
  const [error, setError] = React.useState<string>("");

  const { t }: any = useTranslation("AuthModal");
  const confirmLocal = t("confirm", { returnObjects: true });
  const i18nErrors = t("errors", { returnObjects: true });

  const [timerState, timerDispatch] = React.useReducer(timerReducer, {
    time: 60,
    isRunning: false,
  });

  const timerRef = React.useRef<any>(0);

  React.useEffect(() => {
    if (!timerState.isRunning) {
      return;
    }
    timerRef.current = setInterval(() => timerDispatch({ type: "tick" }), 1000);
    return () => {
      clearInterval(timerRef.current);
      timerRef.current = 0;
    };
  }, [timerState.isRunning]);

  function timerReducer(state: any, action: any) {
    switch (action.type) {
      case "start":
        return { ...state, isRunning: true };
      case "reset":
        return { isRunning: false, time: 0 };
      case "tick":
        if (state.time <= 0) return { time: 60, isRunning: false };
        return { ...state, time: state.time - 1 };
      default:
        throw new Error();
    }
  }
  // console.log(user);

  const resendCode = () => {
    timerDispatch({ type: "start" });

    const body = JSON.stringify({
      email: user.email,
      type: "confirm",
    });

    Api.post("/auth/resend", body)
      .then((result) => {
        console.log(result);
      })
      .catch((reason) => {
        console.log(reason);

        reason?.response?.data.message
          ? setError(reason?.response?.data.message)
          : setError(i18nErrors.somethingWrong);
      });
  };

  const afterAuthAction = useSelector(
    (state: RootState) => state.mainReducer.afterAuthAction
  );

  return (
    <div className={clsx(menu && s.menu)}>
      <Formik
        initialValues={{
          regCode: "",
        }}
        validationSchema={Yup.object({
          regCode: Yup.string()
            .max(25, t("errors.charactersOrLess", { count: 25 }))
            .required(i18nErrors.required),
        })}
        onSubmit={(values, actions) => {
          const body = JSON.stringify({
            email: user.email,
            code: values.regCode,
          });

          Api.post(`/auth/confirmation`, body)
            .then((result) => {
              console.log(result.data);
              const { accessToken, ...userData } = result.data;

              if (result.status === 201) {
                const user = {
                  accessToken: `Bearer ${accessToken}`,
                  ...userData,
                };

                const gaCallback = () => {
                  // setCookie("user_token", `Bearer ${accessToken}`, {
                  //   path: "/",
                  //   expires: new Date(userData.expiresIn),
                  // });
                  // setCookie(
                  //   // @ts-ignore
                  //   "user",
                  //   user,
                  //   { path: "/", expires: new Date(userData.expiresIn) }
                  // );
                  // menu
                  //   ? dispatch(ToggleMenuAction(null))
                  //   : dispatch(ToggleAuthModalAction(null));
                  // Router.reload();
                };

                gaEvent("complete_sign_up");

                setCookie("user_token", `Bearer ${accessToken}`, {
                  path: "/",
                  expires: new Date(userData.expiresIn),
                });

                setCookie(
                  // @ts-ignore
                  "user",
                  user,
                  { path: "/", expires: new Date(userData.expiresIn) }
                );

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
              }
              actions.setSubmitting(false);
            })
            .catch((reason) => {
              if (axios.isAxiosError(reason)) {
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
                  marginBottom: "10px",
                }}
              >
                {confirmLocal.title}
              </Box>

              {error && <div className={s.formError}>{error}</div>}

              <Box
                className={s.formSubtitle}
                sx={{
                  fontSize: ".75rem",
                  marginBottom: "20px",
                }}
              >
                {t("confirm.text", { email: user.email })}
              </Box>

              <InputText
                name="regCode"
                label={`${confirmLocal.input}`}
                type="text"
                placeholder={`${confirmLocal.inputPlaceHold}`}
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                errors={props.errors.regCode}
                touched={props.touched.regCode}
                value={props.values.regCode}
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
                  {confirmLocal.btn}
                </BtnPrimary>
              </Box>

              <Box
                className={s.bottomLink}
                sx={{ fontSize: ".75rem", textAlign: "center" }}
              >
                {confirmLocal.tipText}
                {!timerState.isRunning ? (
                  // @ts-ignore
                  <Typography
                    onClick={resendCode}
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
                    {confirmLocal.tipLink}
                  </Typography>
                ) : (
                  // @ts-ignore
                  <Typography
                    as="span"
                    sx={{
                      opacity: ".6",
                      fontSize: ".75rem",
                      color: "var(--black-color)",
                      cursor: "default",
                    }}
                  >
                    {" "}
                    {confirmLocal.reset} <span>({timerState.time}s)</span>
                  </Typography>
                )}
              </Box>
            </Box>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default RegisterCode;
