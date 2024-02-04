import type { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import s from "./TrashPage.module.scss";
// import { useTranslation } from 'next-i18next'
import Popper from "@mui/material/Popper";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import AuthPage from "../../components/AuthPage";
import {
  DesignGridElement,
  DesignListElement,
} from "../../components/Dashboard/DesignElements";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import PageLayout from "../../components/Layouts/PageLayout";
import { previewArray } from "../liked";
import { DesignsGrid } from "../../components/Projects/DesignsGrid";
import { usePaginatedEndpoint } from "../../utils/usePaginatedEndpoint";
import { Box } from "@mui/material";
import clsx from "clsx";
import { TitleContainer } from "../../components/Dashboard/TitleContainer";
import { PageTabs } from "../../components/Dashboard/PageTabs";
import { Tab } from "../../components/Dashboard/PageTabs/Tab";
import { UploadsGrid } from "../../components/Projects/UploadsGrid";

interface TrashPageProps {
  cookieUser: any;
  authorized: string;
  userToken: string;
}

const TRASH_PAGE_TABS = ["designs", "uploads"] as const;

const TrashPage: NextPage<TrashPageProps> = ({
  cookieUser,
  authorized,
  userToken,
}) => {
  const { t }: any = useTranslation("index");
  const i18nTrash = t("trashPage", { returnObjects: true });
  const i18n = t("designsPage", { returnObjects: true });
  const pagesDashboard = t("dashboard.sidebar", { returnObjects: true });
  const headerBtnPrimaryRef = React.useRef(null);

  const [tab, setTab] = useState<typeof TRASH_PAGE_TABS[number]>(
    TRASH_PAGE_TABS[0]
  );

  const trashPagination = usePaginatedEndpoint({
    elementsPerRequest: 10,
    url: "/user/templates/trash",
  });

  const trashUploadsPagination = usePaginatedEndpoint({
    elementsPerRequest: 10,
    url: "/uploads/trash",
    pageParamName: "page",
    itemsExtractor: (data) => data.uploads,
  });

  return !cookieUser ? (
    <AuthPage local={t} />
  ) : (
    <PageLayout userToken={userToken}>
      <DashboardLayout
        userToken={userToken}
        cookieUser={cookieUser}
        authorized={authorized ? true : false}
        searchPanel
        sidePanelData={pagesDashboard}
        sidePanelBaseUrl=""
        local={t}
        headerBtnPrimaryRef={headerBtnPrimaryRef}
      >
        <Head>
          <title>{i18nTrash.headTitle}</title>
        </Head>
        <div className={s.root}>
          <TitleContainer title={i18nTrash.title}>
            <div className={s.rowControls}>
              <PageTabs>
                {TRASH_PAGE_TABS.map((item: any, i: number) => (
                  <Tab
                    key={i}
                    onClick={() => setTab(item)}
                    currentTab={tab}
                    value={item}
                  >
                    {i18n.tabs[item]}
                  </Tab>
                ))}
              </PageTabs>
            </div>
          </TitleContainer>

          {tab === "designs" && (
            <DesignsGrid
              fetchData={trashPagination.fetchItems}
              isEmpty={trashPagination.isEmpty}
              isLoading={trashPagination.isLoading}
              isReachingEnd={trashPagination.isReachingEnd}
              numberOfSkeletonElements={
                trashPagination.numberOfSkeletonElements
              }
              templates={trashPagination.items}
              setTemplates={trashPagination.setItems}
              trash
            />
          )}

          {tab === "uploads" && (
            <UploadsGrid
              fetchData={trashUploadsPagination.fetchItems}
              isEmpty={trashUploadsPagination.isEmpty}
              isLoading={trashUploadsPagination.isLoading}
              isReachingEnd={trashUploadsPagination.isReachingEnd}
              numberOfSkeletonElements={
                trashUploadsPagination.numberOfSkeletonElements
              }
              uploads={trashUploadsPagination.items}
              setUploads={trashUploadsPagination.setItems}
              trash
            />
          )}
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
        "Dashboard",
      ])),
      cookieUser: !!req.cookies.user && (JSON.parse(req.cookies.user) || ""),
      userToken: !!req.cookies.user_token && (req.cookies.user_token || null),
    },
  };
}

export default TrashPage;
