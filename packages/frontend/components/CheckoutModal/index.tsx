import clsx from "clsx";
import React, { useState } from "react";
import s from "./CheckoutModal.module.scss";

import { useDispatch, useSelector } from "react-redux";
import {
  SetCheckoutModalBackdropTimeoutAction,
  ToggleCheckoutModalAction,
} from "../../redux/actions";
import { RootState } from "../../redux/store";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js/pure";
import CheckoutForm from "../CheckoutForm";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useTranslation } from "next-i18next";

let stripeKey: string;
if (process.env.NODE_ENV === "production") {
  stripeKey =
    "pk_live_51JsjgVLnTf4V6Br3koo7UEnnL3ardwX0dvsjOvapZAajSEM3V8mXpg5z6sdHoPQMF11XOgBwdr4qmNxd0HQnpvnb00HuVZRhmn";
} else {
  stripeKey =
    "pk_test_51JsjgVLnTf4V6Br3TCi8g9sbedkIp3xHJM3mWGgeDm8moY8qveHD7C0jagfyh6GOMKZ2VgW8l5VoWcxIQZtZ6UHt00TJuKyUgX";
}

// const stripePromise = loadStripe(stripeKey);

interface CheckoutModalProps {
  userToken: string;
  preloadStripe?: boolean;
}

