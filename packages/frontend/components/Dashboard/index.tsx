import React, { useState } from "react";
import s from "./Dashboard.module.scss";
// import { useTranslation } from 'next-i18next'
import Box from "@mui/material/Box";
import clsx from "clsx";
import Head from "next/head";
import "swiper/css";
import "swiper/css/navigation";
import { Api } from "../../api";
import ContainerFluid from "../ContainerFluid";
import DashboardLayout from "../Layouts/DashboardLayout";

const DesignElementDropdownContent = dynamic(
  () => import("./DesignElements/DropdownContent"),
  {
    ssr: false,
  }
);

import dynamic from "next/dynamic";
import { useDispatch } from "react-redux";
import { SetFileDropdownAction } from "../../redux/actions";
import { RootState } from "../../redux/store";
import { usePaginatedEndpoint } from "../../utils/usePaginatedEndpoint";
import { useSelfClosingOverlay } from "../../utils/useSelfClosingOverlay";
import useTypedSelector from "../../utils/useTypedSelector";
import { DesignsGrid } from "../Projects/DesignsGrid";
import { DesignsMovedToTrashIsland } from "../Projects/DesignsMovedToTrashIsland";
import { QuickStartCategories } from "./QuickStartCategories";

interface DashboardProps {
  userToken: string;
  cookieUser: any;
  authorized: string;
  local: any;
}

const Dashboard: React.FC<React.PropsWithChildren<DashboardProps>> = ({
  userToken,
  cookieUser,
  authorized,
  local,
}) => {
  const dashboardLocal = local("dashboard", { returnObjects: true });
  const dispatch = useDispatch();

  const headerBtnPrimaryRef = React.useRef(null);

  const [copyTemplateItem, setCopyTemplateItem] = useState<any>(null);

  const templatesPagination = usePaginatedEndpoint({
    elementsPerRequest: 10,
    url: "/user/templates",
  });

  const trashDesignsOverlay = useSelfClosingOverlay();

  const [deletedTemplates, setDeletedTemplates] = useState<any[]>([]);

  const restoreTemplates = async (ids: string[]) => {
    await Api.patch(
      "/user/templates/restore/bulk",
      { ids },
      { headers: { Authorization: userToken } }
    );
  };

  const handleUndoMoveTemplatesToTrash = async () => {
    templatesPagination.setItems((value) => {
      return [...deletedTemplates, ...value];
    });

    trashDesignsOverlay.close();

    await restoreTemplates(deletedTemplates.map((item) => item._id));
  };

  const showDeletedTemplate = (item: any) => {
    setDeletedTemplates([item]);

    trashDesignsOverlay.open();
  };

  const fileDropdown = useTypedSelector(
    (state: RootState) => state.designReducer.fileDropdown
  );

  const handleCreateNewTemplate = () => {
    dispatch(
      SetFileDropdownAction(
        fileDropdown ? null : headerBtnPrimaryRef?.current ?? true
      )
    );
  };

  return (
    <DashboardLayout
      userToken={userToken}
      cookieUser={cookieUser}
      authorized={authorized ? true : false}
      searchPanel
      sidePanelData={dashboardLocal.sidebar}
      sidePanelBaseUrl=""
      local={local}
      headerBtnPrimaryRef={headerBtnPrimaryRef}
      containerClassName={s.disableMobilePadding}
    >
      <Head>
        <title>{local("globalTitle")}</title>
      </Head>

      <button
        className={s.create}
        onClick={() => dispatch(SetFileDropdownAction(true))}
      >
        {dashboardLocal.floatingCreate}
      </button>

      <div className={s.root}>
        <ContainerFluid className={s.disableDesktopPadding}>
          <Box className={s.startTitle}>{dashboardLocal.title}</Box>
        </ContainerFluid>
        <ContainerFluid className={s.quickStartCategories}>
          <QuickStartCategories />
        </ContainerFluid>
        <ContainerFluid
          className={clsx(s.disableDesktopPadding, s.designsContainer)}
        >
          <div className={s.rowControls}>
            <Box className={s.blockTitle}>{dashboardLocal.subTitle}</Box>
          </div>

          <DesignsGrid
            fetchData={templatesPagination.fetchItems}
            isEmpty={templatesPagination.isEmpty}
            isLoading={templatesPagination.isLoading}
            isReachingEnd={templatesPagination.isReachingEnd}
            numberOfSkeletonElements={
              templatesPagination.numberOfSkeletonElements
            }
            templates={
              copyTemplateItem
                ? [copyTemplateItem, ...templatesPagination.items]
                : templatesPagination.items
            }
            setTemplates={templatesPagination.setItems}
            setCopyTemplateItem={setCopyTemplateItem}
            copyTemplateItem={copyTemplateItem}
            onMoveToTrash={showDeletedTemplate}
            onCreateNewTemplateClick={handleCreateNewTemplate}
          />
        </ContainerFluid>
      </div>

      {trashDesignsOverlay.isOpen && (
        <DesignsMovedToTrashIsland
          onUndo={handleUndoMoveTemplatesToTrash}
          deletedTemplates={deletedTemplates}
        />
      )}
    </DashboardLayout>
  );
};

// @ts-ignore
export async function getServerSideProps({ req, res }) {
  return {
    props: {
      // ...await serverSideTranslations(req.cookies.locale || 'en', ['common', 'index']),
      // auth: req.cookies.Authorization || '',
    },
  };
}

export default Dashboard;
