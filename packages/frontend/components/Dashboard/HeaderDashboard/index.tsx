import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import {
  SetFileDropdownAction,
  SetProfileTooltipAction,
  ToggleMenuAction,
} from "../../../redux/actions";
import { RootState } from "../../../redux/store";
import s from "./HeaderDashboard.module.scss";

import Skeleton from "@mui/material/Skeleton";
import useTypedSelector from "../../../utils/useTypedSelector";
import BtnPrimary from "../../BtnPrimary";
import CheckoutModal from "../../CheckoutModal";
import ContainerFluid from "../../ContainerFluid";
import HamburgerMenu from "../../HamburgerMenu";
import { MenuMobileAuth } from "../../MenuMobile";
import ProfileDropdown from "../../ProfileDropdown";
import BtnHover from "../../BtnHover";
import clsx from "clsx";
import UpgradeToProBar from "../UpgradeToProBar";
import Image from "next/image";
import getHCLocale from "../../../utils/getHCLocale";

interface HeaderDashboardProps {
  userToken: string;
  cookieUser: any;
  searchPanel: boolean;
  adminPage?: boolean;
  local: any;
  headerBtnPrimaryRef: any;
}

const HeaderDashboard: React.FC<
  React.PropsWithChildren<HeaderDashboardProps>
