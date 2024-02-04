import clsx from "clsx";
import { useRouter } from "next/router";
import { StoreType, createStore } from "polotno/model/store";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Api } from "../../api";
import Icon_Premium from "../../public/Icon_Premium.svg";
import Icon_Premium_Silver from "../../public/Icon_Premium_Silver.svg";
import {
  ChangeAuthFormAction,
  IncrementNumberOfChangesAction,
  SetCheckoutPlanDurationAction,
  SetProfileTooltipAction,
  ToggleAuthModalAction,
  ToggleCheckoutModalAction,
} from "../../redux/actions";
import { RootState } from "../../redux/store";
import gaEvent from "../../utils/gaEvent";
import s from "./Polotno.module.scss";
// @ts-ignore polotno issue
import { useMediaQuery } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from "polotno";
import { Workspace } from "polotno/canvas/workspace";
import {
  setTranslations,
  unstable_registerTransformerAttrs,
} from "polotno/config";
import { SidePanel } from "polotno/side-panel";
import { Toolbar } from "polotno/toolbar/toolbar";
import { ZoomButtons } from "polotno/toolbar/zoom-buttons";
import ProfileDropdown from "../../components/ProfileDropdown";
import autosave from "../../utils/design/autosave";
import setPolotnoI18n from "../../utils/design/setPolotnoI18n";
import usePageSizes from "../../utils/design/usePageSizes";
import { useTemporaryUserToken } from "../../utils/useTemporaryUserToken";
import useTypedSelector from "../../utils/useTypedSelector";
import BtnHover from "../BtnHover";
import BtnOutline from "../BtnOutline";
import UpgradeToProBar from "../Dashboard/UpgradeToProBar";
import DownloadDropdown from "./DownloadDropdown";
import FileDropdown from "./FileDropdown";
import Hint from "./Hint";
import SidePanelSections from "./SidePanelSections";
import "./StarElement";
import {
  AddPageBtn,
  ClonePageBtn,
  DeletePageBtn,
  MovePageDownBtn,
  MovePageUpBtn,
} from "./WorkspaceBtns";

const POLOTNO_SAVE_DEBOUNCE_TIME_MS = 2_000;
const POLOTNO_SAVE_MAX_EDIT_TIME_MS = 10_000;

interface PolotnoProps {
  userToken: string;
  templateId?: string;
  userTemplateId?: string;
  categoryId?: string;
}

