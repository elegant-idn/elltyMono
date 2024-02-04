import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import React from "react";
import CardHolder from "../../../components/CardHolder";
import UpgradeToProBar from "../../../components/Dashboard/UpgradeToProBar";
import DashboardLayout from "../../../components/Layouts/DashboardLayout";
import PageLayout from "../../../components/Layouts/PageLayout";
import LinkBack from "../../../components/LinkBack";
import s from "./BillingPage.module.scss";
interface BillingPageProps {
  cookieUser: any;
  userToken: string;
}

const BillingPage: NextPage<BillingPageProps> = ({ cookieUser, userToken }) => {
  const { t: local }: any = useTranslation("index");

  const { t }: any = useTranslation("AccountSetings");
  const i18n = t("billing", { returnObjects: true });

  const headerBtnPrimaryRef = React.useRef(null);

  return (
    // return (
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
            <LinkBack href="/settings">{i18n.title}</LinkBack>
          </div>
          <div className={s.blockTitle}>{i18n.title}</div>
          <label>{i18n?.underTitle}</label>
          {cookieUser.plan === "free" ? (
            <div className={s.blockFreePlan}>
              <p>{i18n?.choosePlan}</p>
              <div className={s.btnWrapper}>
                <UpgradeToProBar
                  remainingDownloads={cookieUser.remainingDownloads}
                  br={false}
                />
              </div>
            </div>
          ) : (
            <>
              <CardHolder
                changeCard={i18n?.change}
                deleteCard={i18n?.delete}
                modalMsg={i18n?.temporaryText}
              />
              <div className={s.HistoryWrapper}>
                <label>{i18n?.history}</label>
                <div className={s.HolderHistory}>
                  <div className={s.flexWrapper}>
                    <label>{i18n?.table?.date}</label>
                    <label>{i18n?.table?.details}</label>
                    <label>{i18n?.table?.amount}</label>
                    <label>{i18n?.table?.download}</label>
                  </div>
                  <hr />
                </div>
              </div>
            </>
          )}
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

export default BillingPage;
