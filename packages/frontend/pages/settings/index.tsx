import React from "react";
import { NextPage } from "next";
import Router from "next/router";
import clsx from "clsx";
import s from "./SettingsPage.module.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  SetInitialSizesAction,
  SetInitialSectionAction,
} from "../../redux/actions";
import { RootState } from "../../redux/store";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import DashboardLayout from "../../components/Layouts/DashboardLayout";
import AuthPage from "../../components/AuthPage";
import PageLayout from "../../components/Layouts/PageLayout";
import { useCookies } from "react-cookie";
import Head from "next/head";
import { useRouter } from "next/router";
// const navbarItemsData = [
//   {
//     'text': 'Account settings',
//     'value': 'account',
//     'svg': 'engine',
//   },
//   {
//     'text': 'Security',
//     'value': 'security',
//     'svg': 'lock',
//   },
//   {
//     'text': 'Payment & Billing ',
//     'value': 'billing',
//     'svg': 'wallet',
//   },
//   {
//     'text': 'Subscription',
//     'value': 'subscription',
//     'svg': 'test',
//   },
// ]

const elementsData = [
  {
    name: "Pastel Geometr gsc",
    category: "Instagram post",
    src: "/time/design1.png",
  },
  {
    name: "Pastel Geometr ipsgsc...",
    category: "Instagram post",
    src: "/time/design2.png",
  },
  {
    name: "Pastel Geometr ipsgsc...",
    category: "Instagram post",
    src: "/time/design3.png",
  },
  {
    name: "Pastel Geometr ipsgsc...",
    category: "Instagram post",
    src: "/time/design4.png",
  },
  {
    name: "Pastel Geometr ipsgsc...",
    category: "Instagram post",
    src: "/time/design2.png",
  },
  {
    name: "Pastel Geometr ipsgsc...",
    category: "Instagram post",
    src: "/time/design2.png",
  },
  {
    name: "Pastel Geometr ipsgsc...",
    category: "Instagram post",
    src: "/time/design3.png",
  },
  {
    name: "Pastel Geometr ipsgsc...",
    category: "Instagram post",
    src: "/time/design4.png",
  },
  {
    name: "Pastel Geometr ipsgsc...",
    category: "Instagram post",
    src: "/time/design2.png",
  },
  {
    name: "Pastel Geometr ipsgsc...",
    category: "Instagram post",
    src: "/time/design1.png",
  },
  {
    name: "Pastel Geometr ipsgsc...",
    category: "Instagram post",
    src: "/time/design2.png",
  },
  {
    name: "Pastel Geometr ipsgsc...",
    category: "Instagram post",
    src: "/time/design3.png",
  },
  {
    name: "Pastel Geometr ipsgsc...",
    category: "Instagram post",
    src: "/time/design4.png",
  },
  {
    name: "Pastel Geometr ipsgsc...",
    category: "Instagram post",
    src: "/time/design2.png",
  },
  {
    name: "Pastel Geometr ipsgsc...",
    category: "Instagram post",
    src: "/time/design2.png",
  },
  {
    name: "Pastel Geometr ipsgsc...",
    category: "Instagram post",
    src: "/time/design3.png",
  },
  {
    name: "Pastel Geometr ipsgsc...",
    category: "Instagram post",
    src: "/time/design4.png",
  },
  {
    name: "Pastel Geometr ipsgsc...",
    category: "Instagram post",
    src: "/time/design2.png",
  },
];

interface SettingsPageProps {
  cookieUser: any;
  userToken: string;
}
const SettingsPage: NextPage<SettingsPageProps> = ({
  cookieUser,
  userToken,
}) => {
  const { t: local }: any = useTranslation("index");
  const { t }: any = useTranslation("AccountSetings");
  const sideBarLocal = t("navbarItemsData", { returnObjects: true });
  const headerBtnPrimaryRef = React.useRef(null);

  React.useEffect(() => {
    // if the screen width is more than 700 pixels, then we send the user
    // from the settings page directly to the settings/account page.
    // Since he can select a page in the sidebar. If the screen is small,
    // the user selects the settings page on the /settings page

    if (window.innerWidth > 800) {
      Router.replace("/settings/account");
    }
  }, []);

  return (
    <PageLayout userToken={userToken}>
      <Head>
        <title>{t("headTitle")}</title>
      </Head>
      <DashboardLayout
        userToken={userToken}
        cookieUser={cookieUser}
        authorized={cookieUser ? true : false}
        sidePanelData={sideBarLocal}
        settingsPage={true}
        sidePanelBaseUrl="/settings"
        local={local}
        headerBtnPrimaryRef={headerBtnPrimaryRef}
      >
        <div className={s.root}>
          {/* {( openWindow == "account") && <AccountWindow cookieUser={cookieUser} cookieLocale={cookieLocale} /> }

          {( openWindow == "security") && <SecurityWindow /> }

          {( openWindow == "billing") && <BillingWindow /> }

          {( openWindow == "subs") && <SubscriptionWindow /> } */}

          {/* {( openWindow == "liked") && <LikedWindow data={elementsData} /> }

          {( openWindow == "trash") && <TrashWindow data={elementsData} /> } */}
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

export default SettingsPage;
