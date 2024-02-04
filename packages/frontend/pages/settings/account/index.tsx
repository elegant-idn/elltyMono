import React, { useEffect } from "react";
import { NextPage } from "next";
import s from "./AccountPage.module.scss";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Formik } from "formik";
import * as Yup from "yup";
import data from "../../../data/main";
import { InputPassword } from "../../../components/Inputs";
import DashboardLayout from "../../../components/Layouts/DashboardLayout";
import AuthPage from "../../../components/AuthPage";
import PageLayout from "../../../components/Layouts/PageLayout";
import LinkBack from "../../../components/LinkBack";
import { useCookies } from "react-cookie";
import Alert from "../../../components/Alert";
import { Api } from "../../../api";
import BtnOutline from "../../../components/BtnOutline";
import Select from "../../../components/Select";
import Head from "next/head";
import { useRouter } from "next/router";
interface AccountPageProps {
  cookieUser: any;
  cookieLocale: string;
  userToken: string;
}

const AccountPage: NextPage<AccountPageProps> = ({
  cookieUser,
  cookieLocale,
  userToken,
}) => {
  const [cookie, setCookie] = useCookies();
  const [changesSaved, setChangesSaved] = React.useState<boolean>(false);
  const [changesSavedEmail, setChangesSavedEmail] =
    React.useState<boolean>(false);
  const [formError, setFormError] = React.useState<string>("");
  const [formErrorEmail, setFormErrorEmail] = React.useState<string>("");

  const defaultImgSrc =
    "https://ellty-images.s3.amazonaws.com/avatars/default.png";
  const [avatarLink, setAvatarLink] = React.useState(cookieUser.avatar);
  const [avatarFieldIsDirty, setAvatarFieldIsDirty] = React.useState(false);
  const [emailFieldIsDirty, setEmailFieldIsDirty] = React.useState(false);
  const [emailFieldValue, setEmailFieldValue] = React.useState<string>("");

  const { t: local }: any = useTranslation("index");

  const { t }: any = useTranslation("AccountSetings");
  const accountSettingsLocal = t("settings", { returnObjects: true });

  const headerBtnPrimaryRef = React.useRef(null);
  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAvatarFieldIsDirty(true);

    let formData = new FormData();
    // @ts-ignore
    formData.append("avatar", event.currentTarget.files[0]);

    const axiosHeaders = {
      headers: {
        Authorization: cookie.user.accessToken,
      },
    };

    await Api.post("user/avatar", formData, axiosHeaders)
      .then((result) => {
        setAvatarLink(result.data.avatarLink);
      })
      .catch((err) => {
        console.log(err);
      });
    const axiosBody = JSON.stringify({
      avatarLink: avatarLink == defaultImgSrc ? "" : avatarLink,
    });

    await Api.patch("user/edit", axiosBody, axiosHeaders)
      .then((result) => {
        if (result.status === 200) {
          setChangesSaved(true);
          let cookieNew = cookie.user;
          cookieNew.avatar = result.data.avatar;
          setCookie("user", cookieNew, {
            path: "/",
            expires: new Date(cookieNew.expiresIn),
          });
        } else {
          setFormError("Something went wrong, please try again.");
        }
      })
      .catch((err) => {
        console.log(err);
        setFormError("Something went wrong, please try again.");
      });
    setAvatarFieldIsDirty(false);
  };
  const handleDeleteAvatar = async () => {
    setAvatarFieldIsDirty(true);
    setAvatarLink(defaultImgSrc);
    const axiosHeaders = {
      headers: {
        Authorization: cookie.user.accessToken,
      },
    };
    const axiosBody = JSON.stringify({
      avatarLink: avatarLink == defaultImgSrc ? "" : avatarLink,
    });

    await Api.patch("user/edit", axiosBody, axiosHeaders)
      .then((result) => {
        if (result.status === 200) {
          setChangesSaved(true);
          let cookieNew = cookie.user;
          cookieNew.avatar = defaultImgSrc;
          setCookie("user", cookieNew, {
            path: "/",
            expires: new Date(cookieNew.expiresIn),
          });
        } else {
          setFormError("Something went wrong, please try again.");
        }
      })
      .catch((err) => {
        console.log(err);
        setFormError("Something went wrong, please try again.");
      });
  };

  return (
    <PageLayout userToken={userToken}>
      <Head>
        <title>{accountSettingsLocal.title}</title>
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
          <div className={s.blockTitle}>{accountSettingsLocal.title}</div>

          <div className={s.linkBackWrapper}>
            <LinkBack href="/settings">{accountSettingsLocal.title}</LinkBack>
          </div>

          {changesSaved && (
            <div className={s.alertWrapper}>
              <Alert variant="success">
                {accountSettingsLocal.changesSave}
              </Alert>
            </div>
          )}

          {formError && <div className={s.formError}>{formError}</div>}

          <Formik
            initialValues={{
              firstName: cookieUser.first_name,
              lastName: cookieUser.last_name,
            }}
            onSubmit={(values, actions) => {
              setChangesSaved(false);
              setFormError("");

              const axiosBody = JSON.stringify({
                firstName: values.firstName,
                lastName: values.lastName,
                // avatar: values.lastName,
              });

              // console.log(axiosBody);

              const axiosHeaders = {
                headers: {
                  Authorization: cookie.user.accessToken,
                },
              };

              Api.patch("user/edit", axiosBody, axiosHeaders)
                .then((result) => {
                  if (result.status === 200) {
                    setChangesSaved(true);
                    let cookieNew = cookie.user;
                    cookieNew.first_name = result.data.fistName;
                    cookieNew.last_name = result.data.lastName;
                    cookieNew.full_name = `${result.data.fistName} ${result.data.lastName}`;
                    setCookie("user", cookieNew, {
                      path: "/",
                      expires: new Date(cookieNew.expiresIn),
                    });
                  } else {
                    setFormError("Something went wrong, please try again.");
                  }
                })
                .catch((err) => {
                  console.log(err);
                  setFormError("Something went wrong, please try again.");
                });

              actions.resetForm({ values });
              actions.setSubmitting(false);
            }}
            validationSchema={Yup.object({
              firstName: Yup.string().max(15, "Must be 15 characters or less"),
              lastName: Yup.string().max(15, "Must be 15 characters or less"),
              // .required("Required"),
              // acceptedTerms: Yup.boolean()
              //   .required("Required")
              //   .oneOf([true], "You must accept the terms and conditions."),
            })}
          >
            {(props) => (
              <form onSubmit={props.handleSubmit}>
                <div className={s.avatarWrapper}>
                  <div className={s.avatarHolder}>
                    {avatarLink !== defaultImgSrc && (
                      <div
                        className={s.removePhotobtn}
                        onClick={handleDeleteAvatar}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 51 51"
                        >
                          <circle cx="26" cy="26" r="25" />
                          <path d="M16 16 36 36 M36 16 16 36" />
                        </svg>
                      </div>
                    )}
                    <div className={s.avatar}>
                      <img src={avatarLink} alt="profile image" />
                    </div>
                  </div>

                  <div className={s.btnWrapper}>
                    <label className={s.avatarChange} htmlFor="uploadAvatar">
                      {accountSettingsLocal.choseFile}
                    </label>
                    <input
                      // ref={inputJsonRef}
                      type="file"
                      name="image"
                      id="uploadAvatar"
                      onChange={(event) => {
                        handleAvatarChange(event);
                      }}
                    />
                  </div>
                </div>
                {/* ./avatarWrapper */}

                <div className={s.inputGroup}>
                  <label>{accountSettingsLocal?.form?.fNameLabel}</label>
                  <input
                    type="text"
                    name="firstName"
                    onChange={props.handleChange}
                    // onChange={(e) => {
                    //   // setTemplateTitle(e.target.value)
                    //   // setTitleFieldIsDirty(true)
                    // }}
                    value={props.values.firstName}
                  />
                  {props.touched.firstName && (
                    <div className={s.inputError}>
                      {props.errors.firstName as string}
                    </div>
                  )}
                </div>

                <div className={s.inputGroup}>
                  <label>{accountSettingsLocal?.form?.lNameLabel}</label>
                  <input
                    type="text"
                    name="lastName"
                    onChange={props.handleChange}
                    // onChange={(e) => {
                    //   // setTemplateTitle(e.target.value)
                    //   // setTitleFieldIsDirty(true)
                    // }}
                    value={props.values.lastName}
                  />
                  {props.touched.lastName && (
                    <div className={s.inputError}>
                      {props.errors.lastName as string}
                    </div>
                  )}
                </div>

                <BtnOutline
                  type="submit"
                  variant="root"
                  disabled={props.isSubmitting || !props.dirty}
                >
                  {accountSettingsLocal?.form?.btn1}
                </BtnOutline>
              </form>
            )}
          </Formik>

          {changesSavedEmail && (
            <div className={s.alertWrapper}>
              <Alert variant="success">
                {t("settings.emailSendNofify", { email: emailFieldValue })}
              </Alert>
            </div>
          )}

          {formErrorEmail && (
            <div className={s.formError}>{formErrorEmail}</div>
          )}

          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            onSubmit={(values, actions) => {
              setChangesSavedEmail(false);
              setFormErrorEmail("");

              const axiosBody = JSON.stringify({
                email: values.email,
                password: values.password,
              });

              const axiosHeaders = {
                headers: {
                  Authorization: cookie.user.accessToken,
                },
              };

              Api.patch("/user/update/email", axiosBody, axiosHeaders)
                .then((result) => {
                  console.log(result, "and", values.email);
                  if (result.status == 200) {
                    result.data.status !== 200 &&
                      setFormErrorEmail(result.data.message);
                    if (result.data.status === 200) {
                      setEmailFieldValue(values.email);
                      setChangesSavedEmail(true);
                      let cookieNew = cookie.user;
                      setCookie("user", cookieNew, {
                        path: "/",
                        expires: new Date(cookieNew.expiresIn),
                      });
                    }
                  } else {
                    setFormErrorEmail(
                      "Something went wrong, please try again."
                    );
                  }
                })
                .catch((err) => {
                  console.log(err);
                  setFormErrorEmail("Something went wrong, please try again.");
                })
                .finally(() => {
                  actions.setSubmitting(false);
                });

              actions.resetForm({ values });
            }}
            validationSchema={Yup.object({
              email: Yup.string().email("Invalid email address"),
              password: Yup.string()
                .min(4, "Password must be at least 4 characters")
                .max(25, "Must be 25 characters or less")
                .required("Required"),
            })}
          >
            {(props) => (
              <form onSubmit={props.handleSubmit}>
                <div className={s.inputGroup}>
                  <label>{accountSettingsLocal?.form?.email}</label>
                  <input
                    type="text"
                    name="email"
                    onBlur={props.handleBlur}
                    // onClick={() => {
                    //   console.log(cookie.user);
                    // }}
                    onChange={props.handleChange}
                    // onChange={(e) => {
                    //   // setTemplateTitle(e.target.value)
                    //   // setTitleFieldIsDirty(true)
                    // }}
                    value={props.values.email}
                  />
                  {props.touched.email && (
                    <div className={s.inputError}>{props.errors.email}</div>
                  )}
                </div>

                <div className={s.inputGroup}>
                  {/* <label>{accountSettingsLocal?.form?.pass}</label> */}
                  {/* value={props.values.password}
                  onChange={props.handleChange} */}
                  <InputPassword
                    name="password"
                    label={`${accountSettingsLocal?.form?.pass}`}
                    type="password"
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    errors={props.errors.password}
                    touched={props.touched.password}
                    value={props.values.password}
                  />
                  {/* {props.touched.password && <div className={s.inputError}>{props.errors.password}</div>} */}
                </div>

                <BtnOutline
                  type="submit"
                  variant="root"
                  disabled={
                    props.isSubmitting || (!avatarFieldIsDirty && !props.dirty)
                  }
                >
                  {accountSettingsLocal?.form?.btn2}
                </BtnOutline>
              </form>
            )}
          </Formik>
          <div className={s.langWrapper}>
            <div className={s.inputGroup}>
              <label>{accountSettingsLocal?.form?.language}</label>
              <Select
                value={
                  data.langList.find((s) => s.abbr == cookie.locale)?.value ||
                  data.langList.find((s) => s.abbr == cookieLocale)?.value
                }
                elements={data.langList}
                onSelect={(langItem: any) => {
                  setCookie("locale", langItem.abbr, { path: "/" });
                }}
                isDropDownUp={true}
              />
            </div>
          </div>
          {/* ./landWrapper */}
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
      cookieLocale: req.cookies.locale || "",
      userToken: !!req.cookies.user_token && (req.cookies.user_token || null),
    },
  };
}

export default AccountPage;
