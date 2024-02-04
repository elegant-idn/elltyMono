import type { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import s from "./LikedPage.module.scss";
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

interface LikedPageProps {
  cookieUser: any;
  authorized: string;
  userToken: string;
}

export const previewArray = [
  "https://ellty-images.s3.amazonaws.com/template_images/KiXQjbtDiAbstractGeometricVeterinaryClinicCatLogo-full.png",
  "https://ellty-images.s3.amazonaws.com/template_images/KiXQjbtDiAbstractGeometricVeterinaryClinicCatLogo-middle.png",
  "https://ellty-images.s3.amazonaws.com/template_images/KiXQjbtDiAbstractGeometricVeterinaryClinicCatLogo-mini.png",
];

const LikedPage: NextPage<LikedPageProps> = ({
  cookieUser,
  authorized,
  userToken,
}) => {
  const [designElementsList, setDesignElementsList] = React.useState<any>();
  const router = useRouter();
  const dispatch = useDispatch();
  const [displayMode, setDisplayMode] = useState("grid");
  const { t }: any = useTranslation("index");
  const i18n = t("likedPage", { returnObjects: true });
  const pagesDashbord = t("dashboard.sidebar", { returnObjects: true });
  const [touched, setTouched] = useState(false);
  const headerBtnPrimaryRef = React.useRef(null);
  const [numberOfChecked, setNumberOfChecked] = useState<number>(0);
  const [profileTooltip, setProfileTooltip] = React.useState<any>(null);
  const popperRef = React.useRef<any>();
  const allTheRefs: any = [];
  const [templates, setTemplates] = React.useState([
    {
      title: "design with really long name that should be cut",
      _id: 1,
      checked: false,
      seeMore: false,
      preview: previewArray,
    },
    {
      title: "untitled design",
      _id: 2,
      checked: false,
      seeMore: false,
      preview: previewArray,
    },
    {
      title: "untitled design",
      _id: 3,
      checked: false,
      seeMore: false,
      preview: previewArray,
    },
  ]);

  const [selectedElements, setSelectedElements] = React.useState<any>([]);

  const onToggleSelect = (item?: any, selectAll?: boolean) => {
    if (selectAll) {
      !selectedElements.length
        ? setSelectedElements(
            templates.map((item: any) => {
              return item._id;
            })
          )
        : setSelectedElements([]);
      return;
    }

    const idx = selectedElements.findIndex((s: any) => s == item._id);
    selectedElements.find((s: any) => s == item._id)
      ? setSelectedElements([
          ...selectedElements.slice(0, idx),
          ...selectedElements.slice(idx + 1),
        ])
      : // @ts-ignore
        setSelectedElements([...selectedElements, item._id]);
  };

  const UnHeartDesign = () => (
    <svg
      width="17"
      height="17"
      viewBox="5 5 19 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.155 9.29639C13.4734 7.33044 10.6692 6.8016 8.56227 8.60183C6.45532 10.4021 6.15869 13.4119 7.81329 15.5411C9.18898 17.3113 13.3523 21.0448 14.7168 22.2533C14.8695 22.3885 14.9458 22.4561 15.0348 22.4826C15.1125 22.5058 15.1976 22.5058 15.2753 22.4826C15.3643 22.4561 15.4406 22.3885 15.5933 22.2533C16.9578 21.0448 21.1211 17.3113 22.4968 15.5411C24.1514 13.4119 23.891 10.3831 21.7478 8.60183C19.6047 6.82054 16.8367 7.33044 15.155 9.29639Z"
        stroke="black"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 6L22 22"
        stroke="black"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
  const handleClickOutside = (event: any) => {
    if (
      popperRef.current &&
      !popperRef.current.contains(event.target) &&
      !allTheRefs.includes(event.target)
    ) {
      const filtered = templates.map((design) => {
        design.seeMore = false;
        return design;
      });
      setTemplates(filtered);
      setProfileTooltip(null);
    }
  };
  const handleChange = (id: number, e: any) => {
    if (e.target.checked) {
      setTouched(true);
      setNumberOfChecked(numberOfChecked + 1);
    } else {
      setNumberOfChecked(numberOfChecked - 1);
    }
    const filtered = templates.map((design) => {
      if (design._id === id) {
        design.checked = e.target.checked;
      }

      return design;
    });
    setTemplates(filtered);
  };
  const removeAllCheckes = () => {
    const filtered = templates.map((design) => {
      design.checked = false;
      return design;
    });
    setTemplates(filtered);
    setNumberOfChecked(0);
    setTouched(false);
  };

  const handleThreeDotsClick = (id: number, event: any) => {
    setProfileTooltip(event.currentTarget);
    const filtered = templates.map((design) => {
      if (design._id !== id) {
        design.seeMore = false;
      } else {
        design.seeMore = true;
      }

      return design;
    });
    setTemplates(filtered);
  };

  // const addAllCheckes = () => {
  //   setAllChecked(true);
  //   !allChecked && designs.forEach((design) => (design.checked = true));
  // };
  React.useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  });
  useEffect(() => {
    if (templates.every((design) => design.checked === false)) {
      setTouched(false);
      setNumberOfChecked(0);
    }
  }, [templates]);
  React.useEffect(() => {
    let templatesElements;

    displayMode == "grid"
      ? (templatesElements = templates.map((item: any) => {
          return (
            <div key={item._id}>
              <DesignGridElement
                userTemplate={false}
                threeDots={true}
                key={item._id}
                item={item}
                selectable
                isSelected={item.checked}
                onChangeCheckbox={(e: any) => {
                  onToggleSelect(item);
                  handleChange(item._id, e);
                }}
                buttonMore={false}
                threeDotsRef={(ref: any) => allTheRefs.push(ref)}
                threeDotsAction={(event: any) => {
                  handleThreeDotsClick(item._id, event);
                }}
              />
              <Popper
                placement="bottom"
                className={s.root}
                ref={popperRef}
                id="simple-popper"
                open={item.seeMore}
                anchorEl={profileTooltip}
              >
                <div className={s.popperWrapper}>
                  <div className={s.titleWrapperPopper}>{item.title}</div>
                  <div className={s.heartWrapper}>
                    <UnHeartDesign />
                    <p>{i18n.unlike}</p>
                  </div>
                </div>
              </Popper>
            </div>
          );
        }))
      : (templatesElements = templates.map((item: any) => {
          return item ? (
            <div key={item.key}>
              <DesignListElement
                userTemplate={false}
                threeDots={true}
                key={item._id}
                item={item}
                selectable
                isSelected={item.checked}
                onChangeCheckbox={(e: any) => {
                  onToggleSelect(item);
                  handleChange(item._id, e);
                }}
                buttonMore={false}
                threeDotsRef={(ref: any) => allTheRefs.push(ref)}
                threeDotsAction={(event: any) => {
                  handleThreeDotsClick(item._id, event);
                }}
              />
              <Popper
                placement="bottom-end"
                className={s.root}
                ref={popperRef}
                id="simple-popper"
                open={item.seeMore}
                anchorEl={profileTooltip}
              >
                <div className={s.popperWrapper}>
                  <div className={s.titleWrapperPopper}>{item.title}</div>
                  <div className={s.heartWrapper}>
                    <UnHeartDesign />
                    <p>Unlike</p>
                  </div>
                </div>
              </Popper>
            </div>
          ) : null;
        }));

    setDesignElementsList(templatesElements);
  }, [templates, displayMode]);

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
          {/* <div className={s.rowControls}>
            <Box className={s.blockTitle}>{i18n.title}</Box>

            <DisplayModeBtns
              displayMode={displayMode}
              setDisplayMode={setDisplayMode}
            />
          </div>
          {touched && (
            <div className={s.selectedItems}>
              <InputCheckbox
                variant="blue"
                value="checkbox"
                checked={touched}
                onChange={removeAllCheckes}
              />
              <span>
                {numberOfChecked}
                {i18n.selected}
              </span>
              <div className={s.hoverEffect}>
                <UnHeartDesign />
              </div>
            </div>
          )}
          {designElementsList && (
            <>
              {displayMode == "grid" && (
                <div>
                  <Masonry
                    breakpointCols={{
                      default: 6,
                      1440: 5,
                      1280: 4,
                      1024: 3,
                      480: 2,
                    }}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid_column"
                  >
                    {designElementsList}
                  </Masonry>
                </div>
              )}

              {displayMode == "list" && (
                <>
                  <DesignListHeader
                    // selectable
                    isActive={templates.length == selectedElements.length}
                    onChangeCheckbox={() => {
                      onToggleSelect(null, true);
                    }}
                  />
                  <div className={s.list}>{designElementsList}</div>
                </>
              )}
            </>
          )} */}
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
        "Dashboard",
      ])),
      cookieUser: !!req.cookies.user && (JSON.parse(req.cookies.user) || ""),
      userToken: !!req.cookies.user_token && (req.cookies.user_token || null),
    },
  };
}

export default LikedPage;
