import clsx from "clsx";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import s from "./DashboardLayout.module.scss";

import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { AnyAction } from "redux";
import { Api } from "../../../api";
import { SetFileDropdownAction } from "../../../redux/actions";
import { fetchUser } from "../../../redux/asyncActions";
import { RootState } from "../../../redux/store";
import useTypedSelector from "../../../utils/useTypedSelector";
import AcceptCookie from "../../AcceptCookie";
import ContainerFluid from "../../ContainerFluid";
import BottomPanel from "../../Dashboard/BottomPanel";
import HeaderDashboard from "../../Dashboard/HeaderDashboard";
import SidePanel from "../../Dashboard/SidePanel";
import FileDropdown from "../../Polotno/FileDropdown";
import { useMediaQuery } from "@mui/material";

interface DashboardLayoutProps {
  userToken: string;
  cookieUser: any;
  authorized: boolean;
  searchPanel?: boolean;
  adminPage?: boolean;
  sidePanelData: any;
  sidePanelBaseUrl: string;
  settingsPage?: boolean;
  local: any;
  headerBtnPrimaryRef?: any;
  containerClassName?: string;
}

const DashboardLayout: React.FC<
  React.PropsWithChildren<DashboardLayoutProps>
> = ({
  children,
  userToken,
  cookieUser,
  authorized,
  searchPanel,
  adminPage,
  sidePanelData,
  sidePanelBaseUrl,
  settingsPage,
  local,
  headerBtnPrimaryRef,
  containerClassName,
}) => {
  const [cookie, setCookie] = useCookies();
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.mainReducer.user);
  const isMobile = useMediaQuery("(max-width: 1000px)");

  const [categories, setCategories] = React.useState([]);

  // const upgradeToProBar = cookie.user?.plan ? !!(cookie.user?.plan === "free") : !!(user.plan === "free");
  // console.log('upgrade: ', cookie.user?.plan ? !!(cookie.user?.plan == 'free') : !!(cookieUser.plan == 'free'));

  const fileDropdown = useSelector(
    (state: RootState) => state.designReducer.fileDropdown
  );
  // used to control the dropdown <FileDropdown />
  // const [fileTooltip, setFileTooltip] = React.useState<any>(null);
  const fileTooltipRef = React.useRef<any>(null);
  // const fileTooltipBtnRef = React.useRef(null)

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

  const handleClickOutside = (event: any) => {
    if (
      fileTooltipRef.current &&
      !fileTooltipRef.current.contains(event.target) &&
      !headerBtnPrimaryRef?.current.contains(event.target) &&
      !document.querySelector(".modal")
    ) {
      // setFileTooltip(false);
      dispatch(SetFileDropdownAction(null));
    }
  };

  React.useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  return (
    <div className={s.root}>
      <Head>{/* <title>Ellty - Online graphic design platform</title> */}</Head>
      <HeaderDashboard
        userToken={userToken}
        local={local}
        cookieUser={cookieUser}
        searchPanel={searchPanel || false}
        adminPage={adminPage}
        headerBtnPrimaryRef={headerBtnPrimaryRef}
      />
      <div className={clsx(s.contentWrapper, settingsPage && s.settingsPage)}>
        <ContainerFluid className={containerClassName}>
          <div className={s.sidePanelWrapper}>
            <SidePanel
              cookieUser={cookieUser}
              baseUrl={sidePanelBaseUrl}
              sidePanelData={sidePanelData}
              svgOffset={sidePanelBaseUrl !== "/settings"}
              // remainingDownloads={cookie.user?.remainingDownloads || cookieUser.remainingDownloads}
              remainingDownloads={user.remainingDownloads}
              showProfileInfo={!!settingsPage}
              local={local}
            />
          </div>
          <div className={s.content}>{children}</div>
          <FileDropdown
            fileTooltip={fileDropdown}
            fileTooltipRef={fileTooltipRef}
            categories={categories}
            designMode={false}
            initialWindow="categories"
            offsetTop={0}
            mobile={isMobile}
            isOpenDrawer={!!fileDropdown}
            setIsOpenDrawer={(value: boolean) =>
              dispatch(SetFileDropdownAction(value ? value : null))
            }
          />
        </ContainerFluid>
      </div>
      <BottomPanel />
      <AcceptCookie local={local} />
      <svg display="none">
        <svg
          id="home"
          width="20"
          height="21"
          viewBox="0 0 20 21"
          // eslint-disable-next-line
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.9823 1.49715C10.631 1.2239 10.4553 1.08727 10.2613 1.03476C10.0902 0.988415 9.9098 0.988415 9.73865 1.03476C9.54468 1.08727 9.36902 1.2239 9.0177 1.49715L2.23539 6.77228C1.78202 7.1249 1.55534 7.30121 1.39203 7.52201C1.24737 7.7176 1.1396 7.93794 1.07403 8.17221C1 8.43667 1 8.72385 1 9.29821V16.5331C1 17.6532 1 18.2133 1.21799 18.6411C1.40973 19.0174 1.71569 19.3234 2.09202 19.5152C2.51984 19.7331 3.0799 19.7331 4.2 19.7331H6.2C6.48003 19.7331 6.62004 19.7331 6.727 19.6786C6.82108 19.6307 6.89757 19.5542 6.9455 19.4601C7 19.3532 7 19.2132 7 18.9331V12.3331C7 11.7731 7 11.4931 7.10899 11.2791C7.20487 11.091 7.35785 10.938 7.54601 10.8421C7.75992 10.7331 8.03995 10.7331 8.6 10.7331H11.4C11.9601 10.7331 12.2401 10.7331 12.454 10.8421C12.6422 10.938 12.7951 11.091 12.891 11.2791C13 11.4931 13 11.7731 13 12.3331V18.9331C13 19.2132 13 19.3532 13.0545 19.4601C13.1024 19.5542 13.1789 19.6307 13.273 19.6786C13.38 19.7331 13.52 19.7331 13.8 19.7331H15.8C16.9201 19.7331 17.4802 19.7331 17.908 19.5152C18.2843 19.3234 18.5903 19.0174 18.782 18.6411C19 18.2133 19 17.6532 19 16.5331V9.29821C19 8.72385 19 8.43667 18.926 8.17221C18.8604 7.93794 18.7526 7.7176 18.608 7.52201C18.4447 7.30121 18.218 7.1249 17.7646 6.77228L10.9823 1.49715Z"
            stroke="#232327"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <svg
          id="designs"
          width="33"
          height="34"
          viewBox="0 0 33 34"
          // eslint-disable-next-line
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 13.9608V21.654C8 22.2503 8.15242 22.8368 8.4428 23.3577C9.06065 24.466 10.2301 25.1529 11.499 25.1529H19.6568C20.5464 25.1529 21.3942 24.7759 21.99 24.1153C22.5106 23.5381 22.7987 22.7884 22.7987 22.011V13.721C22.7987 12.6214 22.2697 11.5889 21.3772 10.9466C20.7956 10.528 20.0971 10.3027 19.3805 10.3027H11.6581C10.7915 10.3027 9.95313 10.6103 9.29222 11.1708C8.47256 11.8658 8 12.8861 8 13.9608Z"
            stroke="#1F2128"
          />
          <path
            d="M22.2637 22.9791V22.9791C22.8953 22.9791 23.4973 22.7114 23.9203 22.2424L24.1916 21.9415C24.7122 21.3642 25.0004 20.6145 25.0004 19.8372V11.5472C25.0004 10.4475 24.4714 9.41506 23.5789 8.77272V8.77272C22.9972 8.35412 22.2988 8.12891 21.5821 8.12891H13.6447C12.9092 8.12891 12.1897 8.34328 11.5742 8.74579L11.4625 8.81887C11.2554 8.95429 11.0673 9.11669 10.9031 9.30179L10.6287 9.61124C10.3536 9.92142 10.2017 10.3217 10.2017 10.7363V10.7363"
            stroke="#1F2128"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.9042 13.7373C11.9454 13.7373 11.1679 14.4867 11.1679 15.4101C11.1679 16.3336 11.9454 17.0829 12.9042 17.0829C13.863 17.0829 14.6412 16.3335 14.6412 15.4101C14.6412 14.4867 13.863 13.7373 12.9042 13.7373ZM12.9012 14.7383C13.2854 14.7383 13.5977 15.0391 13.5977 15.409C13.5977 15.779 13.2854 16.0797 12.9012 16.0797C12.5173 16.0797 12.2055 15.7792 12.2055 15.409C12.2055 15.0388 12.5173 14.7383 12.9012 14.7383ZM19.1355 16.48C18.3639 15.7473 17.1611 15.8349 16.4931 16.7006L14.8118 18.8775L14.7548 18.9406C14.5532 19.1312 14.2404 19.1258 14.0453 18.9139L13.3777 18.1888L13.2835 18.0926C12.6368 17.4837 11.6371 17.52 11.03 18.2027L9.87684 19.4978L9.82378 19.5669C9.66542 19.8073 9.69207 20.1413 9.89822 20.3493C10.125 20.5781 10.4831 20.568 10.698 20.3265L11.8514 19.0312L11.9133 18.9723C12.109 18.8152 12.39 18.8336 12.5663 19.0283L13.2372 19.7571L13.3292 19.8498C14.0214 20.496 15.0914 20.4134 15.6861 19.6422L17.3672 17.4654L17.428 17.3959C17.7049 17.1163 18.1484 17.1191 18.4212 17.4187L19.9872 19.1388L20.0497 19.1981C20.2686 19.3768 20.5832 19.3626 20.7872 19.1521C21.0115 18.9206 21.0171 18.5393 20.7997 18.3004L19.2337 16.5802L19.1355 16.48Z"
            fill="#1F2128"
          />
        </svg>

        <svg
          id="folder"
          width="21"
          height="19"
          viewBox="0 0 21 19"
          // eslint-disable-next-line
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.45 4.8L10.3902 2.68047C10.0852 2.07046 9.93272 1.76544 9.7052 1.54261C9.504 1.34554 9.26151 1.19568 8.99527 1.10384C8.69421 1 8.3532 1 7.67118 1H4.04C2.9759 1 2.44385 1 2.03742 1.20709C1.67991 1.38925 1.38925 1.67991 1.20709 2.03742C1 2.44385 1 2.9759 1 4.04V4.8M1 4.8H15.44C17.0361 4.8 17.8342 4.8 18.4439 5.11063C18.9801 5.38387 19.4161 5.81987 19.6894 6.35613C20 6.96578 20 7.76385 20 9.36V13.54C20 15.1362 20 15.9342 19.6894 16.5439C19.4161 17.0801 18.9801 17.5161 18.4439 17.7894C17.8342 18.1 17.0361 18.1 15.44 18.1H5.56C3.96385 18.1 3.16578 18.1 2.55613 17.7894C2.01987 17.5161 1.58387 17.0801 1.31063 16.5439C1 15.9342 1 15.1362 1 13.54V4.8Z"
            stroke="#242124"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <svg
          id="heart"
          width="21"
          height="19"
          viewBox="0 0 21 19"
          // eslint-disable-next-line
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.4935 3.02902C8.59411 0.80848 5.42676 0.21116 3.04696 2.24451C0.667162 4.27786 0.332119 7.67753 2.20099 10.0824C3.75483 12.0819 8.45728 16.2989 9.9985 17.6638C10.1709 17.8165 10.2571 17.8928 10.3577 17.9228C10.4455 17.949 10.5415 17.949 10.6293 17.9228C10.7298 17.8928 10.8161 17.8165 10.9885 17.6638C12.5297 16.2989 17.2322 12.0819 18.786 10.0824C20.6549 7.67753 20.3607 4.25648 17.94 2.24451C15.5193 0.232549 12.3929 0.80848 10.4935 3.02902Z"
            stroke="#242124"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <svg
          id="trash"
          width="21"
          height="21"
          viewBox="0 0 21 21"
          // eslint-disable-next-line
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.27508 0H9.3H11.1H11.1249C11.7338 -4.88758e-06 12.2263 -8.9407e-06 12.6253 0.0271624C13.035 0.0550528 13.4013 0.114061 13.7451 0.26004C14.287 0.490146 14.7516 0.867424 15.052 1.35861C15.2511 1.68433 15.33 2.03268 15.366 2.4002C15.388 2.62421 15.3957 2.8798 15.3985 3.1665H17.5821H17.5943H19.7C20.0866 3.1665 20.4 3.4799 20.4 3.8665C20.4 4.2531 20.0866 4.5665 19.7 4.5665H18.2438L17.5471 15.0168L17.5451 15.046V15.046V15.0461C17.4913 15.8542 17.4481 16.502 17.3713 17.025C17.2923 17.5627 17.171 18.025 16.9305 18.4472C16.5437 19.1261 15.9602 19.672 15.257 20.0128C14.8198 20.2247 14.3505 20.315 13.8087 20.358C13.2817 20.3998 12.6325 20.3998 11.8225 20.3998H11.8224H11.7932H8.6068H8.57756H8.5775C7.7675 20.3998 7.11826 20.3998 6.59132 20.358C6.04952 20.315 5.58024 20.2247 5.14297 20.0128C4.43978 19.672 3.85634 19.1261 3.46954 18.4472C3.22901 18.025 3.10766 17.5627 3.0287 17.025C2.95191 16.502 2.90873 15.8542 2.85485 15.0459L2.85291 15.0168L2.15622 4.5665H0.7C0.313401 4.5665 0 4.2531 0 3.8665C0 3.4799 0.313401 3.1665 0.7 3.1665H2.80568H2.81794H5.0015C5.00425 2.8798 5.01203 2.62421 5.03399 2.4002C5.07003 2.03268 5.14887 1.68433 5.34802 1.35861C5.64835 0.867424 6.11301 0.490146 6.65494 0.26004C6.99874 0.114061 7.36502 0.0550528 7.77465 0.0271624C8.17373 -8.9407e-06 8.66617 -4.88758e-06 9.27508 0ZM13.9727 2.53681C13.9893 2.70594 13.9958 2.90753 13.9984 3.1665H6.40165C6.40421 2.90753 6.41073 2.70594 6.42731 2.53681C6.45259 2.27901 6.49636 2.16429 6.54245 2.08892C6.67355 1.8745 6.8973 1.67811 7.2021 1.54869C7.33961 1.4903 7.529 1.44713 7.86975 1.42393C8.21564 1.40038 8.6603 1.4 9.3 1.4H11.1C11.7397 1.4 12.1844 1.40038 12.5302 1.42393C12.871 1.44713 13.0604 1.4903 13.1979 1.54869C13.5027 1.67811 13.7264 1.8745 13.8576 2.08892C13.9036 2.16429 13.9474 2.27901 13.9727 2.53681ZM16.8407 4.5665H3.55933L4.24981 14.9236C4.30608 15.7677 4.34608 16.3601 4.41385 16.8216C4.48038 17.2747 4.5667 17.5448 4.68598 17.7542C4.93274 18.1873 5.30493 18.5355 5.75352 18.7529C5.97037 18.858 6.24556 18.9262 6.7021 18.9624C7.16716 18.9993 7.76084 18.9998 8.6068 18.9998H11.7932C12.6392 18.9998 13.2328 18.9993 13.6979 18.9624C14.1544 18.9262 14.4296 18.858 14.6465 18.7529C15.0951 18.5355 15.4673 18.1873 15.714 17.7542C15.8333 17.5448 15.9196 17.2747 15.9861 16.8216C16.0539 16.3601 16.0939 15.7677 16.1502 14.9236L16.8407 4.5665ZM8.7 7C8.7 6.6134 8.3866 6.3 8 6.3C7.6134 6.3 7.3 6.6134 7.3 7V16C7.3 16.3866 7.6134 16.7 8 16.7C8.3866 16.7 8.7 16.3866 8.7 16V7ZM12.7 7C12.7 6.6134 12.3866 6.3 12 6.3C11.6134 6.3 11.3 6.6134 11.3 7V16C11.3 16.3866 11.6134 16.7 12 16.7C12.3866 16.7 12.7 16.3866 12.7 16V7Z"
            fill="#232327"
          />
        </svg>

        <svg
          id="users"
          width="31"
          height="31"
          viewBox="0 0 31 31"
          // eslint-disable-next-line
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.3934 12.6472C11.3934 11.1331 12.6047 9.91592 14.0864 9.91592C15.5682 9.91592 16.7795 11.1331 16.7795 12.6472C16.7795 14.1613 15.5682 15.3785 14.0864 15.3785C12.6047 15.3785 11.3934 14.1613 11.3934 12.6472ZM14.0864 8.91592C12.0412 8.91592 10.3934 10.5921 10.3934 12.6472C10.3934 14.7023 12.0412 16.3785 14.0864 16.3785C14.8198 16.3785 15.5021 16.163 16.0756 15.7917C16.6494 16.1628 17.3323 16.3785 18.0644 16.3785C20.1096 16.3785 21.7574 14.7023 21.7574 12.6472C21.7574 10.5921 20.1096 8.91592 18.0644 8.91592C17.3323 8.91592 16.6494 9.13156 16.0756 9.50267C15.5021 9.13144 14.8198 8.91592 14.0864 8.91592ZM16.872 10.1974C17.4376 10.8536 17.7795 11.7111 17.7795 12.6472C17.7795 13.5833 17.4376 14.4408 16.872 15.097C17.2315 15.2774 17.6361 15.3785 18.0644 15.3785C19.5461 15.3785 20.7574 14.1613 20.7574 12.6472C20.7574 11.1331 19.5461 9.91592 18.0644 9.91592C17.6361 9.91592 17.2315 10.017 16.872 10.1974ZM12.6626 18.896C13.608 18.812 14.5588 18.812 15.5041 18.896L15.5041 18.8961L15.513 18.8967C16.016 18.9324 16.516 19.0035 17.0092 19.1096L17.0127 19.1104C17.3499 19.1804 17.6963 19.2807 17.9839 19.4265C18.2742 19.5737 18.4585 19.7436 18.5459 19.9291C18.6786 20.2115 18.6786 20.5397 18.546 20.8221C18.4587 21.0077 18.2744 21.1775 17.9847 21.3237C17.6978 21.4686 17.3522 21.5674 17.0168 21.6341L17.0168 21.6339L17.0045 21.6367C16.5138 21.7472 16.0155 21.8201 15.5139 21.8547L15.5139 21.8546L15.5057 21.8553C14.7355 21.9214 13.9618 21.9335 13.19 21.8914C13.1809 21.8909 13.1718 21.8907 13.1627 21.8907C12.9723 21.8907 12.8443 21.8891 12.7175 21.8634C12.6961 21.8591 12.6743 21.8562 12.6525 21.8547C12.1533 21.8205 11.6574 21.7477 11.1691 21.6369L11.1552 21.6339C10.8173 21.5673 10.4718 21.4685 10.185 21.3237C9.89703 21.1783 9.71097 21.0085 9.62007 20.8207C9.55504 20.681 9.52129 20.5282 9.5215 20.3733L9.52149 20.3708C9.52093 20.2197 9.55404 20.0707 9.61811 19.9349C9.70558 19.7603 9.89294 19.5884 10.1868 19.4361C10.4767 19.2858 10.8241 19.1788 11.154 19.1104L11.154 19.1104L11.1579 19.1095C11.6508 19.0031 12.1505 18.932 12.6533 18.8967L12.6533 18.8968L12.6626 18.896ZM12.5787 17.8995C13.5799 17.8108 14.5869 17.8108 15.5882 17.8995C15.8356 17.9172 16.0823 17.9426 16.3279 17.9759C16.3933 17.9343 16.4694 17.9073 16.552 17.8999C17.5548 17.8108 18.5633 17.8106 19.5661 17.8995C20.114 17.9386 20.6585 18.0161 21.1957 18.1316C21.5738 18.2102 22.0157 18.3326 22.4141 18.5347C22.8104 18.7356 23.2102 19.0393 23.4287 19.5036L23.4289 19.5038C23.6881 20.0557 23.6881 20.6958 23.4289 21.2476L23.4287 21.2479C23.2102 21.7123 22.8103 22.016 22.4133 22.2164C22.0158 22.4171 21.575 22.5379 21.196 22.6136C20.659 22.7342 20.1138 22.8139 19.5649 22.852C18.7542 22.9214 17.9397 22.9343 17.1272 22.8907H17.1248C16.9506 22.8907 16.7302 22.8908 16.4971 22.8436C16.4348 22.831 16.3777 22.8073 16.3272 22.7751C16.0815 22.8092 15.8346 22.8348 15.587 22.852C14.7762 22.9214 13.9618 22.9343 13.1493 22.8907H13.1469C12.9813 22.8907 12.7738 22.8908 12.5534 22.8502C12.0154 22.8118 11.481 22.7327 10.9547 22.6136C10.5725 22.5378 10.1318 22.4171 9.73437 22.2164C9.33678 22.0157 8.93897 21.7127 8.71755 21.2513L8.71551 21.2471L8.71553 21.2471C8.58748 20.9737 8.52128 20.6752 8.52149 20.3732C8.52056 20.0717 8.58728 19.7736 8.7169 19.5015L8.72 19.495L8.72005 19.495C8.9391 19.0516 9.33544 18.751 9.72654 18.5483C10.1226 18.343 10.5635 18.2118 10.9489 18.1316C11.4861 18.0157 12.0307 17.9382 12.5787 17.8995ZM8.52149 20.3732L8.5215 20.3745L9.02149 20.3726L8.5215 20.372L8.52149 20.3732ZM18.9381 21.8931C19.12 21.8835 19.3019 21.8709 19.4836 21.8553L19.4919 21.8546L19.4919 21.8547C19.9934 21.8201 20.4917 21.7472 20.9824 21.6367L20.9947 21.6339L20.9947 21.6341C21.3301 21.5674 21.6757 21.4686 21.9626 21.3237C22.2524 21.1775 22.4366 21.0077 22.5239 20.8221C22.6565 20.5397 22.6565 20.2115 22.5238 19.9291C22.4364 19.7436 22.2521 19.5737 21.9618 19.4265C21.6742 19.2807 21.3278 19.1804 20.9906 19.1104L20.9871 19.1096C20.4939 19.0035 19.9939 18.9324 19.4909 18.8967L19.482 18.8961L19.482 18.896C19.3003 18.8798 19.1184 18.8668 18.9363 18.8568C19.1438 19.0276 19.3266 19.2396 19.4508 19.5036L19.4509 19.5038C19.7102 20.0557 19.7102 20.6958 19.4509 21.2476L19.4508 21.2479C19.327 21.5111 19.1449 21.7226 18.9381 21.8931Z"
            fill="#1F2128"
          />
        </svg>

        <svg
          id="templates"
          width="21"
          height="21"
          viewBox="0 0 21 21"
          // eslint-disable-next-line
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.5 10.5L20 10.5M10.5 1L10.5 20M6.06667 1H14.9333C16.7068 1 17.5936 1 18.271 1.34515C18.8668 1.64875 19.3513 2.13318 19.6549 2.72903C20 3.40642 20 4.29317 20 6.06667V14.9333C20 16.7068 20 17.5936 19.6549 18.271C19.3513 18.8668 18.8668 19.3513 18.271 19.6549C17.5936 20 16.7068 20 14.9333 20H6.06667C4.29317 20 3.40642 20 2.72903 19.6549C2.13318 19.3513 1.64875 18.8668 1.34515 18.271C1 17.5936 1 16.7068 1 14.9333V6.06667C1 4.29317 1 3.40642 1.34515 2.72903C1.64875 2.13318 2.13318 1.64875 2.72903 1.34515C3.40642 1 4.29317 1 6.06667 1Z"
            stroke="#242124"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <svg
          id="wallet"
          width="33"
          height="31"
          viewBox="0 0 33 31"
          // eslint-disable-next-line
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M24.2322 17.8304H19.9259C18.7231 17.8297 18.7787 16.8555 18.778 15.6528C18.778 14.45 18.7231 13.4758 19.9259 13.4751H24.2322M21.3273 15.603H21.0749M12.416 12.2814H16.7847M10.9985 8.60938H21.8799C24.225 8.60938 24.232 10.5105 24.232 12.8556V18.663C24.232 21.0081 24.225 22.9093 21.8799 22.9093H10.9985C8.65339 22.9093 8.7456 21.0081 8.7456 18.663V12.8556C8.7456 10.5105 8.65339 8.60938 10.9985 8.60938Z"
            stroke="#1F2128"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <svg
          id="lock"
          width="34"
          height="35"
          viewBox="0 0 34 35"
          // eslint-disable-next-line
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M18.2265 9.60938H15.9854C14.3285 9.60938 12.9854 10.9525 12.9854 12.6094V14.6002H21.2265V12.6094C21.2265 10.9525 19.8834 9.60938 18.2265 9.60938ZM15.9854 8.60938C13.7762 8.60938 11.9854 10.4002 11.9854 12.6094V14.6002V14.7205C10.1396 15.0754 8.74512 16.6991 8.74512 18.6484V22.8257C8.74512 25.0348 10.536 26.8257 12.7451 26.8257H21.4493C23.6584 26.8257 25.4493 25.0349 25.4493 22.8257V18.6484C25.4493 16.7052 24.0636 15.0857 22.2265 14.7239V14.6002V12.6094C22.2265 10.4002 20.4357 8.60938 18.2265 8.60938H15.9854ZM21.4493 15.6484H12.7451C11.0883 15.6484 9.74512 16.9916 9.74512 18.6484V22.8257C9.74512 24.4826 11.0883 25.8257 12.7451 25.8257H21.4493C23.1061 25.8257 24.4493 24.4826 24.4493 22.8257V18.6484C24.4493 16.9916 23.1061 15.6484 21.4493 15.6484ZM18.4521 19.5176C18.4521 20.1 18.0822 20.596 17.5645 20.7833L17.5661 23.4514C17.5663 23.7276 17.3426 23.9516 17.0664 23.9518C16.7903 23.9519 16.5663 23.7282 16.5661 23.4521L16.5644 20.7497C16.0912 20.5412 15.7607 20.068 15.7607 19.5176C15.7607 18.7744 16.3632 18.1719 17.1064 18.1719C17.8497 18.1719 18.4521 18.7744 18.4521 19.5176Z"
            fill="#1F2128"
          />
        </svg>

        <svg
          id="test"
          width="30"
          height="35"
          viewBox="0 0 30 35"
          // eslint-disable-next-line
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.0783 8.60938H21.1937L15.2474 14.8532H19.6924L10.7847 26.175L13.6128 17.6881L8.74512 18.3496L15.0783 8.60938Z"
            fill="#FFCE22"
            stroke="#1F2128"
          />
        </svg>

        <svg
          id="engine"
          width="33"
          height="33"
          viewBox="0 0 33 33"
          // eslint-disable-next-line
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
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
      </svg>
    </div>
  );
};

DashboardLayout.defaultProps = {
  searchPanel: false,
  settingsPage: false,
};

// @ts-ignore
// export async function getServerSideProps({ req, res }) {
//   return { props: {
//       ...await serverSideTranslations(req.cookies.locale || 'en', ['common', 'index']),
//       user: !!req.cookies.user && (JSON.parse(req.cookies.user) || ''),
//     }}
// }

export default DashboardLayout;
