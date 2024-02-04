import NextLink from "next/link";
import React from "react";
import s from "./Header.module.scss";

import { useDispatch, useSelector } from "react-redux";
import {
  ChangeAuthFormAction,
  ToggleAuthModalAction,
  ToggleMenuAction,
} from "../../redux/actions";
import { RootState } from "../../redux/store";

import Skeleton from "@mui/material/Skeleton";
import Image from "next/image";
import { useRouter } from "next/router";
import { Api } from "../../api";
import useTypedSelector from "../../utils/useTypedSelector";
import AuthModal from "../AuthModal";
import BtnHover from "../BtnHover";
import BtnPrimary from "../BtnPrimary";
import BtnSecondary from "../BtnSecondary";
import CheckoutModal from "../CheckoutModal";
import ContainerFluid from "../ContainerFluid";
import HamburgerMenu from "../HamburgerMenu";
import { MenuMobile, MenuMobileAuth } from "../MenuMobile";
import FileDropdown from "../Polotno/FileDropdown";
import ProfileDropdown from "../ProfileDropdown";
import getHCLocale from "../../utils/getHCLocale";

interface HeaderProps {
  userToken: string;
  cookieUser: any;
  authorized?: boolean;
  local: any;
}

const Header: React.FC<React.PropsWithChildren<HeaderProps>> = ({
  userToken,
  cookieUser,
  authorized,
  local,
}) => {
  const { locale } = useRouter();
  const router = useRouter();
  const dispatch = useDispatch();
  const menuState = useSelector(
    (state: RootState) => state.mainReducer.menuState
  );
  const user = useTypedSelector((state) => state.mainReducer.user);

  const headerLocales = local("header", { returnObjects: true });
  // const { t } = useTranslation('categoriesSections');
  // const categoriesLocales = (t("sections", { returnObjects: true }) as any[])[0]
  //   .sections;

  const [categories, setCategories] = React.useState([]);

  const [headerTooltipState, setHeaderTooltipState] = React.useState(false);
  const headerTooltipRef = React.useRef<any>(null);
  const headerTooltipBtn = React.useRef<any>(null);

  // used to control the dropdown <FileDropdown />
  const [fileTooltip, setFileTooltip] = React.useState<any>(null);
  const fileTooltipRef = React.useRef<any>(null);
  const fileTooltipBtnRef = React.useRef<any>(null);

  const [profileTooltip, setProfileTooltip] = React.useState<any>(null);
  const profileTooltipRef = React.useRef<any>(null);
  const profileTooltipBtnRef = React.useRef<any>(null);

  React.useEffect(() => {
    Api.get("/categories")
      .then((result) => {
        // console.log(result.data);
        setCategories(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // const handleClickOutside = (event: any) => {
  //   /* @ts-ignore */
  //   if (profileTooltipRef.current && !profileTooltipRef.current.contains(event.target) && !profileTooltipBtnRef.current.contains(event.target)) {
  //     setHeaderTooltipState(false);
  //   }
  // };

  // React.useEffect(() => {
  //   document.addEventListener("click", handleClickOutside, true);
  //   return () => {
  //     document.removeEventListener("click", handleClickOutside, true);
  //   };
  // });

  const handleClickOutside = (event: any) => {
    if (
      fileTooltipRef.current &&
      !fileTooltipRef.current.contains(event.target) &&
      !fileTooltipBtnRef.current.contains(event.target) &&
      !document.querySelector(".modal")
    ) {
      setFileTooltip(false);
    }

    // if (headerTooltipRef.current && !headerTooltipRef.current.contains(event.target) && !headerTooltipBtn.current.contains(event.target)) {
    //   setHeaderTooltipState(false);
    // }

    if (
      profileTooltipRef.current &&
      !profileTooltipRef.current.contains(event.target) &&
      !profileTooltipBtnRef.current.contains(event.target)
    ) {
      setProfileTooltip(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  const handleClickOpenDesign = () => {
    // dispatch(SetInitialSectionAction('size'))
  };

  const navbarItems = [
    {
      text: headerLocales?.navbar.home,
      href: "/",
    },
    {
      text: headerLocales?.navbar.design,
      href: "/design",
    },
    {
      text: headerLocales?.navbar.templates,
      href: "/templates",
      highlightSubRoutes: true,
    },
    {
      text: headerLocales?.navbar.plans,
      href: "/plans",
    },
    {
      text: headerLocales?.navbar.contact,
      href: getHCLocale(locale),
    },
  ];

  const isHighlighted = (item: typeof navbarItems[number]) => {
    if (!item.highlightSubRoutes) return item.href === router.pathname;

    return router.pathname.startsWith(item.href);
  };

  return (
    <>
      <header className={s.header}>
        <ContainerFluid>
          <div className={s.navbar}>
            <NextLink href="/" passHref>
              <a className={s.logoContainer} aria-label="home">
                <svg
                  width="75"
                  height="32"
                  viewBox="0 0 75 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={s.logo}
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M22.1194 12.5475V25.095H25.2409H28.3623V12.5475V0H25.2409H22.1194V12.5475ZM31.8909 12.5475V25.095H35.0124H38.1339V12.5475V0H35.0124H31.8909V12.5475ZM46.5482 3.82156C45.242 4.19236 43.9443 4.55381 43.6643 4.62485L43.1554 4.75394V6.30983V7.8656H41.7303H40.3053V10.6123V13.359H41.7303H43.1554L43.1577 16.6364C43.1602 20.2007 43.2688 21.0284 43.9048 22.3322C44.3368 23.2176 45.4167 24.2334 46.3116 24.5961C47.6473 25.1373 50.0983 25.3576 52.3641 25.1397L53.1983 25.0594V22.4554V19.8513H51.9725C50.6235 19.8513 49.9711 19.6741 49.6196 19.2124C49.4311 18.9648 49.3983 18.5097 49.3983 16.1403V13.359H51.2983H53.1983V10.6123V7.8656H51.2983H49.3983V5.49343C49.3983 3.31254 49.3791 3.12227 49.1608 3.13438C49.0302 3.1415 47.8545 3.45075 46.5482 3.82156ZM7.93709 7.49242C5.95401 7.82527 4.26 8.66202 2.7636 10.0476C1.87384 10.8715 1.54012 11.2945 1.03023 12.2447C0.257332 13.6853 0.00313624 14.7485 1.47746e-05 16.554C-0.00731388 20.8804 2.71216 24.0991 7.33831 25.2393C8.81408 25.6031 11.4585 25.6294 13.0943 25.2966C14.7343 24.9629 16.4417 24.1543 17.5673 23.1782L18.5095 22.3611L18.1768 22.1274C17.805 21.8659 14.413 19.7014 14.1423 19.5529C14.0385 19.4959 13.713 19.6137 13.3307 19.8467C12.3584 20.4391 11.4221 20.6434 10.0168 20.5697C8.53098 20.4918 7.5085 20.0804 6.90931 19.3195C6.69081 19.042 6.51207 18.7672 6.51207 18.7089C6.51207 18.6505 9.37974 18.6028 12.8846 18.6028H19.257L19.365 18.1346C19.5545 17.3128 19.4717 14.859 19.2251 13.9833C18.8257 12.565 18.0162 11.2341 16.8732 10.1164C15.0107 8.29496 13.0388 7.49317 10.2443 7.42063C9.34853 7.39741 8.3103 7.42974 7.93709 7.49242ZM54.5555 7.9264C54.5555 7.96223 56.2044 11.6617 58.2198 16.1476C60.2352 20.6333 61.8841 24.389 61.8841 24.4932C61.8841 24.5976 61.6967 24.9211 61.4676 25.212C60.8961 25.9377 59.8989 26.3469 58.4838 26.436L57.4055 26.5041V29.252V32L58.9323 31.9241C62.6268 31.7406 65.1427 30.4626 67.048 27.8019C68.0515 26.4007 68.2521 25.9229 71.9058 16.2306C73.5495 11.8702 74.9355 8.20419 74.986 8.08409C75.0718 7.87946 74.8569 7.8656 71.6114 7.8656C68.4279 7.8656 68.1396 7.88345 68.0743 8.08409C68.0353 8.20419 67.4137 10.3252 66.6932 12.7972C65.9727 15.2692 65.3407 17.3636 65.2887 17.4513C65.2363 17.5397 64.379 15.452 63.3657 12.7694L61.5372 7.92802L58.0464 7.89469C56.1264 7.87633 54.5555 7.89069 54.5555 7.9264ZM11.231 12.4258C12.1129 12.6666 12.6786 13.1037 13.1009 13.8705C13.2839 14.2026 13.4336 14.5043 13.4336 14.541C13.4336 14.5776 11.8416 14.6075 9.89587 14.6075H6.35803L6.45059 14.3266C6.98816 12.6936 9.11537 11.8477 11.231 12.4258Z"
                    fill="#1F2128"
                  />
                </svg>
              </a>
            </NextLink>

            {navbarItems.map((item) => {
              return (
                <BtnHover
                  className={s.navbarItem}
                  key={item.href}
                  onClickRedirect={item.href}
                  focus={isHighlighted(item)}
                  asLink
                >
                  {item.text}
                </BtnHover>
              );
            })}
          </div>

          <div className={s.auth}>
            {authorized ? (
              <div className={s.profile}>
                <div
                  ref={fileTooltipBtnRef}
                  className={s.profileTooltipBtn}
                  // ref={headerTooltipBtn}
                  // onClick={() => {setHeaderTooltipState(!headerTooltipState)}}
                  onClick={(event: any) => {
                    fileTooltip
                      ? setFileTooltip(null)
                      : setFileTooltip(event.currentTarget);
                  }}
                >
                  <BtnPrimary>
                    {headerLocales?.auth?.btn}
                    {/* <svg viewBox="0 0 6 10">
                      <path d="M1.45222 0.644603L5.40234 4.59473L1.39462 8.60245" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg> */}
                  </BtnPrimary>
                </div>
                {/* <div
                  ref={headerTooltipRef}
                  className={clsx(
                    s.profileTooltip,
                    headerTooltipState && s.active
                  )}
                >
                  <NextLink href="/templates/instagram-post" passHref>
                    <a className={s.profileTooltipRow}>
                      <svg>
                        <use href="#inst" />
                      </svg>
                      {categoriesLocales[0].name}
                    </a>
                  </NextLink>
                  <NextLink href="/templates/instagram-stories" passHref>
                    <a className={s.profileTooltipRow}>
                      <svg>
                        <use href="#inst" />
                      </svg>
                      {categoriesLocales[1].name}
                    </a>
                  </NextLink>
                  <NextLink href="/templates/facebook-post" passHref>
                    <a className={s.profileTooltipRow}>
                      <svg>
                        <use href="#fb" />
                      </svg>
                      {categoriesLocales[2].name}
                    </a>
                  </NextLink>
                  <NextLink href="/templates/pinterest-pin" passHref>
                    <a className={s.profileTooltipRow}>
                      <svg>
                        <use href="#pinterest" />
                      </svg>
                      {categoriesLocales[3].name}
                    </a>
                  </NextLink>
                  <NextLink href="/templates/poster" passHref>
                    <a className={s.profileTooltipRow}>
                      <svg>
                        <use href="#paper" />
                      </svg>
                      {categoriesLocales[4].name}
                    </a>
                  </NextLink>
                  <NextLink href="/templates/logo" passHref>
                    <a className={s.profileTooltipRow}>
                      <svg>
                        <use href="#logo" />
                      </svg>
                      {categoriesLocales[5].name}
                    </a>
                  </NextLink>
                </div> */}
                <div
                  ref={profileTooltipBtnRef}
                  className={s.profileImg}
                  onClick={(event: any) => {
                    profileTooltip
                      ? setProfileTooltip(null)
                      : setProfileTooltip(event.currentTarget);
                  }}
                >
                  {user.avatar ? (
                    <Image
                      src={cookieUser.avatar}
                      alt="profile image"
                      height="40px"
                      width="40px"
                    />
                  ) : (
                    <Skeleton variant="circular" width="100%" height="100%" />
                  )}
                </div>
                <FileDropdown
                  fileTooltip={fileTooltip}
                  fileTooltipRef={fileTooltipRef}
                  categories={categories}
                  designMode={false}
                  initialWindow="categories"
                  offsetTop={0}
                />
                <ProfileDropdown
                  profileTooltip={profileTooltip}
                  profileTooltipRef={profileTooltipRef}
                />
              </div>
            ) : (
              <>
                <BtnSecondary
                  className={s.authModalBtn}
                  onClick={() => {
                    dispatch(ToggleAuthModalAction(null));
                    dispatch(ChangeAuthFormAction("logIn"));
                  }}
                >
                  {headerLocales?.auth?.signin}
                </BtnSecondary>
                <BtnPrimary
                  className={s.authModalBtn}
                  onClick={() => {
                    dispatch(ToggleAuthModalAction(null));
                    dispatch(ChangeAuthFormAction("signUp"));
                  }}
                >
                  {headerLocales?.auth?.signup}
                </BtnPrimary>
              </>
            )}

            <div
              className={s.hamburger}
              style={
                authorized ? { marginLeft: "5px" } : { marginLeft: "16px" }
              }
            >
              <HamburgerMenu
                isActive={menuState.menuOpen}
                onClick={() => {
                  dispatch(ToggleMenuAction(null));
                }}
              />
            </div>
          </div>
        </ContainerFluid>
      </header>

      {menuState.menuOpen && !authorized && <MenuMobile />}

      {menuState.menuOpen && authorized && (
        <MenuMobileAuth cookieUser={cookieUser} local={local} />
      )}

      <AuthModal />

      <CheckoutModal userToken={userToken} preloadStripe={profileTooltip} />

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
      </svg>
    </>
  );
};

export default Header;