const Pensil = ({ onClick }: any) => (
  <svg
    onClick={onClick}
    className={s.hoverEffect}
    width="17"
    height="17"
    viewBox="0 0 17 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.3571 15.612H9.14863M1 16L5.30655 14.3436C5.58201 14.2377 5.71974 14.1847 5.84859 14.1155C5.96305 14.0541 6.07216 13.9832 6.17479 13.9036C6.29033 13.8139 6.39467 13.7096 6.60336 13.5009L15.3571 4.74715C16.2143 3.88993 16.2143 2.50012 15.3571 1.64291C14.4999 0.785698 13.1101 0.785697 12.2529 1.64291L3.49913 10.3966C3.29044 10.6053 3.1861 10.7097 3.09644 10.8252C3.0168 10.9278 2.94589 11.0369 2.88445 11.1514C2.81528 11.2803 2.76231 11.418 2.65637 11.6934L1 16ZM1 16L2.59722 11.8473C2.71152 11.5501 2.76866 11.4015 2.86668 11.3335C2.95234 11.274 3.05834 11.2515 3.16078 11.2711C3.27799 11.2934 3.39056 11.406 3.61569 11.6311L5.36888 13.3843C5.59401 13.6095 5.70658 13.722 5.72896 13.8392C5.74852 13.9417 5.72603 14.0477 5.66655 14.1333C5.59849 14.2314 5.44991 14.2885 5.15274 14.4028L1 16Z"
      stroke="#242124"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Polotno: React.FC<PolotnoProps> = ({
  userToken,
  templateId,
  userTemplateId: propsUserTemplateId,
  categoryId,
}) => {
  const isSmallerFont = useMediaQuery("(max-width: 1440px)");
  const { t }: any = useTranslation("design");
  const i18n = t("content", { returnObjects: true });
  const i18nSidePanel = t("content.polotno.sidePanel", { returnObjects: true });
  const router = useRouter();
  const paramsCategoryId = router.query.category_id as string;
  const [store, setStore] = useState<StoreType | null>(null);
  const inputNameDefaultValue = i18n.input;
  const [designName, setDesignName] = useState<string>(inputNameDefaultValue);
  const [isLoadingSave, setIsLoadingSave] = useState<boolean>(false);
  const [categories, setCategories] = useState([]);
  const [pageWidth, pageHeight] = usePageSizes();
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.mainReducer.user);
  const [changeTitle, setChangeTitle] = useState(false);
  const defaultSection = useSelector(
    (state: RootState) => state.designReducer.initialSection
  );
  const sidePanelDefaultOpen = useSelector(
    (state: RootState) => state.designReducer.sidePanelDefaultOpen
  );
  const [defaultSectionIsSet, setDefaultSectionIsSet] =
    useState<boolean>(false);
  const [userTemplateId, setUserTemplateId] = useState(
    propsUserTemplateId ?? (router.query.type as string)
  );
  const [hasChanges, setHasChanges] = useState(false);
  const temporaryUserToken = useTemporaryUserToken(userToken);

  // used for hints
  const sidePanelRef = useRef<any>(null);
  const sideTabsRef = useRef<any>(null);
  const logInBtnRef = useRef<any>(null);

  // used to control the dropdown <FileDropdown />
  const [fileTooltip, setFileTooltip] = useState<any>(null);
  const fileTooltipRef = useRef<any>(null);
  const fileTooltipBtnRef = useRef<any>(null);

  // used to control the dropdown <DownloadDropdown />
  const [downloadTooltip, setDownloadTooltip] = useState<any>(null);
  const downloadTooltipRef = useRef<any>(null);
  const downloadTooltipBtnRef = useRef<any>(null);

  // used to control the dropdown <DownloadDropdown /> for resizing
  const [resizeTooltip, setResizeTooltip] = useState<any>(null);
  const resizeTooltipRef = useRef<any>(null);
  const resizeTooltipBtnRef = useRef<any>(null);

  // used to control the dropdown <DownloadDropdown /> for new design
  const [newDesignTooltip, setNewDesignTooltip] = useState<any>(null);
  const newDesignTooltipRef = useRef<any>(null);

  // used to control the dropdown <DownloadDropdown /> for phone users
  const [mobileTooltip, setMobileTooltip] = useState<any>(null);
  const mobileTooltipRef = useRef<any>(null);
  const mobileTooltipBtnRef = useRef<any>(null);
  // const downloadTooltipBtnRefMobile = useRef(null)

  const [profileTooltip, setProfileTooltip] = useState<any>(null);
  const profileTooltipRef = useRef<any>(null);
  const profileTooltipBtnRef = useRef<any>(null);

  const [isOpenMobileDrawer, setIsOpenMobileDrawer] = useState<boolean>(false);
  const [isOpenDownloadDrawer, setIsOpenDownloadDrawer] =
    useState<boolean>(false);

  const hintStage = useSelector(
    (state: RootState) => state.designReducer.hintStage
  );

  // when user template is created change browser URL, no rerendering or refetching is needed
  useEffect(() => {
    if (router.query.type === userTemplateId) return;

    let link = `/design/${userTemplateId}`;

    if (router.locale !== "en") {
      link = `/${router.locale}` + link;
    }

    if (categoryId) {
      link += `/${categoryId}`;
    }

    if (Object.keys(router.query).length > 0) {
      const params = new URLSearchParams(router.query as any).toString();
      link += `?${params}`;
    }

    window.history.replaceState(null, "", link);
  }, [userTemplateId, router, categoryId]);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        fileTooltipRef.current &&
        !fileTooltipRef.current.contains(event.target) &&
        !fileTooltipBtnRef.current.contains(event.target) &&
        !document.querySelector(".modal")
      ) {
        setFileTooltip(false);
      }

      if (
        resizeTooltipRef.current &&
        !resizeTooltipRef.current.contains(event.target) &&
        !resizeTooltipBtnRef.current.contains(event.target) &&
        !document.querySelector(".modal")
      ) {
        setResizeTooltip(false);
      }

      if (
        newDesignTooltipRef.current &&
        !newDesignTooltipRef.current.contains(event.target) &&
        !document.querySelector(".modal")
      ) {
        setNewDesignTooltip(false);
      }

      if (
        profileTooltipRef.current &&
        !profileTooltipRef.current.contains(event.target) &&
        !profileTooltipBtnRef.current.contains(event.target)
      ) {
        setProfileTooltip(false);
      }
      if (
        mobileTooltipRef.current &&
        !mobileTooltipRef.current.contains(event.target) &&
        !mobileTooltipBtnRef.current.contains(event.target)
      ) {
        setMobileTooltip(false);
      }

      if (
        downloadTooltipRef.current &&
        !downloadTooltipRef.current.contains(event.target) &&
        !downloadTooltipBtnRef.current.contains(event.target) &&
        !document.querySelector(".modal")
      ) {
        setDownloadTooltip(false);
      }
    };

    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  // skipp
  useEffect(() => {
    setPolotnoI18n(i18n.polotno, setTranslations);

    if (sideTabsRef.current) return;

    sideTabsRef.current = document.querySelector(
      ".polotno-side-tabs-container"
    );
  }, [i18n.polotno]);

  useEffect(() => {
    const storeLib = createStore({
      key: "5WZgkgr7CZj0XSGxxdjj",
      showCredit: false,
    });

    storeLib.setSize(
      Number(router.query.width) || 1080,
      Number(router.query.height) || 1080
    );

    (async () => {
      await storeLib.waitLoading();

      const axiosHeaders = {
        headers: {
          Authorization: userToken,
        },
      };

      let jsonToLoadToStore = null;
      if (userTemplateId && userToken) {
        // user template json request
        const result = await Api.get(
          `/user/templates/${userTemplateId}`,
          axiosHeaders
        );
        jsonToLoadToStore = result.data;

        // user template json request
        const metaResult = await Api.get(
          `/user/templates/meta/${userTemplateId}`,
          axiosHeaders
        );

        setDesignName(metaResult.data.title);
      } else if (userTemplateId && temporaryUserToken) {
        // user template json request
        try {
          const result = await Api.get(
            `/user/templates/non/${userTemplateId}?user=${temporaryUserToken}`
          );

          jsonToLoadToStore = result.data;
        } catch (error) {
          router.replace("/design");
          console.log(error);
        }
      } else if (templateId) {
        const jsonLocationResult = await Api.get(
          `/templates/single/${templateId}`
        );
        const jsonUrl = jsonLocationResult.data.data;

        if (
          jsonLocationResult.data.title &&
          designName === inputNameDefaultValue
        ) {
          setDesignName(jsonLocationResult.data.title);
        }

        const result = await Api.get(jsonUrl);

        jsonToLoadToStore = result.data;
      } else {
        storeLib.addPage();
      }

      if (jsonToLoadToStore) {
        storeLib.loadJSON(jsonToLoadToStore);
      }

      try {
        const categoriesResult = await Api.get("/categories");
        setCategories(categoriesResult.data);
      } catch (e) {
        console.log(e);
      }
    })();

    setStore(storeLib);
  }, []);

  const exitingFunction = useCallback(() => {
    async () => {
      await autosave(
        store,
        userTemplateId,
        userToken,
        isLoadingSave,
        setIsLoadingSave,
        designName,
        temporaryUserToken,
        setUserTemplateId,
        { categoryId: paramsCategoryId }
      );
    };
  }, [
    designName,
    isLoadingSave,
    paramsCategoryId,
    store,
    temporaryUserToken,
    userTemplateId,
    userToken,
  ]);

  // save before route change
  useEffect(() => {
    if (hasChanges) {
      router.events.on("routeChangeStart", exitingFunction);
    } else {
      router.events.off("routeChangeStart", exitingFunction);
    }

    return () => {
      router.events.off("routeChangeStart", exitingFunction);
    };
  }, [exitingFunction, hasChanges, router.events]);

  // prevent closing the window when has unsaved changes
  useEffect(() => {
    const preventCloseListener = () => {
      return true;
    };

    if (hasChanges) {
      window.onbeforeunload = preventCloseListener;
    } else {
      window.onbeforeunload = null;
    }

    return () => {
      window.onbeforeunload = null;
    };
  }, [hasChanges]);

  useEffect(() => {
    if (!store) return;

    let timeoutId: NodeJS.Timeout | null = null;
    let lastSave: Date = new Date();
    let resetLastSave = true;

    // request saving operation on any changes
    const dispose = store.on("change", () => {
      if (resetLastSave) {
        lastSave = new Date();
        resetLastSave = false;
      }

      if (isLoadingSave) return;

      const exceededMaxEditTime =
        lastSave.getTime() + POLOTNO_SAVE_MAX_EDIT_TIME_MS <
        new Date().getTime();

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const performSave = () => {
        timeoutId = null;

        autosave(
          store,
          userTemplateId,
          userToken,
          isLoadingSave,
          setIsLoadingSave,
          designName,
          temporaryUserToken,
          setUserTemplateId,
          { categoryId: paramsCategoryId }
        );

        lastSave = new Date();

        setHasChanges(false);
      };

      setHasChanges(true);
      if (exceededMaxEditTime) {
        performSave();
        return;
      }

      // schedule saving to the backend
      timeoutId = setTimeout(() => {
        performSave();
        resetLastSave = true;
      }, POLOTNO_SAVE_DEBOUNCE_TIME_MS);
    });

    return () => {
      timeoutId && clearTimeout(timeoutId);
      dispose?.();
    };
  }, [
    store,
    isLoadingSave,
    temporaryUserToken,
    userTemplateId,
    userToken,
    designName,
    paramsCategoryId,
  ]);

  // in order to open the sidePanel on mobile devices (always open on PC)
  useEffect(() => {
    store &&
      !defaultSectionIsSet &&
      sidePanelDefaultOpen &&
      (store.openSidePanel(defaultSection), setDefaultSectionIsSet(true));
  }, [defaultSection, defaultSectionIsSet, sidePanelDefaultOpen, store]);

  useEffect(() => {
    if (!store) return;

    let accumulated = 0;
    let timeoutId: null | NodeJS.Timeout = null;
    const dispose = store.on("change", () => {
      accumulated++;
      timeoutId && clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        dispatch(IncrementNumberOfChangesAction(accumulated));
        accumulated = 0;
      }, 200);
    });

    return () => {
      dispose?.();
      timeoutId && clearTimeout(timeoutId);
    };
  }, [dispatch, store]);

  const handleWatermark = useCallback(
    (store: StoreType) => {
      for (let x = 0; x < store.pages.length; x++) {
        const watermark = store.pages[x].children.find(
          (el) => el.name == "watermark"
        );
        if (user.plan === "free" || user.plan == null) {
          if (!watermark) {
            store.pages[x].addElement({
              type: "image",
              x: store.width - 166,
              y: store.height - 126,
              src: "/design/watermark.png",
              name: "watermark",
              width: 136,
              height: 96,
              keepRatio: true,
              selectable: false,
              draggable: false,
              showInExport: true,
              resizeable: false,
              contentEditable: false,
              removeable: false,
              alwaysOnTop: true,
            });
          }
        } else {
          const watermark = store.pages[x].children.find(
            (el) => el.name == "watermark"
          );
          if (watermark) {
            store.deleteElements([watermark.id]);
          }
        }
      }
    },
    [user]
  );

  useEffect(() => {
    if (!store) return;
    handleWatermark(store);

    const dispose = store.on("change", () => {
      handleWatermark(store);
    });

    return () => {
      dispose?.();
    };
  }, [store, handleWatermark]);

  const onClickUpgrade = () => {
    gaEvent("view_checkout_form");
    dispatch(ToggleCheckoutModalAction(true));
    dispatch(SetCheckoutPlanDurationAction("monthly"));
    // activated when you click on UpgradetoPro via the HeaderDashboard
    dispatch(SetProfileTooltipAction(null));
  };

  const onClickSave = async () => {
    if (!userToken) {
      dispatch(ChangeAuthFormAction("signUp"));
      dispatch(ToggleAuthModalAction(null));
      return;
    }

    if (isLoadingSave) return;
    setHasChanges(false);

    await autosave(
      store,
      String(router.query.type),
      userToken,
      isLoadingSave,
      setIsLoadingSave,
      designName,
      undefined,
      undefined,
      { categoryId: paramsCategoryId }
    );
  };

  const updateTitle = async (title: string = designName) => {
    if (!userToken || !userTemplateId) return;
    const axiosBody = JSON.stringify({
      title,
    });
    // console.log(axiosBody);

    const axiosHeaders = {
      headers: {
        Authorization: userToken,
      },
    };

    await Api.patch(
      `user/templates/${userTemplateId}/title`,
      axiosBody,
      axiosHeaders
    )
      .then((result) => {
        if (result.status === 200) {
          // setChangesSaved(true);
          console.log("done");
        } else {
          console.log("Something went wrong, please try again.");
        }
      })
      .catch((err) => {
        console.log(err);
        // setChangesSaved(false);
        // setError("Something went wrong, please try again.");
      });
  };

  const handleClick = () => {
    if (changeTitle) {
      updateTitle();
    }

    setChangeTitle(!changeTitle);
  };

  // change the shape that appears when focusing on an element inside the canvas
  unstable_registerTransformerAttrs("text", {
    // this makes circles instead of squares
    anchorCornerRadius: 10,
    anchorStroke: "#2469F6",
    borderStroke: "#2469F6",
    // anchorSize: '10',
  });

  return (
    store && (
      <div style={{ height: pageHeight + "px" }}>
        <div className={s.header}>
          <div className={s.wrapperLeft}>
            <BtnHover onClickRedirect="/" className={clsx(s.link, s.pc)}>
              <svg
                width="9"
                height="14"
                viewBox="0 0 9 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.66431 13.2122L1.45215 7L7.75489 0.697259"
                  stroke="#1F2128"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              {i18n.home}
            </BtnHover>

            <BtnHover
              ref={fileTooltipBtnRef}
              className={clsx(s.file, s.link, "unselectable")}
              focus={!!fileTooltip}
              onClick={(event: any) => {
                fileTooltip
                  ? setFileTooltip(null)
                  : setFileTooltip(event.currentTarget);
              }}
            >
              {i18n.file.file}
            </BtnHover>
            <BtnHover
              ref={resizeTooltipBtnRef}
              className={clsx(s.file, s.link, "unselectable")}
              focus={!!resizeTooltip}
              onClick={(event: any) => {
                resizeTooltip
                  ? setResizeTooltip(null)
                  : setResizeTooltip(event.currentTarget);
              }}
            >
              {/* {i18n.file.file} */}
              {user.plan === "free" || user.email === null ? (
                <svg
                  className={s.crown}
                  width="17"
                  height="17"
                  viewBox="7 7 25 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.40499 18.445C9.24069 18.0616 9.59037 17.6574 9.9934 17.7649L16.0952 19.3921C16.3294 19.4545 16.5747 19.34 16.6772 19.1204L19.5469 12.9709C19.7265 12.5862 20.2735 12.5862 20.4531 12.9709L23.3228 19.1204C23.4253 19.34 23.6706 19.4545 23.9048 19.3921L30.0066 17.7649C30.4096 17.6574 30.7593 18.0616 30.595 18.445L26.6299 27.697C26.5511 27.8808 26.3703 28 26.1703 28H13.8297C13.6297 28 13.4489 27.8808 13.3701 27.697L9.40499 18.445Z"
                    fill="#FFBE0B"
                  />
                </svg>
              ) : (
                <svg
                  className={s.crown}
                  width="17"
                  height="17"
                  viewBox="7 7 25 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.40499 18.445C9.24069 18.0616 9.59037 17.6574 9.9934 17.7649L16.0952 19.3921C16.3294 19.4545 16.5747 19.34 16.6772 19.1204L19.5469 12.9709C19.7265 12.5862 20.2735 12.5862 20.4531 12.9709L23.3228 19.1204C23.4253 19.34 23.6706 19.4545 23.9048 19.3921L30.0066 17.7649C30.4096 17.6574 30.7593 18.0616 30.595 18.445L26.6299 27.697C26.5511 27.8808 26.3703 28 26.1703 28H13.8297C13.6297 28 13.4489 27.8808 13.3701 27.697L9.40499 18.445Z"
                    fill="#E3E3E3"
                  />
                </svg>
              )}
              {i18nSidePanel.resize}
            </BtnHover>
            <div
              className={clsx(
                s.cloud,
                isLoadingSave && s.saving,
                user.email && s.authorized,
                "unselectable"
              )}
              onClick={onClickSave}
            >
              <svg
                width="29"
                height="18"
                viewBox="0 0 29 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.67893 3.05834C6.74004 4.11115 6.22257 5.59535 6.22257 7.29395H5.93191C3.45369 7.40796 1.47949 9.45325 1.47949 11.9596C1.47949 14.5392 3.57064 16.6304 6.15021 16.6304V16.6328H20.298V16.6301C21.6326 16.6301 22.9884 16.2228 23.998 15.4992C25.0004 14.7807 25.6388 13.7721 25.6388 12.5393C25.6388 11.154 25.374 9.4703 24.2993 8.24722C23.2519 7.05512 21.3267 6.1834 17.7356 6.63494L17.7191 6.63941L17.7184 6.63711L17.7177 6.6372L17.717 6.63168C16.7218 2.9598 14.3517 1.35352 11.8113 1.35352C9.99343 1.35352 8.61138 2.01276 7.67893 3.05834ZM20.4137 17.6292C21.8982 17.6065 23.414 17.1481 24.5805 16.312C25.7846 15.449 26.6388 14.1623 26.6388 12.5393C26.6388 11.069 26.3658 9.08404 25.0505 7.58716C23.8114 6.17689 21.7424 5.30244 18.4312 5.55896C17.2089 2.06643 14.6587 0.353516 11.8113 0.353516C9.73271 0.353516 8.07041 1.11691 6.9326 2.39276C5.99059 3.44907 5.43174 4.82942 5.27107 6.35667C2.5567 6.77914 0.479492 9.12681 0.479492 11.9596C0.479492 15.0445 2.9428 17.5541 6.00976 17.6287V17.6328H20.4137V17.6292Z"
                  fill="#1F2128"
                />
                <circle
                  cx="24.2489"
                  cy="13.6268"
                  r="4.0057"
                  fill={
                    hasChanges
                      ? "#ED695E"
                      : isLoadingSave
                      ? "#F4BE4F"
                      : "#61C454"
                  }
                />
              </svg>

              <span>
                {!userTemplateId || hasChanges
                  ? i18n.unsaved
                  : isLoadingSave
                  ? i18n.saving
                  : i18n.saved}
              </span>
            </div>
          </div>
          {pageWidth >= 768 && user.uuid && (
            <>
              {changeTitle ? (
                <div className={s.nameInput}>
                  <form onSubmit={handleClick}>
                    <input
                      onChange={(e: any) => setDesignName(e.target.value)}
                      defaultValue={designName}
                      onBlur={handleClick}
                      autoFocus={true}
                    />
                  </form>
                </div>
              ) : (
                <div className={s.check}>
                  <p className={s.titleName} onClick={handleClick}>
                    <span>{designName}</span>
                  </p>
                  <div
                    className={s.pensilHolder}
                    onClick={() => {
                      setChangeTitle(!changeTitle);
                    }}
                  >
                    <Pensil />
                  </div>
                </div>
              )}
            </>
          )}

          <div className={s.btnWrapper}>
            {user.email === null && (
              <div className={s.logInBtn}>
                <BtnOutline
                  reff={logInBtnRef}
                  variant="root"
                  onClick={() => {
                    dispatch(ToggleAuthModalAction(null)),
                      dispatch(ChangeAuthFormAction("logIn"));
                  }}
                >
                  {i18n.logIn}
                </BtnOutline>
              </div>
            )}
            {pageWidth >= 768 ? (
              <>
                {user.plan === "free" &&
                  (pageWidth >= 1024 ? (
                    <div className={s.upgradeBtn}>
                      <UpgradeToProBar
                        remainingDownloads={user.remainingDownloads}
                        br={false}
                      />
                    </div>
                  ) : (
                    <div className={s.laptopItem}>
                      <Image
                        src={Icon_Premium}
                        alt="icon"
                        onClick={onClickUpgrade}
                      />
                    </div>
                  ))}
                {pageWidth >= 1024 ? (
                  <div
                    className={clsx(
                      s.downloadButton,
                      !user.email && s.downloadButtonUnlogged
                    )}
                  >
                    <BtnOutline
                      variant="yellow"
                      reff={downloadTooltipBtnRef}
                      onClick={(event: any) => {
                        downloadTooltip
                          ? setDownloadTooltip(null)
                          : setDownloadTooltip(event.currentTarget);
                      }}
                    >
                      <div className={s.downloadWrapper}>{i18n.download}</div>
                    </BtnOutline>
                  </div>
                ) : (
                  <svg
                    ref={downloadTooltipBtnRef}
                    onClick={(event: any) => {
                      downloadTooltip
                        ? setDownloadTooltip(null)
                        : setDownloadTooltip(event.currentTarget);
                    }}
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.5 11.5V12.5C16.5 13.9001 16.5 14.6002 16.2275 15.135C15.9878 15.6054 15.6054 15.9878 15.135 16.2275C14.6002 16.5 13.9001 16.5 12.5 16.5H5.5C4.09987 16.5 3.3998 16.5 2.86502 16.2275C2.39462 15.9878 2.01217 15.6054 1.77248 15.135C1.5 14.6002 1.5 13.9001 1.5 12.5V11.5M13.1667 7.33333L9 11.5M9 11.5L4.83333 7.33333M9 11.5V1.5"
                      stroke="#36373C"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </>
            ) : (
              <div className={s.mobileWrapper}>
                <div className={s.mobileItem}>
                  <svg
                    ref={mobileTooltipBtnRef}
                    onClick={(event: any) => {
                      isOpenMobileDrawer
                        ? setIsOpenMobileDrawer(false)
                        : setIsOpenMobileDrawer(true);
                    }}
                    width="32"
                    height="32"
                    viewBox="78 53 26 7"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M84.1973 58.1605C83.6373 58.1605 83.1573 57.9705 82.7573 57.5905C82.3573 57.1905 82.1573 56.6905 82.1573 56.0905C82.1573 55.5105 82.3573 55.0305 82.7573 54.6505C83.1573 54.2505 83.6373 54.0505 84.1973 54.0505C84.7573 54.0505 85.2273 54.2405 85.6073 54.6205C85.9873 55.0005 86.1773 55.4905 86.1773 56.0905C86.1773 56.6905 85.9773 57.1905 85.5773 57.5905C85.1973 57.9705 84.7373 58.1605 84.1973 58.1605ZM90.9942 58.1605C90.4342 58.1605 89.9542 57.9705 89.5542 57.5905C89.1542 57.1905 88.9542 56.6905 88.9542 56.0905C88.9542 55.5105 89.1542 55.0305 89.5542 54.6505C89.9542 54.2505 90.4342 54.0505 90.9942 54.0505C91.5542 54.0505 92.0242 54.2405 92.4042 54.6205C92.7842 55.0005 92.9742 55.4905 92.9742 56.0905C92.9742 56.6905 92.7742 57.1905 92.3742 57.5905C91.9942 57.9705 91.5342 58.1605 90.9942 58.1605ZM97.7911 58.1605C97.2311 58.1605 96.7511 57.9705 96.3511 57.5905C95.9511 57.1905 95.7511 56.6905 95.7511 56.0905C95.7511 55.5105 95.9511 55.0305 96.3511 54.6505C96.7511 54.2505 97.2311 54.0505 97.7911 54.0505C98.3511 54.0505 98.8211 54.2405 99.2011 54.6205C99.5811 55.0005 99.7711 55.4905 99.7711 56.0905C99.7711 56.6905 99.5711 57.1905 99.1711 57.5905C98.7911 57.9705 98.3311 58.1605 97.7911 58.1605Z" />
                  </svg>
                </div>
                <div
                  className={clsx(
                    s.mobileItem,
                    user.email == null && s.emptyMobileCrown
                  )}
                >
                  {user.plan === "free" ? (
                    <Image
                      src={Icon_Premium}
                      alt="icon"
                      onClick={onClickUpgrade}
                    />
                  ) : (
                    <Image src={Icon_Premium_Silver} alt="icon" />
                  )}
                </div>

                <div className={s.mobileItem}>
                  {" "}
                  <svg
                    ref={downloadTooltipBtnRef}
                    onClick={() => {
                      isOpenDownloadDrawer
                        ? setIsOpenDownloadDrawer(false)
                        : setIsOpenDownloadDrawer(true);
                    }}
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.5 11.5V12.5C16.5 13.9001 16.5 14.6002 16.2275 15.135C15.9878 15.6054 15.6054 15.9878 15.135 16.2275C14.6002 16.5 13.9001 16.5 12.5 16.5H5.5C4.09987 16.5 3.3998 16.5 2.86502 16.2275C2.39462 15.9878 2.01217 15.6054 1.77248 15.135C1.5 14.6002 1.5 13.9001 1.5 12.5V11.5M13.1667 7.33333L9 11.5M9 11.5L4.83333 7.33333M9 11.5V1.5"
                      stroke="#36373C"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            )}
            {sidePanelRef.current && hintStage == (templateId ? 0 : 1) && (
              <Hint
                placement="right-start"
                arrowPosition="left"
                anchorEl={sidePanelRef}
                offsetX={12}
                offsetY={134}
                firstStage={templateId ? 2 : 1}
              />
            )}
            {sideTabsRef.current && hintStage == (templateId ? 1 : 2) && (
              <Hint
                placement="right-start"
                arrowPosition="left"
                anchorEl={sideTabsRef}
                offsetX={12}
                offsetY={294}
                firstStage={templateId ? 2 : 1}
              />
            )}
            {sideTabsRef.current && hintStage == (templateId ? 2 : 3) && (
              <Hint
                placement="right-start"
                arrowPosition="left"
                anchorEl={sideTabsRef}
                offsetX={12}
                offsetY={69}
                firstStage={templateId ? 2 : 1}
              />
            )}
            {sideTabsRef.current && hintStage == (templateId ? 3 : 4) && (
              <Hint
                placement="top-end"
                arrowPosition="left"
                anchorEl={logInBtnRef}
                offsetX={0}
                offsetY={-4}
                firstStage={templateId ? 2 : 1}
              />
            )}
            <FileDropdown
              designName={designName}
              userTemplateId={userTemplateId}
              onCopyClick={() => setFileTooltip(false)}
              onDesignNameChange={setDesignName}
              onDesignNameSubmit={updateTitle}
              fileTooltip={fileTooltip}
              fileTooltipRef={fileTooltipRef}
              categories={categories}
              onClickDownload={() => {
                setDownloadTooltip(downloadTooltipBtnRef.current),
                  setFileTooltip(false);
              }}
              offsetTop={4}
              offsetLeft={isSmallerFont ? -7 : 0}
              designMode={true}
              forDesign={true}
              userToken={userToken}
              templateId={templateId}
              onSaveClick={() => {
                onClickSave();
                setFileTooltip(false);
              }}
            />
            <div className={clsx(!resizeTooltip && s.emptyDiv)}>
              <FileDropdown
                designName={designName}
                userTemplateId={userTemplateId}
                onCopyClick={() => setFileTooltip(false)}
                onDesignNameChange={setDesignName}
                onDesignNameSubmit={updateTitle}
                fileTooltip={resizeTooltip}
                fileTooltipRef={resizeTooltipRef}
                categories={categories}
                store={store}
                onClickDownload={() => {
                  setDownloadTooltip(downloadTooltipBtnRef.current),
                    setFileTooltip(false);
                }}
                initialWindow="resize"
                forDesign={true}
                designMode={true}
                goBackBtn={false}
                offsetTop={4}
                offsetLeft={isSmallerFont ? 7 : 4}
              />
            </div>
            <FileDropdown
              designName={designName}
              userTemplateId={userTemplateId}
              onCopyClick={() => setFileTooltip(false)}
              onDesignNameChange={setDesignName}
              onDesignNameSubmit={updateTitle}
              fileTooltip={newDesignTooltip}
              fileTooltipRef={newDesignTooltipRef}
              categories={categories}
              onClickDownload={() => {
                setDownloadTooltip(downloadTooltipBtnRef.current),
                  setFileTooltip(false);
              }}
              initialWindow="categories"
              forDesign={true}
              designMode={true}
              goBackBtn={false}
            />
            {pageWidth <= 768 && (
              <FileDropdown
                designName={designName}
                userTemplateId={userTemplateId}
                onCopyClick={() => setFileTooltip(false)}
                onDesignNameChange={setDesignName}
                onDesignNameSubmit={updateTitle}
                fileTooltip={mobileTooltip}
                fileTooltipRef={mobileTooltipRef}
                categories={categories}
                onClickDownload={() => {
                  setDownloadTooltip(downloadTooltipBtnRef.current),
                    setFileTooltip(false);
                }}
                designMode={true}
                goBackBtn={true}
                store={store}
                isOpenDrawer={isOpenMobileDrawer}
                setIsOpenDrawer={setIsOpenMobileDrawer}
                isOpenDownloadDrawer={isOpenDownloadDrawer}
                setIsOpenDownloadDrawer={setIsOpenDownloadDrawer}
                mobile={true}
              />
            )}
            <DownloadDropdown
              store={store}
              downloadName={designName}
              downloadTooltip={downloadTooltip}
              downloadTooltipRef={downloadTooltipRef}
              isOpenDrawer={isOpenDownloadDrawer}
              setIsOpenDrawer={setIsOpenDownloadDrawer}
              mobile={pageWidth <= 768 ? true : false}
            />
            {user.email && pageWidth >= 1024 && (
              <>
                <div
                  ref={profileTooltipBtnRef}
                  className={s.avatar}
                  onClick={(event: any) => {
                    profileTooltip
                      ? setProfileTooltip(null)
                      : setProfileTooltip(event.currentTarget);
                  }}
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt="profile image" />
                  ) : (
                    <Skeleton variant="circular" width="100%" height="100%" />
                  )}
                </div>
                <ProfileDropdown
                  profileTooltip={profileTooltip}
                  profileTooltipRef={profileTooltipRef}
                  offsetRight={20}
                />
              </>
            )}
          </div>
        </div>

        <div
          style={{
            height: `calc(100% - ${pageWidth > 768 ? 56 : 48}px)`,
          }}
        >
          <PolotnoContainer className={s.polotnoContainer}>
            <SidePanelWrap>
              <div
                ref={sidePanelRef}
                className={clsx(s.sidePanelWrap, "bp4-dark")}
              >
                <SidePanel
                  store={store}
                  defaultSection={defaultSection}
                  // @ts-ignore
                  sections={SidePanelSections()}
                />
              </div>
            </SidePanelWrap>
            <WorkspaceWrap>
              <div className={s.toolbar}>
                <ZoomButtons store={store} />
                <Toolbar store={store} />
              </div>
              {store.pages.length > 0 && (
                <Workspace
                  store={store}
                  backgroundColor="#F8F9FC"
                  components={{
                    // @ts-ignore
                    PageControls: ({ width, height, xPadding, yPadding }) => (
                      <div
                        className={s.workspaceBtnsWrap}
                        style={{
                          top: yPadding - 39 + "px",
                          right: xPadding + "px",
                        }}
                      >
                        <MovePageUpBtn store={store} />
                        <MovePageDownBtn store={store} />
                        <AddPageBtn store={store} />
                        <ClonePageBtn store={store} />
                        <DeletePageBtn store={store} />
                      </div>
                    ),
                  }}
                />
              )}
            </WorkspaceWrap>
          </PolotnoContainer>
        </div>

        <svg display="none">
          <symbol id="paper" viewBox="0 0 17 17">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6.17741 1.03443C6.06473 1.07923 5.92228 1.22025 5.85275 1.35586C5.82064 1.41849 5.20341 3.10228 4.48109 5.09761C3.24798 8.50403 3.1679 8.7384 3.16937 8.93697C3.17106 9.17032 3.22598 9.29051 3.39553 9.43186C3.70854 9.69277 4.17658 9.58563 4.36647 9.2096C4.39467 9.15376 4.96092 7.60263 5.62483 5.76266C6.28872 3.9227 6.83774 2.40784 6.84487 2.39633C6.85473 2.38035 15.0174 3.98156 15.051 4.00606C15.067 4.01767 14.319 6.30112 13.8622 7.63549C12.3763 11.9757 11.7882 13.3063 10.973 14.1729C10.5737 14.5975 10.1986 14.8343 9.65886 15.0027C8.95867 15.2212 8.38601 15.1027 7.98119 14.6555C7.80575 14.4617 7.60991 14.0666 7.53364 13.7524C7.47124 13.4954 7.40483 12.8598 7.41944 12.6593L7.43008 12.5132L3.85102 11.0656C1.88253 10.2695 0.240487 9.61003 0.202029 9.6002C0.140208 9.58439 0.127974 9.60153 0.0965438 9.74808C-0.0356539 10.3644 -0.0317494 11.1293 0.106175 11.6469C0.294954 12.3553 0.737164 12.9767 1.32117 13.3541C1.57421 13.5177 7.25497 16.0992 7.68631 16.2466C8.3159 16.4619 8.84251 16.5031 9.45385 16.3852C11.4125 16.0072 12.5553 14.8176 13.6706 11.9954C14.1675 10.738 15.1914 7.82076 15.8517 5.78088C16.592 3.49422 16.5944 3.48387 16.4484 3.20744C16.2931 2.91337 16.5945 2.98808 11.3437 1.94227C8.52238 1.38036 6.53281 0.998799 6.43058 1C6.33606 1.00114 6.22215 1.01663 6.17741 1.03443Z"
            />
          </symbol>

          <symbol id="logo" viewBox="0 0 17 18">
            <circle cx="2.8877" cy="3.0835" r="2.1123" strokeWidth="1.2" />
            <circle cx="8.50098" cy="3.0835" r="2.1123" strokeWidth="1.2" />
            <circle cx="8.50098" cy="8.6958" r="2.1123" strokeWidth="1.2" />
            <circle cx="14.1123" cy="3.0835" r="2.1123" strokeWidth="1.2" />
            <circle cx="14.1123" cy="8.6958" r="2.1123" strokeWidth="1.2" />
            <circle cx="14.1123" cy="14.3091" r="2.1123" strokeWidth="1.2" />
          </symbol>

          <symbol
            id="jpg"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            // eslint-disable-next-line
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.39207 1.38789C2.71702 1.38789 1.63477 2.53644 1.63477 4.30834V9.64744C1.63477 10.1447 1.72707 10.5886 1.88502 10.9728C1.89183 10.9647 2.04052 10.7835 2.2345 10.5471C2.61377 10.0849 3.1662 9.41168 3.17007 9.40824C3.61987 8.89474 4.46422 8.12904 5.57247 8.59249C5.81532 8.69319 6.03118 8.83112 6.2299 8.9581C6.24925 8.97047 6.26843 8.98273 6.28747 8.99484C6.65992 9.24379 6.87897 9.36079 7.10647 9.34129C7.20072 9.32829 7.28912 9.30034 7.37297 9.24834C7.68927 9.05334 8.50932 7.89139 8.75489 7.54344C8.79091 7.49241 8.81457 7.45888 8.82247 7.44849C9.53097 6.52549 10.623 6.27849 11.533 6.82449C11.6552 6.89729 12.5307 7.50894 12.8206 7.75464V4.30834C12.8206 2.53644 11.7384 1.38789 10.0575 1.38789H4.39207ZM10.0567 0.481445C12.2517 0.481445 13.7266 2.01675 13.7266 4.30865V9.64775C13.7266 9.70539 13.7205 9.75944 13.7145 9.81347C13.7102 9.85143 13.706 9.88938 13.7038 9.92854C13.7024 9.95222 13.7017 9.9759 13.7011 9.99958C13.7002 10.0312 13.6993 10.0627 13.6967 10.0943C13.6954 10.1066 13.6929 10.1185 13.6905 10.1304C13.688 10.1422 13.6856 10.1541 13.6843 10.1664C13.6629 10.3705 13.6297 10.5655 13.5836 10.7547C13.5727 10.802 13.5601 10.8475 13.5473 10.8935L13.5446 10.9035C13.4926 11.0868 13.4315 11.2617 13.358 11.4287C13.3451 11.4568 13.3316 11.4842 13.318 11.5116C13.309 11.5298 13.2999 11.5481 13.2911 11.5665C13.2118 11.7258 13.126 11.8785 13.0265 12.0202C13.0081 12.0465 12.9885 12.0711 12.9689 12.0957C12.956 12.1119 12.943 12.1282 12.9303 12.145C12.827 12.2789 12.7191 12.407 12.5969 12.5233C12.5725 12.5465 12.5461 12.5678 12.5197 12.589C12.5032 12.6023 12.4868 12.6155 12.4708 12.6293C12.3453 12.7372 12.2173 12.8405 12.0762 12.9289C12.0454 12.9483 12.0127 12.9645 11.9801 12.9807C11.9591 12.9911 11.938 13.0016 11.9176 13.0128C11.774 13.0921 11.629 13.1694 11.4711 13.2292C11.4331 13.2437 11.3926 13.2541 11.3521 13.2646C11.3233 13.272 11.2944 13.2795 11.2663 13.2884C11.2523 13.2927 11.2382 13.2971 11.2242 13.3015C11.0831 13.3454 10.9424 13.3891 10.7905 13.4151C10.7025 13.4306 10.6091 13.4365 10.5156 13.4424C10.4752 13.445 10.4347 13.4476 10.3947 13.4509C10.3516 13.4541 10.3094 13.4593 10.2671 13.4645C10.1984 13.473 10.1295 13.4814 10.0567 13.4814H4.39126C4.14686 13.4814 3.91351 13.4567 3.68796 13.4197L3.66391 13.4158C2.78446 13.2643 2.05451 12.8399 1.54296 12.1996C1.53941 12.1996 1.53801 12.1972 1.53616 12.1941C1.53495 12.192 1.53356 12.1896 1.53126 12.1873C1.01711 11.5399 0.726562 10.6695 0.726562 9.64775V4.30865C0.726562 2.01675 2.20271 0.481445 4.39126 0.481445H10.0567ZM6.57617 4.71617C6.57617 5.59689 5.83925 6.33145 4.95432 6.33145C4.17646 6.33145 3.51324 5.76312 3.36459 5.02731C3.34003 4.9169 3.32617 4.80336 3.32617 4.68606C3.32617 3.79907 4.04671 3.08145 4.93732 3.08145C5.3908 3.08145 5.80146 3.27214 6.0956 3.57638C6.391 3.86995 6.57617 4.27455 6.57617 4.71617Z"
              fill="#1F2128"
            />
          </symbol>

          <symbol
            id="png"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            // eslint-disable-next-line
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.40642 0.773438H10.0402C12.2523 0.773438 13.7266 2.3522 13.7266 4.61759V9.92863C13.7266 12.1941 12.2522 13.7734 10.0402 13.7734H4.40642C2.19541 13.7734 0.726562 12.1954 0.726562 9.92863V4.61759C0.726562 2.35332 2.1997 0.773438 4.40642 0.773438ZM10.0402 1.75093H4.40642C2.75499 1.75093 1.70352 2.8786 1.70352 4.61759V9.92863C1.70352 11.6705 2.75111 12.7959 4.40642 12.7959H10.0402C11.6972 12.7959 12.7496 11.6686 12.7496 9.92863V4.61759C12.7496 2.87777 11.6974 1.75093 10.0402 1.75093ZM8.22142 7.57196C8.79817 6.86955 9.83671 6.79846 10.5029 7.39297L10.5876 7.4743L11.9397 8.87016C12.1275 9.06399 12.1227 9.37341 11.9289 9.56126C11.7528 9.73204 11.4812 9.74357 11.2923 9.59862L11.2382 9.55045L9.88617 8.15466C9.65062 7.91158 9.26769 7.90931 9.02864 8.1362L8.97616 8.19262L7.52464 9.95899C7.01121 10.5848 6.08742 10.6518 5.48972 10.1274L5.4103 10.0522L4.83102 9.46081C4.67886 9.30281 4.43619 9.28786 4.26721 9.41535L4.21383 9.46313L3.21799 10.5143C3.0324 10.7102 2.72322 10.7184 2.52743 10.5327C2.34943 10.3639 2.32642 10.0929 2.46315 9.89785L2.50897 9.84178L3.5046 8.79088C4.02875 8.23693 4.8919 8.20743 5.45025 8.70154L5.53163 8.77958L6.10799 9.36799C6.27648 9.53995 6.54651 9.54432 6.72062 9.38964L6.76978 9.33847L8.22142 7.57196ZM4.9974 3.79063C4.0972 3.79063 3.36719 4.52161 3.36719 5.42239C3.36719 6.32316 4.0972 7.05415 4.9974 7.05415C5.89764 7.05415 6.62826 6.32312 6.62826 5.42239C6.62826 4.52165 5.89764 3.79063 4.9974 3.79063ZM4.99701 4.76816C5.35769 4.76816 5.65091 5.06155 5.65091 5.42243C5.65091 5.78331 5.35769 6.0767 4.99701 6.0767C4.63653 6.0767 4.34375 5.78352 4.34375 5.42243C4.34375 5.06134 4.63653 4.76816 4.99701 4.76816Z"
              fill="#1F2128"
            />
          </symbol>

          <symbol
            id="pdf"
            width="13"
            height="14"
            viewBox="0 0 13 14"
            // eslint-disable-next-line
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8.07506 0.262387C8.04698 0.257455 8.0181 0.254883 7.98861 0.254883C7.95912 0.254883 7.93023 0.257455 7.90216 0.262387H3.75982C2.11396 0.262387 0.726562 1.5976 0.726562 3.22617V10.315C0.726562 12.0358 2.05302 13.3992 3.75982 13.3992H9.0462C10.6696 13.3992 12.01 11.9687 12.01 10.315V4.24983C12.01 4.12171 11.9604 3.99856 11.8717 3.90614L8.52016 0.414975C8.42658 0.317492 8.29729 0.262387 8.16216 0.262387H8.07506ZM7.49233 1.25381L3.76033 1.25434C2.65431 1.25434 1.71962 2.15386 1.71962 3.22556V10.3144C1.71962 11.4931 2.60789 12.4061 3.76033 12.4061H9.0467C10.1069 12.4061 11.0179 11.4338 11.0179 10.3144L11.0175 4.87563L10.4379 4.87761C10.2172 4.87734 9.96606 4.87687 9.68682 4.87624C8.51591 4.87376 7.56031 3.956 7.4958 2.80072L7.49233 2.67607V1.25381ZM10.4751 3.88357L9.689 3.88368C9.02367 3.88227 8.48489 3.34204 8.48489 2.67607V1.81044L10.4751 3.88357ZM7.86183 8.73083C8.13592 8.73083 8.35811 8.95302 8.35811 9.22711C8.35811 9.47835 8.17141 9.68599 7.92917 9.71885L7.86183 9.72339H4.2906C4.01651 9.72339 3.79432 9.50119 3.79432 9.22711C3.79432 8.97586 3.98103 8.76822 4.22326 8.73536L4.2906 8.73083H7.86183ZM7.00757 5.94983C7.00757 5.67574 6.78538 5.45355 6.51129 5.45355H4.2906L4.22326 5.45808C3.98103 5.49094 3.79432 5.69859 3.79432 5.94983C3.79432 6.22392 4.01651 6.44611 4.2906 6.44611H6.51129L6.57863 6.44158C6.82086 6.40872 7.00757 6.20108 7.00757 5.94983Z"
              fill="#1F2128"
            />
          </symbol>
        </svg>
      </div>
    )
  );
};

export default Polotno;
