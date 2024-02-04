import React from "react";
import Head from "next/head";
import Router from "next/router";
import Image from "next/image";
import NextLink from "next/link";
import axios from "axios";
import s from "./AuthPage.module.scss";
import clsx from "clsx";
import { useDispatch } from "react-redux";
import { ChangeAuthFormAction, SetUser } from "../../redux/actions";

import { Formik } from "formik";
import * as Yup from "yup";
import { useCookies } from "react-cookie";
import { Api } from "../../api";
import AcceptCookie from "../AcceptCookie";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { InputText, InputPassword, InputCheckbox } from "../Inputs";
import BtnPrimary from "../BtnPrimary";
import gaEvent from "../../utils/gaEvent";
import { useTranslation } from "next-i18next";

interface AuthPageAdm {
  local: any;
}

const AuthPageAdmin: React.FC<React.PropsWithChildren<AuthPageAdm>> = ({
  local,
}) => {
  const dispatch = useDispatch();

  // const user = useSelector((state: RootState) => state.mainReducer.user);
  const { t }: any = useTranslation("AdminPageAuth");
  const adminAuthLocal = t("login", { returnObjects: true });

  const [_, setCookie] = useCookies();
  const [error, setError] = React.useState<string>("");

  return (
    <div className={s.root}>
      <Head>
        <title>{t("headTitle")}</title>
      </Head>
      <AcceptCookie local={local} />

      <div className={s.left}>
        <div className={s.logo}>
          <NextLink href="/" passHref>
            <a>
              <Image
                src="/logo.svg"
                width={75}
                height={32}
                layout="responsive"
              />
            </a>
          </NextLink>
        </div>

        <div className={s.img}>
          <Image
            src="/admin/banner.png"
            width={1952}
            height={1345}
            layout="responsive"
            alt="block image"
          />
        </div>
      </div>

      <div className={s.right}>
        <Formik
          initialValues={{
            email: "",
            password: "",
            acceptedTerms: true,
          }}
          validationSchema={Yup.object({
            email: Yup.string()
              .email("Invalid email address")
              .required("Required"),
            password: Yup.string()
              .min(4, "Password must be at least 4 characters")
              .max(25, "Must be 25 characters or less")
              .required("Required"),
            // acceptedTerms: Yup.boolean()
            //   .required("Required")
            //   .oneOf([true], "You must accept the terms and conditions."),
          })}
          onSubmit={(values, actions) => {
            const body = {
              email: values.email,
              password: values.password,
            };

            Api.post("/auth/signin", JSON.stringify(body))
              .then((result) => {
                if (result.status === 200) {
                  const {
                    first_name,
                    last_name,
                    full_name,
                    email,
                    status,
                    plan,
                    role,
                    remainingDownloads,
                    avatar,
                    accessToken,
                    expiresIn,
                  } = result.data;

                  switch (status) {
                    case "active": {
                      console.log(result.data);
                      const user = {
                        first_name,
                        last_name,
                        full_name,
                        email,
                        status,
                        plan,
                        role,
                        remainingDownloads,
                        avatar,
                        expiresIn,
                        accessToken: `Bearer ${accessToken}`,
                      };

                      const gaCallback = () => {
                        setCookie("user", user, {
                          path: "/",
                          expires: new Date(expiresIn),
                        });
                        setCookie(
                          "user_token",
                          `Bearer ${result.data.accessToken}`,
                          {
                            path: "/",
                            expires: new Date(expiresIn),
                          }
                        );

                        // menu ? dispatch(ToggleMenuAction(null)) : dispatch(ToggleAuthModalAction(null))
                        Router.reload();
                      };

                      // dispatch(SetUser({
                      //   username: result.data.username,
                      //   email: result.data.email,
                      //   status: result.data.status,
                      //   role: result.data.role,
                      // }))
                      gaEvent("finish_log_in", gaCallback);
                      // menu ? dispatch(ToggleMenuAction(null)) : dispatch(ToggleAuthModalAction(null))

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
                      // dispatch(ChangeAuthFormAction('registerCode'))
                      setError("This account is not activated");
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
                  reason?.response?.data.message
                    ? // Error if the user is in the database, but the password is entered incorrectly
                      setError(reason?.response?.data.message)
                    : setError("Something went wrong, please try again.");
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
                    fontSize: "1.5rem",
                    fontWeight: "var(--bold-text)",
                    marginBottom: "20px",
                  }}
                >
                  {adminAuthLocal.title}
                </Box>

                {error && <div className={s.formError}>{error}</div>}

                <InputText
                  name="email"
                  label={`${adminAuthLocal.email}`}
                  type="text"
                  placeholder={`${adminAuthLocal.emailPlaceHold}`}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  errors={props.errors.email}
                  touched={props.touched.email}
                  value={props.values.email}
                />
                <InputPassword
                  name="password"
                  label={`${adminAuthLocal.pass}`}
                  type="password"
                  placeholder={`${adminAuthLocal.passPlaceHold}`}
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
                    label={`${adminAuthLocal.remember}`}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    errors={props.errors.acceptedTerms}
                    touched={props.touched.acceptedTerms}
                    value={props.values.acceptedTerms}
                    checked={props.values.acceptedTerms}
                    variant="gray"
                  />
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
                    {adminAuthLocal.btn}
                  </BtnPrimary>
                </Box>
              </Box>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AuthPageAdmin;
