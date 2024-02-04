import { paginationClasses, useMediaQuery } from "@mui/material";
import clsx from "clsx";
import type { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import {
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch } from "react-redux";
import { Api } from "../../api";
import AuthPage from "../../components/AuthPage";
import { PageTabs } from "../../components/Dashboard/PageTabs";
import { Tab } from "../../components/Dashboard/PageTabs/Tab";
import { SelectionMenu } from "../../components/Dashboard/SelectionMenu";
import { TitleContainer } from "../../components/Dashboard/TitleContainer";
import Dropdown from "../../components/Dropdown";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import PageLayout from "../../components/Layouts/PageLayout";
import { BaseUploadButton } from "../../components/Projects/BaseUploadButton";
import { DesignsGrid } from "../../components/Projects/DesignsGrid";
import { DesignsMovedToTrashIsland } from "../../components/Projects/DesignsMovedToTrashIsland";
import { UploadsGrid } from "../../components/Projects/UploadsGrid";
import { SetFileDropdownAction } from "../../redux/actions";
import { RootState } from "../../redux/store";
import { usePaginatedEndpoint } from "../../utils/usePaginatedEndpoint";
import { useSelfClosingOverlay } from "../../utils/useSelfClosingOverlay";
import useTypedSelector from "../../utils/useTypedSelector";
import {
  UploadedImage,
  useUploadToUserStorage,
} from "../../utils/useUploadToUserStorage";
import s from "./DesignsPage.module.scss";
import { useWindowEvent } from "../../utils/useWIndowEvent";
import { UploadsMovedToTrashIsland } from "../../components/Projects/UploadsMovedToTrashIsland";

interface DesignsPageProps {
  cookieUser: any;
  authorized: string;
  userToken: string;
}

const DESIGN_PAGE_TABS = ["designs", "uploads"] as const;

const DesignsPage: NextPage<DesignsPageProps> = ({
  cookieUser,
  authorized,
  userToken,
}) => {
  const isMobile = useMediaQuery("(max-width: 1000px)");
  const rootRef = useRef<null | HTMLDivElement>(null);
  const [tab, setTab] = useState<typeof DESIGN_PAGE_TABS[number]>(
    DESIGN_PAGE_TABS[0]
  );
  const [isMobileAddMenuOpen, setIsMobileAddMenuOpen] = useState(false);

  const dispatch = useDispatch();

  const fileDropdown = useTypedSelector(
    (state: RootState) => state.designReducer.fileDropdown
  );

  const { t }: any = useTranslation("index");
  const { t: tDashboard }: any = useTranslation("Dashboard");
  const pagesDashboard = t("dashboard.sidebar", { returnObjects: true });
  const i18n = t("designsPage", { returnObjects: true });

  const headerBtnPrimaryRef = useRef(null);

  const templatesPagination = usePaginatedEndpoint({
    elementsPerRequest: 10,
    url: "/user/templates",
  });

  const uploadsPagination = usePaginatedEndpoint({
    elementsPerRequest: 10,
    url: "/uploads",
    pageParamName: "page",
    itemsExtractor: (data) => data.uploads,
  });

  const { setItems: setUploads } = uploadsPagination;

  const handleUploadedImages = useCallback(
    (images: (UploadedImage | null)[]) => {
      setUploads((value) => {
        const copy = [...value];

        const clearImages = images.filter(
          (image) => !!image
        ) as UploadedImage[];

        copy.unshift(...clearImages);
        return copy;
      });
    },
    [setUploads]
  );

  const {
    enqueueFilesForUpload,
    imagesToUpload,
    uploadingFiles,
    finishingUploadFiles,
  } = useUploadToUserStorage({
    onUploaded: handleUploadedImages,
    skip: tab !== "uploads",
  });

  const handleFileUpload = (files: File[]) => {
    enqueueFilesForUpload(files);

    uploadsPagination.setIsEmpty(false);
    setTab("uploads");
    setIsMobileAddMenuOpen(false);
  };

  const handleCreateNewTemplate = () => {
    setIsMobileAddMenuOpen(false);

    dispatch(
      SetFileDropdownAction(
        fileDropdown ? null : headerBtnPrimaryRef?.current ?? true
      )
    );
  };

  const [copyTemplateItem, setCopyTemplateItem] = useState<any>(null);

  const uploadBtn = tab === "uploads" && (
    <BaseUploadButton onUpload={handleFileUpload} unstyled>
      <div className={s.addBtn}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 8H14"
            stroke="#F6F6F6"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M8 2V14"
            stroke="#F6F6F6"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </BaseUploadButton>
  );

  const mobileAddBtn = (
    <button className={s.addBtn} onClick={() => setIsMobileAddMenuOpen(true)}>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 8H14"
          stroke="#F6F6F6"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M8 2V14"
          stroke="#F6F6F6"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deletedTemplates, setDeletedTemplates] = useState<any[]>([]);
  const [deletedUploads, setDeletedUploads] = useState<any[]>([]);

  useEffect(() => {
    setSelectedIds([]);
  }, [tab, isMobile]);

  const showSelected = selectedIds.length > 0;

  const [bottomSize, setBottomSize] = useState({
    left: 0,
    right: 0,
  });

  const recomputeSize = useCallback(() => {
    if (!rootRef.current) return;

    setBottomSize({
      left: rootRef.current?.offsetLeft,
      right:
        window.innerWidth -
        (rootRef.current?.offsetLeft + rootRef.current?.clientWidth) -
        17,
    });
  }, []);

  useWindowEvent("resize", recomputeSize);

  useEffect(() => {
    recomputeSize();
  }, [recomputeSize]);

  const trashDesignsOverlay = useSelfClosingOverlay();
  const trashUploadsOverlay = useSelfClosingOverlay();

  const createToTrashHandler = (
    currentItems: any[],
    setDeleted: (value: SetStateAction<any[]>) => unknown,
    setItems: (value: SetStateAction<any[]>) => unknown,
    openOverlay: () => unknown,
    url: string
  ) => {
    return async () => {
      const ids = [...selectedIds];

      setDeleted(currentItems.filter((item) => ids.includes(item._id)));

      setSelectedIds([]);

      setItems((value) => {
        return value.filter((item) => !ids.includes(item._id));
      });

      openOverlay();

      await Api.patch(url, { ids }, { headers: { Authorization: userToken } });
    };
  };

  const handleMoveTemplatesToTrash = createToTrashHandler(
    templatesPagination.items,
    setDeletedTemplates,
    templatesPagination.setItems,
    trashDesignsOverlay.open,
    "/user/templates/trash/bulk"
  );

  const handleMoveUploadsToTrash = createToTrashHandler(
    uploadsPagination.items,
    setDeletedUploads,
    uploadsPagination.setItems,
    trashUploadsOverlay.open,
    "/uploads/trash"
  );

  const moveCurrentItemsToTrash = () => {
    if (tab === "designs") {
      handleMoveTemplatesToTrash();
    } else if (tab === "uploads") {
      handleMoveUploadsToTrash();
    }
  };

  const createShowDeletedIsland = (
    setDeleted: (value: SetStateAction<any[]>) => unknown,
    openOverlay: () => unknown
  ) => {
    return async (item: any) => {
      setDeleted([item]);

      setSelectedIds([]);

      openOverlay();
    };
  };

  const showDeletedTemplate = createShowDeletedIsland(
    setDeletedTemplates,
    trashDesignsOverlay.open
  );
  const handleShowDeletedUpload = createShowDeletedIsland(
    setDeletedUploads,
    trashUploadsOverlay.open
  );

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

  const restoreUploads = async (ids: string[]) => {
    await Api.patch(
      "/uploads/restore",
      { ids },
      { headers: { Authorization: userToken } }
    );
  };

  const handleUndoMoveUploadsToTrash = async () => {
    uploadsPagination.setItems((value) => {
      return [...deletedUploads, ...value];
    });

    trashUploadsOverlay.close();

    await restoreUploads(deletedUploads.map((item) => item._id));
  };

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
          <title>{i18n.headTitle}</title>
        </Head>
        <div className={clsx(s.root, s.actionsShown)} ref={rootRef}>
          <TitleContainer title={i18n.title}>
            <div className={s.rowControls}>
              <PageTabs>
                {DESIGN_PAGE_TABS.map((item: any, i: number) => (
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
              {!isMobile && uploadBtn}
              {isMobile && mobileAddBtn}
            </div>
          </TitleContainer>

          <div className={s.gridContainer}>
            {tab === "designs" && (
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
                onCreateNewTemplateClick={handleCreateNewTemplate}
                setCopyTemplateItem={setCopyTemplateItem}
                copyTemplateItem={copyTemplateItem}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
                onMoveToTrash={showDeletedTemplate}
              />
            )}

            {tab === "uploads" && (
              <UploadsGrid
                fetchData={uploadsPagination.fetchItems}
                isEmpty={uploadsPagination.isEmpty}
                isLoading={uploadsPagination.isLoading}
                isReachingEnd={uploadsPagination.isReachingEnd}
                numberOfSkeletonElements={
                  uploadsPagination.numberOfSkeletonElements
                }
                uploads={[...imagesToUpload, ...uploadsPagination.items]}
                setUploads={uploadsPagination.setItems}
                onUpload={handleFileUpload}
                uploadingFiles={uploadingFiles}
                finishingUploadFiles={finishingUploadFiles}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
                onMoveToTrash={handleShowDeletedUpload}
              />
            )}
          </div>

          {showSelected && (
            <SelectionMenu
              style={bottomSize}
              onClear={() => setSelectedIds([])}
              onDelete={moveCurrentItemsToTrash}
              selectedItems={selectedIds.length}
            />
          )}

          {isMobile && (
            <Dropdown
              anchor={isMobileAddMenuOpen}
              onClose={() => setIsMobileAddMenuOpen(false)}
              popperRef={null as any}
            >
              <div className={s.menuRoot}>
                <div className={clsx(s.header, s.xPadding)}>
                  <div className={s.titleContainer}>
                    <div className={s.title}>
                      {tDashboard("projects.menu.title")}
                    </div>
                  </div>
                </div>
                <div className={s.actions}>
                  <button
                    className={clsx(s.xPadding)}
                    onClick={handleCreateNewTemplate}
                  >
                    {tDashboard("projects.menu.newDesign")}
                    <svg
                      width="8"
                      height="14"
                      viewBox="0 0 8 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.30018 1.31385L6.95703 6.9707L1.21769 12.71"
                        stroke="#1F2128"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <BaseUploadButton
                    unstyled
                    className={clsx(s.xPadding)}
                    onUpload={handleFileUpload}
                  >
                    {tDashboard("projects.menu.upload")}
                  </BaseUploadButton>
                </div>
              </div>
            </Dropdown>
          )}
        </div>

        {trashDesignsOverlay.isOpen && (
          <DesignsMovedToTrashIsland
            onUndo={handleUndoMoveTemplatesToTrash}
            deletedTemplates={deletedTemplates}
          />
        )}

        {trashUploadsOverlay.isOpen && (
          <UploadsMovedToTrashIsland
            onUndo={handleUndoMoveUploadsToTrash}
            deletedUploads={deletedUploads}
          />
        )}
      </DashboardLayout>
    </PageLayout>
  );
};

// @ts-ignore
export async function getServerSideProps({ req, res, locale }) {
  // console.log(req.cookies.locale, locale);
  return {
    props: {
      ...(await serverSideTranslations(locale || req.cookies.locale || "en", [
        "common",
        "index",
        "AuthModal",
        "Checkout",
        "AdminPageAuth",
        "Dashboard",
        "design",
      ])),
      cookieUser: !!req.cookies.user && (JSON.parse(req.cookies.user) || ""),
      userToken: !!req.cookies.user_token && (req.cookies.user_token || null),
    },
  };
}

export default DesignsPage;
