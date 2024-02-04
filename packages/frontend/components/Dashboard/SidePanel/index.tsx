import Stack from "@mui/material/Stack";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import clsx from "clsx";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { useIsMacValue } from "../../../utils/useIsMacValue";
import s from "./SidePanel.module.scss";

export interface ISidePanelData {
  text: string;
  value: string;
  svg: string;
}

interface SidePanelProps {
  cookieUser: any;
  sidePanelData: ISidePanelData[];
  baseUrl: string;
  remainingDownloads: number;
  showProfileInfo: boolean;
  local: any;
  svgOffset?: boolean;
}

const profile = (user: any) => (
  <div className={s.profileInfo}>
    <Stack direction="row" alignItems="center">
      <div className={s.image}>
        <img src={user.avatar} alt="profile image" />
      </div>
      <div className={s.info}>
        <div className={s.name}>{user.full_name}</div>
        <div className={s.email}>{user.email}</div>
      </div>
    </Stack>
  </div>
);

const svgWidthMap: Record<string, number> = {
  home: 18,
  trash: 20.4,
};

const getSvgWidth = (svg: string) => {
  return svgWidthMap[svg] ?? 19;
};

const SidePanel: React.FC<React.PropsWithChildren<SidePanelProps>> = ({
  cookieUser,
  sidePanelData,
  baseUrl,
  remainingDownloads,
  showProfileInfo,
  local,
  svgOffset = true,
}) => {
  const router = useRouter();
  const [cookie, setCookie, removeCookie] = useCookies();
  const dispatch = useDispatch();
  const [isOpenDrawer, setIsOpenDrawer] = React.useState<boolean>(false);

  const isMac = useIsMacValue();
  // console.log("sidePanelData")
  // console.log(sidePanelData)

  const navbarItems = sidePanelData.map((item) => {
    if (item.value === "liked") return;
    return (
      <NextLink
        href={`${baseUrl}/${item.value}`}
        passHref
        key={item.value}
        locale={cookie.locale}
      >
        <button
          className={clsx(
            s.navbarItem,
            router.pathname.includes(item.value) &&
              router.pathname != "/" &&
              item.value != "" &&
              s.active,
            router.pathname == "/" && item.value == "" && s.active,
            router.pathname == "/admin" && item.value == "" && s.active
          )}
        >
          <div className={s.svgWrapper}>
            <svg className={item.svg}>
              <use
                href={`#${item.svg}`}
                strokeWidth="1.4"
                width={isMac && svgOffset ? getSvgWidth(item.svg) : undefined}
                {...(svgOffset ? { x: 6, y: 6 } : {})}
              />
            </svg>
          </div>
          <span>{item.text}</span>
        </button>
      </NextLink>
    );
  });

  return (
    <div className={s.root}>
      {showProfileInfo && (
        <div
          className={s.profile}
          onClick={() => {
            setIsOpenDrawer(true);
          }}
        >
          {profile(cookie.user || cookieUser)}

          <div className={clsx(s.chevron, isOpenDrawer && s.rotate)}>
            <svg
              viewBox="0 0 9 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.36839 1.28342L8.43945 8.35449L1.36838 15.4256"
                stroke="#1F2128"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      )}

      <nav className={s.navbar}>{navbarItems}</nav>

      {/* <div className={s.upgradeToProBarWrapper}>
        {upgradeToProBar && (
          <UpgradeToProBar remainingDownloads={remainingDownloads} br={true} />
        )}
      </div> */}

      <SwipeableDrawer
        anchor="bottom"
        open={isOpenDrawer}
        onOpen={() => {
          setIsOpenDrawer(true);
        }}
        onClose={() => {
          setIsOpenDrawer(false);
        }}
      >
        <div className={s.drawer}>
          {profile(cookie.user || cookieUser)}

          <div className={s.menuList}>
            <div
              className={s.menuItem}
              onClick={() => {
                setIsOpenDrawer(false);
              }}
            >
              <NextLink href="/settings" passHref>
                <a>
                  <div className={s.svgWrapper}>
                    <svg className={s.heart}>
                      <use href="#engine" />
                    </svg>
                  </div>
                  <span>Settings</span>
                </a>
              </NextLink>
            </div>

            <div className={s.menuItem}>
              <NextLink href="/contact" passHref>
                <a>
                  <div className={s.svgWrapper}>
                    <svg className={s.heart}>
                      <use href="#help" />
                    </svg>
                  </div>
                  <span>Help Center</span>
                </a>
              </NextLink>
            </div>

            <div className={s.menuItem}>
              <NextLink href="/policy" passHref>
                <a>
                  <div className={s.svgWrapper}>
                    <svg className={s.heart}>
                      <use href="#legal" />
                    </svg>
                  </div>
                  <span>Legal</span>
                </a>
              </NextLink>
            </div>

            <div
              className={s.menuItem}
              onClick={() => {
                removeCookie("user", { path: "/" }), router.reload();
              }}
            >
              <div className={s.svgWrapper}>
                <svg className={s.heart}>
                  <use href="#logOut" />
                </svg>
              </div>
              <span>Log out</span>
            </div>
          </div>
        </div>
      </SwipeableDrawer>

      <svg display="none">
        <symbol
          id="engine"
          width="36"
          height="36"
          viewBox="0 0 36 36"
          // eslint-disable-next-line
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M27.5692 13.6764L26.9043 12.6088C26.3419 11.7054 25.0953 11.3938 24.1177 11.9121C23.6524 12.1658 23.0971 12.2377 22.5744 12.1121C22.0516 11.9865 21.6043 11.6737 21.3311 11.2426C21.1554 10.9686 21.0609 10.6564 21.0574 10.3378C21.0732 9.82697 20.8649 9.33193 20.48 8.96548C20.095 8.59903 19.5661 8.39237 19.0138 8.39258H17.6743C17.1332 8.39258 16.6145 8.59209 16.2328 8.94697C15.8511 9.30186 15.638 9.78285 15.6406 10.2835C15.6245 11.3173 14.7143 12.1474 13.5971 12.1473C13.2527 12.144 12.9154 12.0566 12.6193 11.894C11.6417 11.3757 10.3952 11.6873 9.83269 12.5907L9.11893 13.6764C8.55712 14.5786 8.88932 15.7314 9.86203 16.255C10.4943 16.5927 10.8838 17.217 10.8838 17.8926C10.8838 18.5682 10.4943 19.1924 9.86203 19.5302C8.89056 20.0503 8.558 21.2002 9.11893 22.0997L9.79358 23.1764C10.0571 23.6164 10.4993 23.9411 11.0223 24.0787C11.5453 24.2162 12.1059 24.1553 12.5802 23.9092C13.0464 23.6575 13.602 23.5885 14.1234 23.7177C14.6449 23.8468 15.089 24.1633 15.357 24.5969C15.5328 24.8709 15.6272 25.183 15.6308 25.5016C15.6308 26.546 16.5457 27.3926 17.6743 27.3926H19.0138C20.1386 27.3926 21.052 26.5515 21.0574 25.5107C21.0547 25.0084 21.2692 24.526 21.653 24.1709C22.0368 23.8157 22.5581 23.6173 23.1009 23.6197C23.4444 23.6282 23.7803 23.7153 24.0786 23.8731C25.0537 24.3929 26.2994 24.0855 26.8652 23.1854L27.5692 22.0997C27.8417 21.6669 27.9165 21.1515 27.777 20.6675C27.6376 20.1835 27.2953 19.7709 26.8261 19.5212C26.3569 19.2714 26.0147 18.8588 25.8752 18.3748C25.7357 17.8908 25.8105 17.3754 26.083 16.9426C26.2602 16.6563 26.5167 16.4189 26.8261 16.255C27.793 15.7317 28.1244 14.5856 27.5692 13.6854V13.6764Z"
            stroke="#1F2128"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18.3489 21.4238C19.904 21.4238 22.3707 20.3474 22.3707 17.8926C22.3707 15.2692 19.904 14.5516 18.3489 14.5516C16.7938 14.5516 14.437 15.4072 14.437 17.8926C14.437 20.3779 16.7938 21.4238 18.3489 21.4238Z"
            stroke="#1F2128"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </symbol>

        <symbol
          id="help"
          width="36"
          height="36"
          viewBox="0 0 36 36"
          // eslint-disable-next-line
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M26.8457 17.8926C26.8457 22.587 23.0401 26.3926 18.3457 26.3926C13.6513 26.3926 9.8457 22.587 9.8457 17.8926C9.8457 13.1982 13.6513 9.39258 18.3457 9.39258C23.0401 9.39258 26.8457 13.1982 26.8457 17.8926ZM27.8457 17.8926C27.8457 23.1393 23.5924 27.3926 18.3457 27.3926C13.099 27.3926 8.8457 23.1393 8.8457 17.8926C8.8457 12.6459 13.099 8.39258 18.3457 8.39258C23.5924 8.39258 27.8457 12.6459 27.8457 17.8926ZM18.0244 18.3186C17.9031 18.5986 17.8424 18.9252 17.8424 19.2986H19.2424C19.2424 18.9159 19.3311 18.5939 19.5084 18.3326C19.6951 18.0712 19.9797 17.7679 20.3624 17.4226C20.6611 17.1519 20.8991 16.9186 21.0764 16.7226C21.2537 16.5266 21.4031 16.2839 21.5244 15.9946C21.6551 15.6959 21.7204 15.3552 21.7204 14.9726C21.7204 14.1979 21.4217 13.5912 20.8244 13.1526C20.2271 12.7046 19.4197 12.4806 18.4024 12.4806C17.5997 12.4806 16.8904 12.6159 16.2744 12.8866C15.6677 13.1572 15.1684 13.5446 14.7764 14.0486L15.7984 14.7766C16.3771 14.0392 17.2124 13.6706 18.3044 13.6706C18.9297 13.6706 19.4197 13.8106 19.7744 14.0906C20.1291 14.3612 20.3064 14.7252 20.3064 15.1826C20.3064 15.5186 20.2177 15.8079 20.0404 16.0506C19.8631 16.2839 19.5877 16.5639 19.2144 16.8906C18.9157 17.1612 18.6731 17.3946 18.4864 17.5906C18.3091 17.7866 18.1551 18.0292 18.0244 18.3186ZM17.8984 22.2246C18.0757 22.3926 18.2951 22.4766 18.5564 22.4766C18.8084 22.4766 19.0184 22.3926 19.1864 22.2246C19.3637 22.0472 19.4524 21.8326 19.4524 21.5806C19.4524 21.3286 19.3684 21.1186 19.2004 20.9506C19.0324 20.7732 18.8177 20.6846 18.5564 20.6846C18.2951 20.6846 18.0757 20.7732 17.8984 20.9506C17.7304 21.1186 17.6464 21.3286 17.6464 21.5806C17.6464 21.8326 17.7304 22.0472 17.8984 22.2246Z"
            fill="#1F2128"
          />
        </symbol>

        <symbol
          id="legal"
          width="36"
          height="36"
          viewBox="0 0 36 36"
          // eslint-disable-next-line
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M26.83 15.5842L26.8289 15.6068V15.6294C26.8289 17.7288 25.8624 20.4677 24.2413 22.6875C22.6107 24.9204 20.4994 26.3926 18.3373 26.3926C16.1752 26.3926 14.064 24.9204 12.4333 22.6875C10.8128 20.4685 9.84635 17.7306 9.8457 15.6315C9.85508 13.5047 10.1646 12.6146 10.4613 12.2341C10.6859 11.9459 11.0088 11.8165 11.8516 11.7848C12.0194 11.7785 12.2099 11.7769 12.4184 11.7751C13.1524 11.7689 14.1078 11.7608 15.069 11.539C16.1116 11.2983 17.1933 10.8132 18.2643 9.87297C19.9251 11.5178 22.0707 11.5448 23.6176 11.5642C23.9022 11.5678 24.1666 11.5711 24.4039 11.5842C25.3747 11.6378 25.8916 11.8026 26.2196 12.1777C26.5714 12.5799 26.9252 13.4774 26.83 15.5842ZM12.4815 10.7732C10.3449 10.7933 8.86648 10.8071 8.8457 15.6294C8.8457 20.3394 13.0952 27.3926 18.3373 27.3926C23.5794 27.3926 27.8289 20.3394 27.8289 15.6294C28.0541 10.6473 25.9796 10.6058 23.5506 10.5572C22.0025 10.5263 20.3103 10.4924 18.9779 9.17452C18.7534 8.95239 18.539 8.69379 18.3373 8.39258C18.097 8.66101 17.8569 8.89897 17.6177 9.10994C15.7667 10.7424 13.9653 10.7593 12.4815 10.7732ZM23.8501 15.26C24.0514 15.071 24.0614 14.7546 23.8724 14.5533C23.6834 14.352 23.367 14.342 23.1656 14.531L17.9053 19.4692L14.4515 17.2011C14.2207 17.0496 13.9107 17.1138 13.7591 17.3446C13.6076 17.5754 13.6718 17.8854 13.9026 18.037L17.6857 20.5214L18.0151 20.7377L18.3024 20.468L23.8501 15.26Z"
            fill="#1F2128"
          />
        </symbol>

        <symbol
          id="logOut"
          width="36"
          height="36"
          viewBox="0 0 36 36"
          // eslint-disable-next-line
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M27.7325 17.5429L24.5505 14.361C24.3552 14.1657 24.0386 14.1657 23.8434 14.361C23.6481 14.5562 23.6481 14.8728 23.8434 15.0681L26.1718 17.3965H15.6322C15.3561 17.3965 15.1322 17.6203 15.1322 17.8965C15.1322 18.1726 15.3561 18.3965 15.6322 18.3965H26.1718L23.8434 20.7249C23.6481 20.9202 23.6481 21.2368 23.8434 21.432C24.0386 21.6273 24.3552 21.6273 24.5505 21.432L27.7325 18.25C27.9277 18.0548 27.9277 17.7382 27.7325 17.5429ZM20.5548 13.7516C20.5549 14.0278 20.7789 14.2516 21.055 14.2515C21.3311 14.2514 21.5549 14.0275 21.5548 13.7513L21.5546 12.8912C21.5539 10.4065 19.5394 8.39258 17.0546 8.39258H13.3449C10.8597 8.39258 8.84494 10.4073 8.84494 12.8926V22.8952C8.84494 25.3805 10.8597 27.3952 13.3449 27.3952H17.0534C19.5387 27.3952 21.5534 25.3805 21.5534 22.8952V22.1978C21.5534 21.9216 21.3295 21.6978 21.0534 21.6978C20.7773 21.6978 20.5534 21.9216 20.5534 22.1978V22.8952C20.5534 24.8282 18.9864 26.3952 17.0534 26.3952H13.3449C11.4119 26.3952 9.84494 24.8282 9.84494 22.8952V12.8926C9.84494 10.9596 11.4119 9.39258 13.3449 9.39258H17.0546C18.9872 9.39258 20.554 10.9589 20.5546 12.8915L20.5548 13.7516Z"
            fill="#1F2128"
          />
        </symbol>
      </svg>
    </div>
  );
};

export default SidePanel;