const CheckoutModal: React.FC<React.PropsWithChildren<CheckoutModalProps>> = ({
  userToken,
  preloadStripe,
}) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const modalOpen = useSelector(
    (state: RootState) => state.mainReducer.openCheckoutModal
  );
  const checkoutModalBackdropTimeout = useSelector(
    (state: RootState) => state.mainReducer.checkoutModalBackdropTimeout
  );
  const checkoutStep = useSelector(
    (state: RootState) => state.mainReducer.checkoutStep
  );
  // const formOpen = useSelector((state: RootState) => state.mainReducer.authForm)

  const { t }: any = useTranslation("Checkout");
  const i18n = t("banner", { returnObjects: true });

  const [stripePromise, setStripePromise] = React.useState<any>();

  React.useEffect(() => {
    if (stripePromise) return;

    async function getStripePromise() {
      setIsLoading(true);
      const promise = await loadStripe(stripeKey);
      setStripePromise(promise);
      setIsLoading(false);
    }

    if (typeof preloadStripe === "undefined" || !!preloadStripe || modalOpen) {
      getStripePromise();
    }
  }, [preloadStripe, stripePromise, modalOpen]);

  return (
    <Modal
      open={modalOpen}
      onClose={() => {
        dispatch(SetCheckoutModalBackdropTimeoutAction(true));
        dispatch(ToggleCheckoutModalAction(false));
      }}
      closeAfterTransition
      BackdropProps={{
        timeout: checkoutModalBackdropTimeout ? 500 : 0,
      }}
    >
      <Box className={clsx("modal", s.root)}>
        {/* <svg
          className={clsx(checkoutStep == 'step2' ? null : 'hidden', s.backSvg)}
          // onClick={() => {dispatch(ChangeCheckoutStepAction('step1'))}}
          viewBox="0 0 6 10"
        >
          <path d="M1.45222 0.644603L5.40234 4.59473L1.39462 8.60245" strokeLinecap="round" strokeLinejoin="round"/>
        </svg> */}

        {/* <svg
          onClick={() => {dispatch(ChangeCheckoutStepAction('step1'))}}
          className={clsx(checkoutStep == 'step2' ? null : 'hidden', s.backSvg)}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M15.5509 21.4998L6.33398 12.0195L15.6853 2.401" stroke="#1F2128" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg> */}

        <button
          className={s.closeBtn}
          onClick={() => {
            dispatch(SetCheckoutModalBackdropTimeoutAction(true));
            dispatch(ToggleCheckoutModalAction(false));
          }}
        />

        <div className={s.banner}>
          {/* <Image src="/plans/banner1.png" layout="fill" objectFit="cover" /> */}
          <div className={s.bannerTitle}>{i18n.title}</div>

          <div className={s.bannerSubtitle}>{i18n.benfTitle}</div>

          <div className={s.benefitsList}>
            <div className={s.benefitItem}>
              <svg
                width="17"
                height="12"
                viewBox="0 0 17 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.6689 2.71364C15.743 2.64441 16.9419 1.45333 16.2052 0.746045C15.4684 0.0387583 14.6958 0.568188 13.9885 1.30494L6.89945 8.68937L2.73739 5.73335C1.90472 5.14197 1.13796 4.90082 0.633171 5.61156C0.0417881 6.44423 1.13025 7.07122 1.32236 7.22898L7.2145 11.5859L15.6689 2.71364Z"
                  fill="#FFCE22"
                />
              </svg>
              {i18n.benf1}
            </div>
            {
              <div className={s.benefitItem}>
                <svg
                  width="17"
                  height="12"
                  viewBox="0 0 17 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.6689 2.71364C15.743 2.64441 16.9419 1.45333 16.2052 0.746045C15.4684 0.0387583 14.6958 0.568188 13.9885 1.30494L6.89945 8.68937L2.73739 5.73335C1.90472 5.14197 1.13796 4.90082 0.633171 5.61156C0.0417881 6.44423 1.13025 7.07122 1.32236 7.22898L7.2145 11.5859L15.6689 2.71364Z"
                    fill="#FFCE22"
                  />
                </svg>
                {i18n.benf2}
              </div>
            }
            <div className={s.benefitItem}>
              <svg
                width="17"
                height="12"
                viewBox="0 0 17 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.6689 2.71364C15.743 2.64441 16.9419 1.45333 16.2052 0.746045C15.4684 0.0387583 14.6958 0.568188 13.9885 1.30494L6.89945 8.68937L2.73739 5.73335C1.90472 5.14197 1.13796 4.90082 0.633171 5.61156C0.0417881 6.44423 1.13025 7.07122 1.32236 7.22898L7.2145 11.5859L15.6689 2.71364Z"
                  fill="#FFCE22"
                />
              </svg>
              {i18n.benf3}
            </div>
            <div className={s.benefitItem}>
              <svg
                width="17"
                height="12"
                viewBox="0 0 17 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.6689 2.71364C15.743 2.64441 16.9419 1.45333 16.2052 0.746045C15.4684 0.0387583 14.6958 0.568188 13.9885 1.30494L6.89945 8.68937L2.73739 5.73335C1.90472 5.14197 1.13796 4.90082 0.633171 5.61156C0.0417881 6.44423 1.13025 7.07122 1.32236 7.22898L7.2145 11.5859L15.6689 2.71364Z"
                  fill="#FFCE22"
                />
              </svg>
              {i18n.benf4}
            </div>
            <div className={s.benefitItem}>
              <svg
                width="17"
                height="12"
                viewBox="0 0 17 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.6689 2.71364C15.743 2.64441 16.9419 1.45333 16.2052 0.746045C15.4684 0.0387583 14.6958 0.568188 13.9885 1.30494L6.89945 8.68937L2.73739 5.73335C1.90472 5.14197 1.13796 4.90082 0.633171 5.61156C0.0417881 6.44423 1.13025 7.07122 1.32236 7.22898L7.2145 11.5859L15.6689 2.71364Z"
                  fill="#FFCE22"
                />
              </svg>
              {i18n.benf5}
            </div>
            <div className={s.benefitItem}>
              <svg
                width="17"
                height="12"
                viewBox="0 0 17 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.6689 2.71364C15.743 2.64441 16.9419 1.45333 16.2052 0.746045C15.4684 0.0387583 14.6958 0.568188 13.9885 1.30494L6.89945 8.68937L2.73739 5.73335C1.90472 5.14197 1.13796 4.90082 0.633171 5.61156C0.0417881 6.44423 1.13025 7.07122 1.32236 7.22898L7.2145 11.5859L15.6689 2.71364Z"
                  fill="#FFCE22"
                />
              </svg>
              {i18n.benf6}
            </div>
          </div>
          {/* ./benefitsList */}
        </div>

        <div className={s.content}>
          {stripePromise && (
            <Elements stripe={stripePromise}>
              <CheckoutForm userToken={userToken} />
            </Elements>
          )}
        </div>
      </Box>
    </Modal>
  );
};

// CheckoutModal.defaultProps = {
//   backdropTimeout: true,
//   local: {}
// };

export default CheckoutModal;
