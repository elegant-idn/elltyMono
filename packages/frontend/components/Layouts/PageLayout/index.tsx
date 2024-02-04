import Router, { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { AnyAction } from "redux";
import data from "../../../data/main";
import { ChangeLangAction } from "../../../redux/actions";
import { fetchUser } from "../../../redux/asyncActions";
import { RootState } from "../../../redux/store";

interface PageLayoutProps {
  userToken: string | null;
}

const ONE_MONTH = 1000 * 60 * 60 * 24 * 365 * 10;

const PageLayout: React.FC<React.PropsWithChildren<PageLayoutProps>> = ({
  children,
  userToken,
}) => {
  const router = useRouter();
  const { pathname, asPath, query } = router;
  const dispatch = useDispatch();
  const [cookie, setCookie, removeCookie] = useCookies();
  const [didMountIsDone, setDidMountIsDone] = React.useState<boolean>(false);
  const user = useSelector((state: RootState) => state.mainReducer.user);
  const userFailure = useSelector(
    (state: RootState) => state.mainReducer.fetchUserFail
  );

  useEffect(() => {
    if (!userFailure.status) return;

    removeCookie("user", { path: "/" });
    removeCookie("user_token", { path: "/" });
    Router.reload();
  }, [userFailure, removeCookie]);

  React.useEffect(() => {
    // console.log('component did mount', cookie.locale, router.locale);
    if (router.locale != cookie.locale) {
      // console.log('сайт сменил локализацию через поиск. строку');
      setCookie("locale", router.locale, {
        path: "/",
        expires: new Date(Date.now() + ONE_MONTH),
      });
      const langObj = data.langList.find((s) => s.abbr == router.locale);
      dispatch(ChangeLangAction(langObj));
    } else {
      const langObj = data.langList.find((s) => s.abbr == cookie.locale);
      dispatch(ChangeLangAction(langObj));
    }

    // temporarily, until we get rid of "user" cookies and cookieUser
    // prop in the components throughout the project
    if (cookie.user && !cookie.user_token) {
      removeCookie("user", { path: "/" });
      router.reload();
    }

    if (!userToken) return;

    if (user.email === null)
      dispatch(fetchUser(userToken) as unknown as AnyAction);

    setDidMountIsDone(true);
  }, []);

  React.useEffect(() => {
    // console.log("cookie.locale");
    if (!didMountIsDone) return;

    // console.log('component did update', cookie.locale);
    // when the page is rendered for the first time in redux state, the
    // application language is set
    // router.locale is the default value that i18n has defined in its own way
    if (!cookie.locale) {
      setCookie("locale", router.locale, {
        path: "/",
        expires: new Date(Date.now() + ONE_MONTH),
      });
      const langObj = data.langList.find((s) => s.abbr == router.locale);
      dispatch(ChangeLangAction(langObj));
    } else {
      const langObj = data.langList.find((s) => s.abbr == cookie.locale);
      dispatch(ChangeLangAction(langObj));
      router.push({ pathname, query }, asPath, { locale: cookie.locale });
      setCookie("locale", cookie.locale, {
        path: "/",
        expires: new Date(Date.now() + ONE_MONTH),
      });
    }
  }, [cookie.locale]);

  React.useEffect(() => {
    // console.log("router.locale");
    if (router.locale != cookie.locale) {
      setCookie("locale", router.locale, {
        path: "/",
        expires: new Date(Date.now() + ONE_MONTH),
      });
      const langObj = data.langList.find((s) => s.abbr == router.locale);
      dispatch(ChangeLangAction(langObj));
    }
  }, [router.locale]);

  React.useEffect(() => {
    // console.log("router");

    // redirect from localization /en
    if (!cookie.locale) return;
    if (window.location.href.indexOf("/en/") !== -1) {
      router.push({ pathname, query }, asPath, { locale: cookie.locale });
    }
  }, [router]);

  // React.useEffect(() => {
  //   console.log(router.locale);
  // }, [router.locale])

  return <>{children}</>;
};

export default PageLayout;
