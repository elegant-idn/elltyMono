import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import axios from "axios";
import clsx from "clsx";
import { Formik } from "formik";
import { useTranslation } from "next-i18next";
import React from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { Api } from "../../api";
import { ChangeAuthFormAction } from "../../redux/actions";
import { RootState } from "../../redux/store";
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
  const resetPassConfirmLocal = t("resetPassConfirm", { returnObjects: true });
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

  const resendCode = () => {
    timerDispatch({ type: "start" });

    const body = JSON.stringify({
      email: user.email,
      type: "reset",
    });

    // console.log(body);

    Api.post("/auth/resend", body)
      .then((result) => {
        // console.log(result);
      })
      .catch((reason) => {
        console.log(reason);

        reason?.response?.data.message
          ? setError(reason?.response?.data.message)
          : setError(i18nErrors.somethingWrong);
      });
  };

  return (
    <div className={clsx(menu && s.menu)}>
      <Formik
        initialValues={{
          code: "",
        }}
        validationSchema={Yup.object({
          code: Yup.string()
            .max(15, t("errors.charactersOrLess", { count: 15 }))
            .required(i18nErrors.required),
        })}
        onSubmit={(values, actions) => {
          const body = {
            email: user.email,
            code: values.code,
          };
          console.log(body);
          Api.post("/auth/resetPassword/confirm", JSON.stringify(body))
            .then((result) => {
              if (result.status === 200) {
                // console.log(result);
                if (result.data.status == 400) {
                  setError(result.data.message);
                } else {
                  dispatch(ChangeAuthFormAction("setPassword"));
                }
                // setCookie('Authorization', `Bearer ${result.data.accessToken}`, { expires: new Date(Date.now()+(1000 * 60 * 15)) });
                // dispatch(SetUser({
                //   email: result.data.email,
                //   status: result.data.status,
                //   role: result.data.role,
                // }))
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
                {resetPassConfirmLocal.title}
              </Box>

              {error && <div className={s.formError}>{error}</div>}

              <Box
                className={s.formSubtitle}
                sx={{
                  fontSize: ".75rem",
                  marginBottom: "20px",
                }}
              >
                {t("resetPassConfirm.text", { email: user.email })}
              </Box>

              <InputText
                name="code"
                label={`${resetPassConfirmLocal.input}`}
                type="text"
                placeholder={`${resetPassConfirmLocal.inputPlaceHold}`}
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                errors={props.errors.code}
                touched={props.touched.code}
                value={props.values.code}
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
                  {resetPassConfirmLocal.btn}
                </BtnPrimary>
              </Box>

              <Box
                className={s.bottomLink}
                sx={{ fontSize: ".75rem", textAlign: "center" }}
              >
                {resetPassConfirmLocal.tipText}
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
                    {resetPassConfirmLocal.tipLink}
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
                    {resetPassConfirmLocal.reset}{" "}
                    <span>({timerState.time}s)</span>
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
