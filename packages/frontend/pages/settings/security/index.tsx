import clsx from "clsx";
import { NextPage } from "next";
import React, { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import axios from "axios";
import { Formik } from "formik";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import NextLink from "next/link";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { Api } from "../../../api";
import Alert from "../../../components/Alert";
import BtnOutline from "../../../components/BtnOutline";
import { InputPassword } from "../../../components/Inputs";
import DashboardLayout from "../../../components/Layouts/DashboardLayout";
import PageLayout from "../../../components/Layouts/PageLayout";
import LinkBack from "../../../components/LinkBack";
import s from "./SecurityPage.module.scss";
interface SecurityPageProps {
  cookieUser: any;
  userToken: string;
}

const SecurityPage: NextPage<SecurityPageProps> = ({
  cookieUser,
  userToken,
}) => {
  const { t: local }: any = useTranslation("index");
  const { t }: any = useTranslation("AccountSetings");
  const securityLocal = t("security", { returnObjects: true });
  const headerBtnPrimaryRef = React.useRef(null);
  const [cookie, setCookie] = useCookies();
  const [deleteAcc, setDeleteAcc] = useState(false);
  const [errors, setErrors] = useState(" ");
  const [changesSaved, setChangesSaved] = useState(false);
  const handleOpen = () => setDeleteAcc(true);
  const handleClose = () => setDeleteAcc(false);
  const success = t("settings", { returnObjects: true });
  const i18nErrors = t("errors", { returnObjects: true });
  const dispatch = useDispatch();
  useEffect(() => {
    const timer = setTimeout(() => {
      setChangesSaved(false);
      setErrors(" ");
    }, 5000);
    return () => clearTimeout(timer);
  }, [changesSaved, errors]);

  return (
    <PageLayout userToken={userToken}>
      <Head>
        <title>{t("headTitle")}</title>
      </Head>
      <DashboardLayout
        userToken={userToken}
        cookieUser={cookieUser}
        authorized={cookieUser ? true : false}
        sidePanelData={t("navbarItemsData", { returnObjects: true })}
        sidePanelBaseUrl="/settings"
        local={local}
        headerBtnPrimaryRef={headerBtnPrimaryRef}
      >
        <div className={s.root}>
          <div className={s.linkBackWrapper}>
            <LinkBack href="/settings">{securityLocal.title}</LinkBack>
          </div>
          <div className={s.blockTitle}>{securityLocal.title}</div>
          <div className={s.block}>
            {changesSaved && (
              <Alert variant="success">{success.changesSave}</Alert>
            )}
            {errors && <div className={s.formError}>{errors}</div>}
            <Formik
              initialValues={{
                currentPass: "",
                newPass: "",
              }}
              validationSchema={Yup.object({
                newPass: Yup.string()
                  .min(4, t("minimum 4 characters", { count: 4 }))
                  .max(25, t("maximum 25 characters", { count: 25 }))
                  .required(i18nErrors.required),
              })}
              onSubmit={(values, actions) => {
                const body = JSON.stringify({
                  currentPass: values.currentPass,
                  newPass: values.newPass,
                });
                const axiosHeaders = {
                  headers: {
                    Authorization: cookie.user.accessToken,
                  },
                };
                Api.patch("/user/update/pass", body, axiosHeaders)
                  .then((result) => {
                    if (result.status === 200) {
                      result.data.status !== 200 &&
                        setErrors(result.data.message);
                      if (result.data.success) {
                        setChangesSaved(true);
                      }
                      let cookieNew = cookie.user;
                      setCookie("user", cookieNew, {
                        path: "/",
                        expires: new Date(cookieNew.expiresIn),
                      });
                    } else {
                      setErrors("Something went wrong, please try again.");
                    }
                  })
                  .catch((reason) => {
                    if (axios.isAxiosError(reason)) {
                      console.log(reason?.response?.data.message);
                      reason?.response?.data.message
                        ? setErrors(reason?.response?.data.message)
                        : setErrors(i18nErrors.somethingWrong);
                    }
                  })
                  .finally(() => {
                    actions.setSubmitting(false);
                  });
                actions.resetForm({ values });
              }}
            >
              {(props) => {
                return (
                  <form onSubmit={props.handleSubmit}>
                    <div className={s.inputGroup}>
                      <InputPassword
                        name="currentPass"
                        label={`${securityLocal?.form?.currentPass}`}
                        type="password"
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        errors={props.errors.currentPass}
                        touched={props.touched.currentPass}
                        value={props.values.currentPass}
                      />
                      <InputPassword
                        name="newPass"
                        label={`${securityLocal?.form?.newPass}`}
                        type="password"
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        errors={props.errors.newPass}
                        touched={props.touched.newPass}
                        value={props.values.newPass}
                      />
                    </div>
                    <div className={s.btnWrapper}>
                      <BtnOutline type="submit" variant="root">
                        {securityLocal?.form?.btn1}
                      </BtnOutline>
                    </div>
                  </form>
                );
              }}
            </Formik>
            <div className={s.warningWrapper}>
              <label>{securityLocal?.form?.deleteAccount}</label>
              <p className={s.underText}>
                {securityLocal?.form?.deleteWarning}
              </p>
              <br />
              <BtnOutline type="submit" variant="root" onClick={handleOpen}>
                {securityLocal?.form?.btn2}
              </BtnOutline>

              <Modal
                open={deleteAcc}
                onClose={handleClose}
                closeAfterTransition
                BackdropProps={{
                  timeout: 500,
                }}
              >
                <Box className={clsx("modal", s.root)}>
                  <button className={s.closeBtn} onClick={handleClose}></button>
                  <div className={s.modalWrapper}>
                    <div className={s.title}>
                      {" "}
                      {securityLocal?.modal?.modalTitle}
                    </div>
                    <div className={s.text}>
                      {" "}
                      {securityLocal?.modal?.modalText1Part1}
                      <b>{securityLocal?.modal?.day}</b>
                      {securityLocal?.modal?.modalText1Part2}
                    </div>
                    <div className={s.text}>
                      {securityLocal?.modal?.modalText2Part1}
                      <b>{securityLocal?.modal?.day}</b>
                      {securityLocal?.modal?.modalText2Part2}
                      <b>{securityLocal?.modal?.modalText2Part3}</b>
                    </div>
                    <div className={s.text}>
                      {" "}
                      {securityLocal?.modal?.modalText3}
                      <b>{securityLocal?.modal?.deleteBold}</b>
                      {securityLocal?.modal?.modalText4}
                    </div>
                    <div className={s.text}>
                      <input
                        id="delete"
                        type="text"
                        className={s.deleteInput}
                      />
                    </div>
                    <div className={s.btnWrap}>
                      <BtnOutline
                        type="submit"
                        variant="root"
                        onClick={handleClose}
                      >
                        {securityLocal?.modal?.cancel}
                      </BtnOutline>
                      <NextLink href="/settings/deleted">
                        <BtnOutline
                          type="submit"
                          variant="red"
                          onClick={handleClose}
                        >
                          {securityLocal?.modal?.delete}
                        </BtnOutline>
                      </NextLink>
                    </div>
                  </div>
                </Box>
              </Modal>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </PageLayout>
  );
};

// @ts-ignore
export async function getServerSideProps({ req, res, locale }) {
  const cookieUser = !!req.cookies.user && (JSON.parse(req.cookies.user) || "");

  if (!cookieUser) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      ...(await serverSideTranslations(locale || req.cookies.locale || "en", [
        "common",
        "index",
        "AuthModal",
        "Checkout",
        "AccountSetings",
      ])),
      cookieUser: !!req.cookies.user && (JSON.parse(req.cookies.user) || ""),
      userToken: !!req.cookies.user_token && (req.cookies.user_token || null),
    },
  };
}

export default SecurityPage;
