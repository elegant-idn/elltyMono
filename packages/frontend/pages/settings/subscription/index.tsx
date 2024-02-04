import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import clsx from "clsx";
import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import React, { useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import { Api } from "../../../api";
import BtnOutline from "../../../components/BtnOutline";
import BtnSecondary from "../../../components/BtnSecondary";
import UpgradeToProBar from "../../../components/Dashboard/UpgradeToProBar";
import DashboardLayout from "../../../components/Layouts/DashboardLayout";
import PageLayout from "../../../components/Layouts/PageLayout";
import LinkBack from "../../../components/LinkBack";
import { formatDate } from "../../../utils/formatDate";
import useTypedSelector from "../../../utils/useTypedSelector";
import s from "./SubscriptionPage.module.scss";

interface SubscriptionPageProps {
  cookieUser: any;
  userToken: string;
}

const SubscriptionPage: NextPage<SubscriptionPageProps> = ({
  cookieUser,
  userToken,
}) => {
  const { t: local }: any = useTranslation("index");
  const user = useTypedSelector((state) => state.mainReducer.user);
  const { t }: any = useTranslation("AccountSetings");
  const subcriptionLocal = t("subcription", { returnObjects: true });
  const plans = local("plansPage", { returnObjects: true });
  const headerBtnPrimaryRef = React.useRef(null);
  const dropDownRef = useRef<any>(null);
  const [isUnsubscribeOpen, setIsUnsubscribeOpen] = React.useState(false);

  const [isCancelling, setCancelling] = React.useState(false);
  const [hasCancelled, setHasCancelled] = React.useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] =
    React.useState(false);

  const handleClose = () => {
    setIsUnsubscribeOpen(false);
  };

  const ClickOutside = (event: any) => {
    if (isUnsubscribeOpen) return;

    if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
      setIsUnsubscribeOpen(false);
    }
  };

  const [cookie] = useCookies();

  const handleCancelSubscription = async () => {
    setCancelling(true);

    const axiosHeaders = {
      headers: {
        Authorization: cookie.user.accessToken,
      },
    };
    await Api.post("/user/cancel-subscription", undefined, axiosHeaders);

    setHasCancelled(true);
    setCancelling(false);
    setIsUnsubscribeOpen(false);

    if (!user.subscription) {
      setShowCancelConfirmation(true);
    }
  };

  const handleOpen = () => {
    setIsUnsubscribeOpen(true);
  };

  const yellowTick = () => (
    <svg>
      <svg
        id="done"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8Z"
          fill="#FDF8F3"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.65072 10L10.919 6.59559C11.1676 6.33663 11.1592 5.92515 10.9002 5.67655C10.6412 5.42794 10.2298 5.43634 9.98115 5.6953L7.48938 8.2909L6.02643 7.25187C5.73375 7.044 5.32798 7.11275 5.12011 7.40543C4.91224 7.69811 4.98099 8.10389 5.27367 8.31175L7.65072 10Z"
          fill="#FFCE22"
        />
      </svg>
    </svg>
  );
  useEffect(() => {
    document.addEventListener("click", ClickOutside, true);
    return () => {
      document.removeEventListener("click", ClickOutside, true);
    };
  });

  const subscriptionWillCancel =
    user.subscription?.status === "will-cancel" || hasCancelled;

  const showCancelButton =
    (!subscriptionWillCancel ||
      (subscriptionWillCancel && user.subscription?.paymentDue)) &&
    user.plan &&
    !user.cancelSubscriptionDisabled;

  return (
    <PageLayout userToken={userToken}>
      <Head>
        <title>{t("headTitle")}</title>
      </Head>
      <DashboardLayout
        userToken={userToken}
        cookieUser={cookieUser}
        authorized={cookieUser ? true : false}
        sidePanelData={t("navbarItemsData", { returnObjects: true })}
        sidePanelBaseUrl="/settings"
        local={local}
        headerBtnPrimaryRef={headerBtnPrimaryRef}
      >
        <div className={s.root}>
          <div className={s.linkBackWrapper}>
            <LinkBack href="/settings">{subcriptionLocal.title}</LinkBack>
          </div>
          <div className={s.blockTitle}>{subcriptionLocal.title}</div>
          <div className={s.wrapper}>
            {user.plan === "free" ? (
              <>
                <div className={s.card}>
                  <label>Free</label>
                  <p className={s.underText}>{plans.cards.free.description}</p>
                  {Object.keys(plans.cards.free)
                    .slice(2)
                    .map((item: string) => (
                      <div className={s.adv} key={item}>
                        {yellowTick()}
                        {plans.cards.free[item]}
                      </div>
                    ))}
                </div>
                <div className={s.card}>
                  <label>Pro</label>
                  <p className={s.underText}>{subcriptionLocal.pro.subtitle}</p>
                  <UpgradeToProBar
                    remainingDownloads={cookieUser.remainingDownloads}
                    br={true}
                  />
                  <br />
                  {Object.keys(plans.cards.pro)
                    .slice(2)
                    .map((item: string) => (
                      <div className={s.adv} key={item}>
                        {yellowTick()}
                        {plans.cards.pro[item]}
                      </div>
                    ))}
                </div>
              </>
            ) : (
              <div className={s.card}>
                <div className={s.HeaderWrapper}>
                  <label>Pro </label>
                </div>

                <p className={s.underText}>{subcriptionLocal.pro.subtitle}</p>
                {Object.keys(plans.cards.pro)
                  .slice(2)
                  .map((item: string) => (
                    <div className={s.adv} key={item}>
                      {yellowTick()}
                      {plans.cards.pro[item]}
                    </div>
                  ))}

                {showCancelButton && (
                  <BtnSecondary
                    className={s.cancelBtn}
                    onClick={handleOpen}
                    disabled={subscriptionWillCancel}
                  >
                    {subscriptionWillCancel
                      ? t("subcription.activeUntil", {
                          date: formatDate(user.subscription.paymentDue),
                        })
                      : subcriptionLocal.temporaryText}
                  </BtnSecondary>
                )}
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>

      <Modal
        open={isUnsubscribeOpen}
        onClose={handleClose}
        closeAfterTransition
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Box className={clsx("modal", s.root)}>
          <Box className={s.modalHolder}>
            <button className={s.closeBtn} onClick={handleClose}></button>
            <div className={s.title}>{subcriptionLocal.temporaryText}</div>
            <div className={s.text}>
              {" "}
              {subcriptionLocal.cancelSubscriptionWarning}
            </div>
            <Box
              sx={{
                display: "flex",
                justifycontent: "space-between",
                margin: "20px 12px",
                gap: "10px",
              }}
            >
              <BtnOutline
                variant="root"
                onClick={handleClose}
                disabled={isCancelling}
              >
                <label>{subcriptionLocal.keepSubscription}</label>
              </BtnOutline>
              <BtnOutline
                variant="red"
                disabled={isCancelling}
                onClick={handleCancelSubscription}
              >
                {subcriptionLocal.btn1}
              </BtnOutline>
            </Box>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={showCancelConfirmation}
        onClose={handleClose}
        closeAfterTransition
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Box className={clsx("modal", s.root)}>
          <Box className={s.modalHolder}>
            <button
              className={s.closeBtn}
              onClick={() => setShowCancelConfirmation(false)}
            ></button>
            <div className={s.title}>
              {subcriptionLocal.subscriptionCancelledTitle}
            </div>
            <div className={s.text}>
              {subcriptionLocal.subscriptionCancelledText}
            </div>
            <Box
              sx={{
                display: "flex",
                justifycontent: "space-between",
                margin: "20px 12px",
              }}
            >
              <BtnOutline
                variant="root"
                onClick={() => setShowCancelConfirmation(false)}
              >
                {subcriptionLocal.subscriptionCancelledBtn}
              </BtnOutline>
            </Box>
          </Box>
        </Box>
      </Modal>
    </PageLayout>
  );
};

// @ts-ignore
export async function getServerSideProps({ req, res, locale }) {
  const cookieUser = !!req.cookies.user && (JSON.parse(req.cookies.user) || "");

  if (!cookieUser) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      ...(await serverSideTranslations(locale || req.cookies.locale || "en", [
        "common",
        "index",
        "AuthModal",
        "Checkout",
        "AccountSetings",
      ])),
      cookieUser: !!req.cookies.user && (JSON.parse(req.cookies.user) || ""),
      userToken: !!req.cookies.user_token && (req.cookies.user_token || null),
    },
  };
}

export default SubscriptionPage;