> = ({
  userToken,
  cookieUser,
  searchPanel,
  adminPage,
  local,
  headerBtnPrimaryRef,
}) => {
  const { locale } = useRouter();
  const [cookie, setCookie, removeCookie] = useCookies();
  // console.log(cookie.user);
  const router = useRouter();
  const dispatch = useDispatch();
  const searchTerm = useSelector(
    (state: RootState) => state.dashboardReducer.searchTerm
  );
  const menuState = useSelector(
    (state: RootState) => state.mainReducer.menuState
  );
  const profileTooltip = useSelector(
    (state: RootState) => state.dashboardReducer.profileTooltipState
  );
  const fileDropdown = useSelector(
    (state: RootState) => state.designReducer.fileDropdown
  );
  const user = useTypedSelector((state) => state.mainReducer.user);
  // console.log(fileDropdown);

  // const [categories, setCategories] = React.useState([])

  // to store a tooltip and bind it to a specific button
  const [helpTooltip, setHelpTooltip] = React.useState(null);
  const [settingsTooltip, setSettingsTooltip] = React.useState(null);
  const [notifTooltip, setNotifTooltip] = React.useState(null);
  // const [profileTooltip, setProfileTooltip] = React.useState(null);

  // to determine the click on the tooltip button and on the tooltip itself
  const helpTooltipRef = React.useRef<any>(null);
  const helpTooltipBtnRef = React.useRef<any>(null);
  const settingsTooltipRef = React.useRef<any>(null);
  const settingsTooltipBtnRef = React.useRef<any>(null);
  const notifTooltipRef = React.useRef<any>(null);
  const notifTooltipBtnRef = React.useRef<any>(null);
  const profileTooltipRef = React.useRef<any>(null);
  const profileTooltipBtnRef = React.useRef<any>(null);

  const headerLocal = local("header", { returnObjects: true });

  const handleClickOutside = (event: any) => {
    if (
      (helpTooltipRef.current &&
        !helpTooltipRef.current.contains(event.target) &&
        !helpTooltipBtnRef.current.contains(event.target)) ||
      (settingsTooltipRef.current &&
        !settingsTooltipRef.current.contains(event.target) &&
        !settingsTooltipBtnRef.current.contains(event.target)) ||
      (notifTooltipRef.current &&
        !notifTooltipRef.current.contains(event.target) &&
        !notifTooltipBtnRef.current.contains(event.target)) ||
      (profileTooltipRef.current &&
        !profileTooltipRef.current.contains(event.target) &&
        !profileTooltipBtnRef.current.contains(event.target))
    ) {
      setHelpTooltip(null);
      setSettingsTooltip(null);
      setNotifTooltip(null);
      dispatch(SetProfileTooltipAction(null));
      // setProfileTooltip(null);
    }
  };

  React.useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  const navbarItems = [
    {
      text: headerLocal.navbar.home,
      href: "/",
    },
    {
      text: headerLocal.navbar.design,
      href: "/design",
    },
    {
      text: headerLocal.navbar.templates,
      href: "/templates",
    },
    {
      text: headerLocal.navbar.plans,
      href: "/plans",
    },
    {
      text: headerLocal.navbar.contact,
      href: getHCLocale(locale),
    },
  ];

  const dashboardRoutes = ["/projects", "/liked", "/trash", "/"];
  const isCurrentItem = (item: typeof navbarItems[number]) => {
    if (item.href === "/") {
      return dashboardRoutes.includes(router.pathname);
    }

    return item.href === router.pathname;
  };

  return (
    <>
      <div className={s.root}>
        <ContainerFluid>
          <nav className={s.navbar}>
            <div className={s.logo}>
              <NextLink href="/">
                <svg
                  width="75"
                  height="32"
                  viewBox="0 0 75 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={s.logoImg}
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M22.1194 12.5475V25.095H25.2409H28.3623V12.5475V0H25.2409H22.1194V12.5475ZM31.8909 12.5475V25.095H35.0124H38.1339V12.5475V0H35.0124H31.8909V12.5475ZM46.5482 3.82156C45.242 4.19236 43.9443 4.55381 43.6643 4.62485L43.1554 4.75394V6.30983V7.8656H41.7303H40.3053V10.6123V13.359H41.7303H43.1554L43.1577 16.6364C43.1602 20.2007 43.2688 21.0284 43.9048 22.3322C44.3368 23.2176 45.4167 24.2334 46.3116 24.5961C47.6473 25.1373 50.0983 25.3576 52.3641 25.1397L53.1983 25.0594V22.4554V19.8513H51.9725C50.6235 19.8513 49.9711 19.6741 49.6196 19.2124C49.4311 18.9648 49.3983 18.5097 49.3983 16.1403V13.359H51.2983H53.1983V10.6123V7.8656H51.2983H49.3983V5.49343C49.3983 3.31254 49.3791 3.12227 49.1608 3.13438C49.0302 3.1415 47.8545 3.45075 46.5482 3.82156ZM7.93709 7.49242C5.95401 7.82527 4.26 8.66202 2.7636 10.0476C1.87384 10.8715 1.54012 11.2945 1.03023 12.2447C0.257332 13.6853 0.00313624 14.7485 1.47746e-05 16.554C-0.00731388 20.8804 2.71216 24.0991 7.33831 25.2393C8.81408 25.6031 11.4585 25.6294 13.0943 25.2966C14.7343 24.9629 16.4417 24.1543 17.5673 23.1782L18.5095 22.3611L18.1768 22.1274C17.805 21.8659 14.413 19.7014 14.1423 19.5529C14.0385 19.4959 13.713 19.6137 13.3307 19.8467C12.3584 20.4391 11.4221 20.6434 10.0168 20.5697C8.53098 20.4918 7.5085 20.0804 6.90931 19.3195C6.69081 19.042 6.51207 18.7672 6.51207 18.7089C6.51207 18.6505 9.37974 18.6028 12.8846 18.6028H19.257L19.365 18.1346C19.5545 17.3128 19.4717 14.859 19.2251 13.9833C18.8257 12.565 18.0162 11.2341 16.8732 10.1164C15.0107 8.29496 13.0388 7.49317 10.2443 7.42063C9.34853 7.39741 8.3103 7.42974 7.93709 7.49242ZM54.5555 7.9264C54.5555 7.96223 56.2044 11.6617 58.2198 16.1476C60.2352 20.6333 61.8841 24.389 61.8841 24.4932C61.8841 24.5976 61.6967 24.9211 61.4676 25.212C60.8961 25.9377 59.8989 26.3469 58.4838 26.436L57.4055 26.5041V29.252V32L58.9323 31.9241C62.6268 31.7406 65.1427 30.4626 67.048 27.8019C68.0515 26.4007 68.2521 25.9229 71.9058 16.2306C73.5495 11.8702 74.9355 8.20419 74.986 8.08409C75.0718 7.87946 74.8569 7.8656 71.6114 7.8656C68.4279 7.8656 68.1396 7.88345 68.0743 8.08409C68.0353 8.20419 67.4137 10.3252 66.6932 12.7972C65.9727 15.2692 65.3407 17.3636 65.2887 17.4513C65.2363 17.5397 64.379 15.452 63.3657 12.7694L61.5372 7.92802L58.0464 7.89469C56.1264 7.87633 54.5555 7.89069 54.5555 7.9264ZM11.231 12.4258C12.1129 12.6666 12.6786 13.1037 13.1009 13.8705C13.2839 14.2026 13.4336 14.5043 13.4336 14.541C13.4336 14.5776 11.8416 14.6075 9.89587 14.6075H6.35803L6.45059 14.3266C6.98816 12.6936 9.11537 11.8477 11.231 12.4258Z"
                    fill="#1F2128"
                  />
                </svg>
              </NextLink>
            </div>

            {navbarItems.map((item) => {
              const isCurrent = isCurrentItem(item);
              return (
                <BtnHover
                  key={item.href}
                  className={clsx(s.navbarItem, {
                    [s.current]: isCurrent,
                  })}
                  onClickRedirect={item.href}
                  focus={isCurrent}
                  asLink
                >
                  {item.text}
                </BtnHover>
              );
            })}
          </nav>

          <div className={s.rightSection}>
            {!adminPage && (
              <>
                {/* <SearchPanel
                  value={searchTerm}
                  changeValue={(e: any) => {dispatch(ChangeDashboardSearchTermAction(e.target.value))}}
                /> */}

                {/* <div className={s.BtnSecondary}>
                  <BtnSecondary onClickRedirect="/templates">Templates</BtnSecondary>
                </div> */}

                <button
                  ref={settingsTooltipBtnRef}
                  className={s.headerBtn}
                  onClick={(event: any) => {
                    router.push("/settings/account");
                    // settingsTooltip ? setSettingsTooltip(null) : setSettingsTooltip(event.currentTarget);
                  }}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={s.engineSvg}
                  >
                    <path
                      d="M11 14C12.6569 14 14 12.6569 14 11C14 9.34315 12.6569 8 11 8C9.34315 8 8 9.34315 8 11C8 12.6569 9.34315 14 11 14Z"
                      stroke="#242124"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17.7273 13.7273C17.6063 14.0015 17.5702 14.3056 17.6236 14.6005C17.6771 14.8954 17.8177 15.1676 18.0273 15.3818L18.0818 15.4364C18.2509 15.6052 18.385 15.8057 18.4765 16.0265C18.568 16.2472 18.6151 16.4838 18.6151 16.7227C18.6151 16.9617 18.568 17.1983 18.4765 17.419C18.385 17.6397 18.2509 17.8402 18.0818 18.0091C17.913 18.1781 17.7124 18.3122 17.4917 18.4037C17.271 18.4952 17.0344 18.5423 16.7955 18.5423C16.5565 18.5423 16.3199 18.4952 16.0992 18.4037C15.8785 18.3122 15.678 18.1781 15.5091 18.0091L15.4545 17.9545C15.2403 17.745 14.9682 17.6044 14.6733 17.5509C14.3784 17.4974 14.0742 17.5335 13.8 17.6545C13.5311 17.7698 13.3018 17.9611 13.1403 18.205C12.9788 18.4489 12.8921 18.7347 12.8909 19.0273V19.1818C12.8909 19.664 12.6994 20.1265 12.3584 20.4675C12.0174 20.8084 11.5549 21 11.0727 21C10.5905 21 10.1281 20.8084 9.78708 20.4675C9.4461 20.1265 9.25455 19.664 9.25455 19.1818V19.1C9.24751 18.7991 9.15011 18.5073 8.97501 18.2625C8.79991 18.0176 8.55521 17.8312 8.27273 17.7273C7.99853 17.6063 7.69437 17.5702 7.39947 17.6236C7.10456 17.6771 6.83244 17.8177 6.61818 18.0273L6.56364 18.0818C6.39478 18.2509 6.19425 18.385 5.97353 18.4765C5.7528 18.568 5.51621 18.6151 5.27727 18.6151C5.03834 18.6151 4.80174 18.568 4.58102 18.4765C4.36029 18.385 4.15977 18.2509 3.99091 18.0818C3.82186 17.913 3.68775 17.7124 3.59626 17.4917C3.50476 17.271 3.45766 17.0344 3.45766 16.7955C3.45766 16.5565 3.50476 16.3199 3.59626 16.0992C3.68775 15.8785 3.82186 15.678 3.99091 15.5091L4.04545 15.4545C4.25503 15.2403 4.39562 14.9682 4.4491 14.6733C4.50257 14.3784 4.46647 14.0742 4.34545 13.8C4.23022 13.5311 4.03887 13.3018 3.79497 13.1403C3.55107 12.9788 3.26526 12.8921 2.97273 12.8909H2.81818C2.33597 12.8909 1.87351 12.6994 1.53253 12.3584C1.19156 12.0174 1 11.5549 1 11.0727C1 10.5905 1.19156 10.1281 1.53253 9.78708C1.87351 9.4461 2.33597 9.25455 2.81818 9.25455H2.9C3.2009 9.24751 3.49273 9.15011 3.73754 8.97501C3.98236 8.79991 4.16883 8.55521 4.27273 8.27273C4.39374 7.99853 4.42984 7.69437 4.37637 7.39947C4.3229 7.10456 4.18231 6.83244 3.97273 6.61818L3.91818 6.56364C3.74913 6.39478 3.61503 6.19425 3.52353 5.97353C3.43203 5.7528 3.38493 5.51621 3.38493 5.27727C3.38493 5.03834 3.43203 4.80174 3.52353 4.58102C3.61503 4.36029 3.74913 4.15977 3.91818 3.99091C4.08704 3.82186 4.28757 3.68775 4.50829 3.59626C4.72901 3.50476 4.96561 3.45766 5.20455 3.45766C5.44348 3.45766 5.68008 3.50476 5.9008 3.59626C6.12152 3.68775 6.32205 3.82186 6.49091 3.99091L6.54545 4.04545C6.75971 4.25503 7.03183 4.39562 7.32674 4.4491C7.62164 4.50257 7.9258 4.46647 8.2 4.34545H8.27273C8.54161 4.23022 8.77093 4.03887 8.93245 3.79497C9.09397 3.55107 9.18065 3.26526 9.18182 2.97273V2.81818C9.18182 2.33597 9.37338 1.87351 9.71435 1.53253C10.0553 1.19156 10.5178 1 11 1C11.4822 1 11.9447 1.19156 12.2856 1.53253C12.6266 1.87351 12.8182 2.33597 12.8182 2.81818V2.9C12.8193 3.19253 12.906 3.47834 13.0676 3.72224C13.2291 3.96614 13.4584 4.15749 13.7273 4.27273C14.0015 4.39374 14.3056 4.42984 14.6005 4.37637C14.8954 4.3229 15.1676 4.18231 15.3818 3.97273L15.4364 3.91818C15.6052 3.74913 15.8057 3.61503 16.0265 3.52353C16.2472 3.43203 16.4838 3.38493 16.7227 3.38493C16.9617 3.38493 17.1983 3.43203 17.419 3.52353C17.6397 3.61503 17.8402 3.74913 18.0091 3.91818C18.1781 4.08704 18.3122 4.28757 18.4037 4.50829C18.4952 4.72901 18.5423 4.96561 18.5423 5.20455C18.5423 5.44348 18.4952 5.68008 18.4037 5.9008C18.3122 6.12152 18.1781 6.32205 18.0091 6.49091L17.9545 6.54545C17.745 6.75971 17.6044 7.03183 17.5509 7.32674C17.4974 7.62164 17.5335 7.9258 17.6545 8.2V8.27273C17.7698 8.54161 17.9611 8.77093 18.205 8.93245C18.4489 9.09397 18.7347 9.18065 19.0273 9.18182H19.1818C19.664 9.18182 20.1265 9.37338 20.4675 9.71435C20.8084 10.0553 21 10.5178 21 11C21 11.4822 20.8084 11.9447 20.4675 12.2856C20.1265 12.6266 19.664 12.8182 19.1818 12.8182H19.1C18.8075 12.8193 18.5217 12.906 18.2778 13.0676C18.0339 13.2291 17.8425 13.4584 17.7273 13.7273Z"
                      stroke="#242124"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {user.plan === "free" && (
                  <UpgradeToProBar className={s.upgradeToProBar} />
                )}

                <div
                  ref={headerBtnPrimaryRef}
                  className={s.BtnPrimary}
                  onClick={(event: any) => {
                    fileDropdown
                      ? dispatch(SetFileDropdownAction(null))
                      : dispatch(SetFileDropdownAction(event.currentTarget));
                  }}
                >
                  <BtnPrimary>{headerLocal.auth.btn}</BtnPrimary>
                </div>

                {/* <div
                  ref={helpTooltipBtnRef}
                  className={s.headerBtn}
                  onClick={(event: any) => {
                    helpTooltip ? setHelpTooltip(null) : setHelpTooltip(event.currentTarget);
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M16.1855 9.19922C16.1855 13.3414 12.8277 16.6992 8.68555 16.6992C4.54341 16.6992 1.18555 13.3414 1.18555 9.19922C1.18555 5.05708 4.54341 1.69922 8.68555 1.69922C12.8277 1.69922 16.1855 5.05708 16.1855 9.19922ZM17.1855 9.19922C17.1855 13.8936 13.38 17.6992 8.68555 17.6992C3.99113 17.6992 0.185547 13.8936 0.185547 9.19922C0.185547 4.5048 3.99113 0.699219 8.68555 0.699219C13.38 0.699219 17.1855 4.5048 17.1855 9.19922ZM8.14372 11.6466H9.48772V4.22656H8.14372V11.6466ZM9.47372 13.3266C9.29639 13.1586 9.07705 13.0746 8.81572 13.0746C8.55439 13.0746 8.33972 13.1586 8.17172 13.3266C7.99439 13.5039 7.90572 13.7186 7.90572 13.9706C7.90572 14.2132 7.99439 14.4139 8.17172 14.5726C8.33972 14.7406 8.55439 14.8246 8.81572 14.8246C9.07705 14.8246 9.29639 14.7359 9.47372 14.5586C9.64172 14.3906 9.72572 14.1852 9.72572 13.9426C9.72572 13.6999 9.64172 13.4946 9.47372 13.3266Z"/>
                  </svg>
                </div>

                <Popper ref={helpTooltipRef} id="popper" open={!!helpTooltip} anchorEl={helpTooltip}>
                  <div className={clsx(s.popper, s.helpPopper)}>
                    <div className={s.item}>How it work?</div>
                    <div className={s.item}>Learn</div>
                    <div className={s.item}>Blog</div>
                    <div className={s.item}>Help Center</div>
                  </div>
                </Popper>

                <div
                  ref={settingsTooltipBtnRef}
                  className={s.headerBtn}
                  onClick={(event: any) => {
                    router.push('/settings/account')
                    // settingsTooltip ? setSettingsTooltip(null) : setSettingsTooltip(event.currentTarget);
                  }}
                >
                  <svg className={s.engineSvg} width="18" height="19" viewBox="0 0 18 19" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M16.8892 5.39559L16.3316 4.44035C15.8598 3.63207 14.8143 3.35324 13.9944 3.81702C13.6041 4.04398 13.1384 4.10837 12.7 3.99599C12.2615 3.88362 11.8864 3.6037 11.6572 3.21797C11.5098 2.97279 11.4306 2.69354 11.4276 2.40845C11.4409 1.95137 11.2662 1.50844 10.9434 1.18056C10.6205 0.852686 10.1769 0.667781 9.7137 0.667969H8.59022C8.13641 0.667969 7.70131 0.846476 7.38118 1.164C7.06106 1.48153 6.88232 1.9119 6.8845 2.35987C6.87105 3.28479 6.10762 4.02759 5.17058 4.02749C4.88177 4.02453 4.59888 3.94634 4.35052 3.80083C3.5306 3.33705 2.48511 3.61588 2.01335 4.42416L1.41471 5.39559C0.943512 6.20286 1.22213 7.23426 2.03795 7.70273C2.56825 8.00496 2.89492 8.56351 2.89492 9.16797C2.89492 9.77243 2.56825 10.331 2.03795 10.6332C1.22317 11.0985 0.944244 12.1274 1.41471 12.9323L1.98055 13.8956C2.20159 14.2893 2.57246 14.5798 3.01109 14.7029C3.44972 14.826 3.91994 14.7714 4.31771 14.5513C4.70874 14.3261 5.17472 14.2644 5.61206 14.3799C6.0494 14.4954 6.42187 14.7786 6.64668 15.1665C6.79409 15.4117 6.8733 15.691 6.8763 15.9761C6.8763 16.9105 7.64365 17.668 8.59022 17.668H9.7137C10.6571 17.668 11.4231 16.9154 11.4276 15.9842C11.4254 15.5348 11.6053 15.1032 11.9272 14.7854C12.2491 14.4676 12.6863 14.2901 13.1415 14.2923C13.4297 14.2999 13.7114 14.3777 13.9616 14.5189C14.7794 14.9841 15.8242 14.709 16.2988 13.9037L16.8892 12.9323C17.1178 12.545 17.1805 12.0838 17.0635 11.6508C16.9465 11.2177 16.6595 10.8486 16.266 10.6251C15.8724 10.4016 15.5854 10.0325 15.4684 9.59945C15.3515 9.16642 15.4142 8.70521 15.6427 8.31797C15.7913 8.06182 16.0065 7.84944 16.266 7.70273C17.0769 7.23451 17.3549 6.20913 16.8892 5.40368V5.39559Z" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9.15601 12.3275C10.4603 12.3275 12.5292 11.3644 12.5292 9.16795C12.5292 6.82072 10.4603 6.17867 9.15601 6.17867C7.85172 6.17867 5.87505 6.94419 5.87505 9.16795C5.87505 11.3917 7.85172 12.3275 9.15601 12.3275Z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                <Popper ref={settingsTooltipRef} id="popper" open={!!settingsTooltip} anchorEl={settingsTooltip}>
                  <div className={clsx(s.popper, s.settingsPopper)}>
                    Content <br />
                    Content <br />
                    Content <br />
                    Content <br />
                    Content <br />
                  </div>
                </Popper>

                <div
                  ref={notifTooltipBtnRef}
                  className={s.headerBtn}
                  onClick={(event: any) => {
                    // notifTooltip ? setNotifTooltip(null) : setNotifTooltip(event.currentTarget);
                  }}
                >
                  <svg width="16" height="18" viewBox="0 0 16 18" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M7.05108 1.40234H8.1955C10.8076 1.40234 12.769 3.78829 12.2637 6.35101L12.239 6.47643C11.8492 8.45376 12.4933 10.4935 13.9481 11.8883C14.8954 12.7966 14.2525 14.396 12.9401 14.396H2.61755C1.3134 14.396 0.633772 12.8436 1.51845 11.8854C2.83913 10.4549 3.38249 8.47196 2.97546 6.56809L2.95404 6.46787C2.39657 3.86031 4.38459 1.40234 7.05108 1.40234ZM1.97614 6.67693C1.28561 3.44699 3.74815 0.402344 7.05108 0.402344H8.1955C11.4375 0.402344 13.872 3.36369 13.2449 6.54445L13.2201 6.66986C12.8962 8.31279 13.4314 10.0076 14.6402 11.1665C16.2379 12.6983 15.1536 15.396 12.9401 15.396H2.61755C0.4416 15.396 -0.692357 12.8057 0.783711 11.207C1.88398 10.0153 2.33666 8.36328 1.99756 6.77715L1.97614 6.67693ZM12.1729 17.0845C12.4481 17.0613 12.6523 16.8194 12.6291 16.5443C12.6059 16.2691 12.3641 16.0648 12.0889 16.088L8.63326 16.3795C8.1143 16.4232 7.59263 16.4243 7.0735 16.3825L3.40937 16.0879C3.13411 16.0658 2.89303 16.271 2.8709 16.5462C2.84877 16.8215 3.05396 17.0625 3.32922 17.0847L6.99335 17.3793C7.56712 17.4254 8.14371 17.4243 8.71729 17.3759L12.1729 17.0845Z"/>
                  </svg>
                </div>

                <Popper ref={notifTooltipRef} id="popper" open={!!notifTooltip} anchorEl={notifTooltip}>
                  <div className={clsx(s.popper, s.notifPopper)}>
                    Content <br />
                    Content <br />
                    Content <br />
                    Content <br />
                    Content <br />
                  </div>
                </Popper> */}
              </>
            )}
            <div
              ref={profileTooltipBtnRef}
              className={s.profileImg}
              onClick={(event: any) => {
                profileTooltip
                  ? dispatch(SetProfileTooltipAction(null))
                  : dispatch(SetProfileTooltipAction(event.currentTarget));
              }}
            >
              {user.avatar ? (
                <img src={user.avatar} alt="profile image" />
              ) : (
                <Skeleton variant="circular" width="100%" height="100%" />
              )}
            </div>
            {/* <FileDropdown
              authorized={true}
              fileTooltip={fileTooltip}
              fileTooltipRef={fileTooltipRef}
              categories={categories}
              designMode={false}
              initialWindow="categories"
              offsetTop={0}
            /> */}
            <ProfileDropdown
              profileTooltip={profileTooltip}
              profileTooltipRef={profileTooltipRef}
            />
            <div className={s.hamburger}>
              <HamburgerMenu
                isActive={menuState.menuOpen}
                onClick={() => {
                  dispatch(ToggleMenuAction(null));
                }}
              />
            </div>
          </div>
        </ContainerFluid>
      </div>

      {menuState.menuOpen && (
        <MenuMobileAuth
          cookieUser={cookieUser}
          bottomPanel={true}
          local={local}
        />
      )}

      <CheckoutModal userToken={userToken} />
    </>
  );
};

export default HeaderDashboard;
