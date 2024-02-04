import Popper from "@mui/material/Popper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import clsx from "clsx";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import NextLink from "next/link";
import Router, { useRouter } from "next/router";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { SetProfileTooltipAction } from "../../redux/actions";
import { RootState } from "../../redux/store";
import UpgradeToProBar from "../Dashboard/UpgradeToProBar";
import s from "./ProfileDropdown.module.scss";
import getHCLocale from "../../utils/getHCLocale";

interface ProfileDropdownProps {
  profileTooltip: any;
  profileTooltipRef: any;
  offsetRight?: number;
}

// to use this component, you need to create the following

// const [profileTooltip, setProfileTooltip] = React.useState<any>(null);
// const profileTooltipRef = React.useRef(null)
// const profileTooltipBtnRef = React.useRef(null)

// const handleClickOutside = (event: any) => {
//   /* @ts-ignore */
//   if (profileTooltipRef.current && !profileTooltipRef.current.contains(event.target) && !profileTooltipBtnRef.current.contains(event.target)) {
//     setProfileTooltip(false);
//   }
// };

// React.useEffect(() => {
//   document.addEventListener("click", handleClickOutside, true);
//   return () => {
//     document.removeEventListener("click", handleClickOutside, true);
//   };
// });

// onClick={(event: any) => {
//   profileTooltip ? setProfileTooltip(null) : setProfileTooltip(event.currentTarget);
// }}

const ProfileDropdown: React.FC<
  React.PropsWithChildren<ProfileDropdownProps>
> = ({ profileTooltip, profileTooltipRef, offsetRight }) => {
  const { locale } = useRouter();
  const { t }: any = useTranslation("index");
  const profileDropdown = t("profileDropdown", { returnObjects: true });

  const dispatch = useDispatch();
  const [cookie, setCookie, removeCookie] = useCookies();
  const user = useSelector((state: RootState) => state.mainReducer.user);

  const [userPlan, setUserPlan] = useState("free");

  React.useEffect(() => {
    setUserPlan(user.plan);
  }, [user?.plan]);

  // React.useEffect(() => {
  //   dispatch(fetchUser(cookie.user_token))
  // }, [])

  const profile = (user: any) => {
    return (
      <div className={clsx(s.profileInfo, s.rootXPadding)}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          {user.avatar ? (
            <div className={s.image}>
              <Image
                src={user.avatar}
                alt="profile image"
                width="50px"
                height="50px"
              />
            </div>
          ) : (
            <Skeleton
              variant="circular"
              className={s.imageSkeleton}
              width={50}
              height={50}
            />
          )}
          <div className={s.info}>
            {user.full_name && user.email ? (
              <>
                <div className={s.name}>{user.full_name}</div>
                <div className={s.email}>{user.email}</div>
              </>
            ) : (
              <Stack
                direction="column"
                justifyContent="space-around"
                className={s.textSkeletonWrapper}
              >
                <Skeleton variant="rectangular" width="100%" height={17} />
                <Skeleton variant="rectangular" width="100%" height={15} />
              </Stack>
            )}
          </div>
        </Stack>
      </div>
    );
  };

  return (
    <Popper
      ref={profileTooltipRef}
      id="popper"
      open={!!profileTooltip}
      anchorEl={profileTooltip}
    >
      <div
        className={clsx(s.popper, s.profilePopper)}
        style={{ right: `${offsetRight}px` }}
      >
        {profile(user)}

        {userPlan === "free" && (
          <div className={clsx(s.proBar, s.rootXPadding)}>
            <UpgradeToProBar
              remainingDownloads={user.remainingDownloads}
              br={false}
            />
          </div>
        )}

        <div className={s.linkList}>
          <NextLink href="/settings" passHref>
            <a>
              <div
                className={clsx(s.popperLink, s.rootXPadding)}
                onClick={() => {
                  dispatch(SetProfileTooltipAction(null));
                }}
              >
                {profileDropdown.settings}
              </div>
            </a>
          </NextLink>

          <NextLink href={getHCLocale(locale)} passHref>
            <a>
              <div
                className={clsx(s.popperLink, s.rootXPadding)}
                onClick={() => {
                  dispatch(SetProfileTooltipAction(null));
                }}
              >
                {profileDropdown.helpCenter}
              </div>
            </a>
          </NextLink>

          <NextLink href="/policy" passHref>
            <a>
              <div
                className={clsx(s.popperLink, s.rootXPadding)}
                onClick={() => {
                  dispatch(SetProfileTooltipAction(null));
                }}
              >
                {profileDropdown.legal}
              </div>
            </a>
          </NextLink>

          <div
            className={clsx(s.popperLink, s.rootXPadding)}
            onClick={() => {
              removeCookie("user", { path: "/" });
              removeCookie("user_token", { path: "/" });
              Router.reload();
            }}
          >
            <span>{profileDropdown.logout}</span>
          </div>
        </div>
      </div>
      {/* ./popper */}
    </Popper>
  );
};

export default ProfileDropdown;
