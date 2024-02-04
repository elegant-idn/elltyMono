import type { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import s from "./FoldersPage.module.scss";
// import { useTranslation } from 'next-i18next'
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { Api } from "../../api";
import AuthPage from "../../components/AuthPage";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import PageLayout from "../../components/Layouts/PageLayout";

interface FoldersPageProps {
  cookieUser: any;
  authorized: string;
  userToken: string;
}

const FoldersPage: NextPage<FoldersPageProps> = ({
  cookieUser,
  authorized,
  userToken,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t }: any = useTranslation("index");
  const i18n = t("foldersPage", { returnObjects: true });
  const pagesDashbord = t("dashboard.sidebar", { returnObjects: true });
  const [folders, setFolders] = useState<string[]>([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const headerBtnPrimaryRef = React.useRef(null);
  const [displayMode, setDisplayMode] = React.useState("list"); // grid, list
  const [counter, setCounter] = React.useState(1);
  const ListHeader = () => (
    <div className={s.listHeader}>
      <p>name</p>
      <p>type</p>
    </div>
  );

  const FolderIcon = () => (
    <svg
      width="27"
      height="28"
      viewBox="0 0 33 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 25.1289H24.1889C24.3107 25.1289 24.4094 25.0302 24.4094 24.9084V13.2149C24.4094 12.1103 23.514 11.2149 22.4094 11.2149H17.7915C17.1649 11.2149 16.5746 10.9213 16.1966 10.4216L15.0621 8.92217C14.684 8.42252 14.0937 8.12891 13.4671 8.12891H10C8.89543 8.12891 8 9.02434 8 10.1289V24.1289C8 24.6812 8.44771 25.1289 9 25.1289Z"
        stroke="#1F2128"
      />
      <line x1="8" y1="11.2275" x2="18.5158" y2="11.2275" stroke="#1F2128" />
      <line
        x1="11.1943"
        y1="21.5889"
        x2="21.1367"
        y2="21.5889"
        stroke="#1F2128"
        strokeLinecap="round"
      />
    </svg>
  );
  const handleCreateNewFolder = async () => {
    await setCounter(counter + 1);
    const axiosHeader = {
      headers: {
        Authorization: cookieUser.accessToken,
      },
    };
    const axiosBody = {
      name: `new folder${counter}`,
    };
    Api.post("folders/create", axiosBody, axiosHeader)
      .then((result) => {
        const res = JSON.parse(result.config.data);
        setFolders([...folders, res.name]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  React.useEffect(() => {
    const axiosHeader = {
      headers: {
        Authorization: cookieUser.accessToken,
      },
    };
    Api.get("/folders", axiosHeader)
      .then((result) => {
        setFolders(result.data);
        if (result.data.length == 0) setIsEmpty(true);
      })
      .catch((err) => {
        console.log(err.response);
        setIsEmpty(true);
      });
  }, []);
  return !cookieUser ? (
    <AuthPage local={t} />
  ) : (
    <PageLayout userToken={userToken}>
      <DashboardLayout
        userToken={userToken}
        cookieUser={cookieUser}
        authorized={authorized ? true : false}
        searchPanel
        sidePanelData={pagesDashbord}
        sidePanelBaseUrl=""
        local={t}
        headerBtnPrimaryRef={headerBtnPrimaryRef}
      >
        <Head>
          <title>{i18n.headTitle}</title>
        </Head>
        <div className={s.root}>
          {/* <div className={s.blockTitle}>{foldersLocal.title}</div>
          <div className={s.wrapper}>
            <BtnOutline onClick={handleCreateNewFolder} variant="root">
              Create new folder
            </BtnOutline>
            <ListHeader />

              {folders.map((folder) => {
                return (
                  <div key={folders.indexOf(folder)} className={s.listElement}>
                    <div className={s.nameHolder}>
                      <FolderIcon />
                      <p>{folder}</p>
                    </div>
                    <span>1 item</span>
                    <ThreeDots />
                  </div>
                  <span>1 item</span>
                  <ThreeDots />
                </div>
              );
            })}
          </div> */}
          <div className={s.empty}>
            {i18n.subTitle}
            <div className={s.badge}>{i18n.badge}</div>
          </div>
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
      ])),
      cookieUser: !!req.cookies.user && (JSON.parse(req.cookies.user) || ""),
      userToken: !!req.cookies.user_token && (req.cookies.user_token || null),
    },
  };
}

export default FoldersPage;
