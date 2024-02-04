import React from "react";
import { NextPage } from "next";
import Head from "next/head";
import s from "./UsersPage.module.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  SetInitialSizesAction,
  SetInitialSectionAction,
} from "../../../redux/actions";
import { RootState } from "../../../redux/store";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import data from "../../../data/main";

import DashboardLayout from "../../../components/Layouts/DashboardLayout";
import AuthPageAdmin from "../../../components/AuthPageAdmin";
import AuthPage from "../../../components/AuthPage";
import PageLayout from "../../../components/Layouts/PageLayout";
import LinkBack from "../../../components/LinkBack";
import { ISidePanelData } from "../../../components/Dashboard/SidePanel";
import useTypedSelector from "../../../utils/useTypedSelector";

interface BillingPageProps {
  cookieUser: any;
  userToken: string;
}

const BillingPage: NextPage<BillingPageProps> = ({ cookieUser, userToken }) => {
  const { t }: any = useTranslation("index");
  const { t: adminPageI18n }: any = useTranslation("adminPage");
  const i18nUsersPage = adminPageI18n("usersPage", { returnObjects: true });
  const i18nSidePanel = adminPageI18n("sidePanel", { returnObjects: true });
  const user = useTypedSelector((state) => state.mainReducer.user);

  const sidePanelData = React.useRef<ISidePanelData[]>([]);
  for (let i = 0; i < data.adminSidePanel.length; i++) {
    if (sidePanelData.current.length === data.adminSidePanel.length) break;

    sidePanelData.current.push({
      text: i18nSidePanel[i].text,
      value: data.adminSidePanel[i].value,
      svg: data.adminSidePanel[i].svg,
    });
  }

  if (user.role !== "admin")
    return (
      <PageLayout userToken={userToken}>
        <AuthPageAdmin local={t} />
      </PageLayout>
    );

  return (
    <PageLayout userToken={userToken}>
      <DashboardLayout
        userToken={userToken}
        cookieUser={cookieUser}
        authorized={cookieUser ? true : false}
        adminPage
        sidePanelData={sidePanelData.current}
        sidePanelBaseUrl="/admin"
        local={t}
      >
        <Head>
          <title>{t("globalTitle")}</title>
        </Head>
        <div className={s.root}>
          <div className={s.blockTitle}>{i18nUsersPage.title}</div>

          {/* <div className={s.linkBackWrapper}>
            <LinkBack href="/admin">{i18nUsersPage.title}</LinkBack>
          </div> */}
        </div>
      </DashboardLayout>
    </PageLayout>
  );
};

// @ts-ignore
export async function getServerSideProps({ req, res, locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale || req.cookies.locale || "en", [
        "common",
        "index",
        "AuthModal",
        "Checkout",
        "AdminPageAuth",
        "adminPage",
      ])),
      cookieUser: !!req.cookies.user && (JSON.parse(req.cookies.user) || ""),
      userToken: !!req.cookies.user_token && (req.cookies.user_token || null),
    },
  };
}

export default BillingPage;
