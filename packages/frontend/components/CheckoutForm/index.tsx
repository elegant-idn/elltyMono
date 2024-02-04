import clsx from "clsx";
import Router from "next/router";
import React from "react";
import s from "./CheckoutForm.module.scss";

import { useDispatch, useSelector } from "react-redux";
import {
  ChangeCheckoutStepAction,
  ToggleCheckoutModalAction,
} from "../../redux/actions";
import { RootState } from "../../redux/store";

import { TabsListUnstyled, TabsUnstyled, TabUnstyled } from "@mui/base";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  PaymentRequestButtonElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useTranslation } from "next-i18next";
import { useCookies } from "react-cookie";
import { AnyAction } from "redux";
import { Api } from "../../api";
import { fetchUser } from "../../redux/asyncActions";
import gaEvent from "../../utils/gaEvent";
import { usePlansPricing } from "../../utils/usePlansPricing";
import BtnPrimary from "../BtnPrimary";
import Link from "../Link";
import { RU_PRICING } from "../../data/ru-pricing";

interface CheckoutFormProps {
  userToken: string;
}

const YOOKASSA_SHOP_ID =
  process.env.NODE_ENV !== "production" ? "623123" : "917490";

const CheckoutForm: React.FC<React.PropsWithChildren<CheckoutFormProps>> = ({
  userToken,
}) => {
  const { t }: any = useTranslation("Checkout");
  const i18n = t("form", { returnObjects: true });
  const [cookie, setCookie] = useCookies();

  const setUserProStatus = () => {
    let cookieNew = cookie.user;
    cookieNew.plan = "pro";
    setCookie("user", cookieNew, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    });
  };

  const dispatch = useDispatch();

  const checkoutStep = useSelector(
    (state: RootState) => state.mainReducer.checkoutStep
  );

  const {
    setPrices,
    getAnnualPrice,
    getAnnualSubPrice,
    getDiscountAmount,
    getMonthPrice,
    getTotalPrice,
    setCountryISO,
    setDuration,
    duration,
    isRUCountry,
  } = usePlansPricing();

  const [stripePrices, setStripePrices] = React.useState<null | {
    monthly: any;
    annual: any;
  }>(null);
  const [paypalPrices, setPaypalPrices] = React.useState<null | {
    monthly: any;
    annual: any;
  }>();

  const totalPrice = getTotalPrice();

  const [paymentMethod, setPaymentMethod] = React.useState("cards"); // applePay, payPal, cards
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isLoadingPrices, setIsLoadingPrices] = React.useState(true);

  const discountAmount = getDiscountAmount();

  const modalContent = () => {
    switch (checkoutStep) {
      case "step1":
        return (
          <>
            <div className={s.advs}>
              {i18n.step1.info.first && (
                <div className={s.adv}>
                  <div className={s.point}></div>
                  {i18n.step1.info.first}
                </div>
              )}
              {i18n.step1.info.second && (
                <div className={s.adv}>
                  <div className={s.point}></div>
                  {i18n.step1.info.second}
                </div>
              )}

              {i18n.step1.info.third && (
                <div className={s.adv}>{i18n.step1.info.third}</div>
              )}
            </div>

            <TabsUnstyled value={duration}>
              <TabsListUnstyled>
                <TabUnstyled
                  type="button"
                  onClick={() => {
                    setDuration("annually");
                  }}
                  className={"checkoutTab durationTab"}
                  value="annually"
                >
                  <div>
                    <div className="header">
                      <svg
                        className="check"
                        width="16"
                        height="16"
                        viewBox="0 0 16 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16 8.5C16 12.9183 12.4183 16.5 8 16.5C3.58172 16.5 0 12.9183 0 8.5C0 4.08172 3.58172 0.5 8 0.5C12.4183 0.5 16 4.08172 16 8.5Z"
                          fill="#4071E6"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M7.65072 10.5L10.919 7.09559C11.1676 6.83663 11.1592 6.42515 10.9002 6.17655C10.6412 5.92794 10.2298 5.93634 9.98115 6.1953L7.48938 8.7909L6.02643 7.75187C5.73375 7.544 5.32798 7.61275 5.12011 7.90543C4.91224 8.19811 4.98099 8.60389 5.27367 8.81175L7.65072 10.5Z"
                          fill="white"
                        />
                      </svg>
                      <div className="empty"></div>
                      <span className="title">
                        {i18n.step1.durationY.title}
                      </span>
                      {!isLoadingPrices && (
                        <div className="badge">-{discountAmount}%</div>
                      )}
                    </div>
                    <div className="text">{i18n.step1.durationY.about}</div>
                  </div>
                  <div className="right">
                    <div className="price">
                      {isLoadingPrices ? (
                        <Skeleton height={16} width={44} />
                      ) : (
                        getAnnualPrice()
                      )}
                    </div>
                    <div className="subprice">
                      {isLoadingPrices ? (
                        <Skeleton height={14} width={60} />
                      ) : (
                        getAnnualSubPrice()
                      )}
                    </div>
                  </div>
                </TabUnstyled>
                <TabUnstyled
                  type="button"
                  onClick={() => {
                    setDuration("monthly");
                  }}
                  className={"checkoutTab durationTab"}
                  value="monthly"
                >
                  <div>
                    <div className="header">
                      <svg
                        className="check"
                        width="16"
                        height="16"
                        viewBox="0 0 16 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16 8.5C16 12.9183 12.4183 16.5 8 16.5C3.58172 16.5 0 12.9183 0 8.5C0 4.08172 3.58172 0.5 8 0.5C12.4183 0.5 16 4.08172 16 8.5Z"
                          fill="#4071E6"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M7.65072 10.5L10.919 7.09559C11.1676 6.83663 11.1592 6.42515 10.9002 6.17655C10.6412 5.92794 10.2298 5.93634 9.98115 6.1953L7.48938 8.7909L6.02643 7.75187C5.73375 7.544 5.32798 7.61275 5.12011 7.90543C4.91224 8.19811 4.98099 8.60389 5.27367 8.81175L7.65072 10.5Z"
                          fill="white"
                        />
                      </svg>
                      <div className="empty"></div>
                      <span className="title">
                        {i18n.step1.durationM.title}
                      </span>
                    </div>
                    <div className="text">{i18n.step1.durationM.about}</div>
                  </div>
                  <div className="right">
                    <div className="price">
                      {isLoadingPrices ? (
                        <Skeleton height={16} width={44} />
                      ) : (
                        getMonthPrice()
                      )}
                    </div>
                  </div>
                </TabUnstyled>
              </TabsListUnstyled>
            </TabsUnstyled>
          </>
        );
      case "step2":
        return (
          <>
            <div className={s.subtitle}>{i18n.step2.subTitle}</div>
            <TabsUnstyled value={paymentMethod}>
              <TabsListUnstyled className={s.tabsListMargin}>
                {/* <TabUnstyled
                  type="button"
                  onClick={() => {setPaymentMethod("applePay")}}
                  className={clsx('checkoutTab paymentMethodTab', !paymentRequest && 'hidden')}
                  value="applePay"
                >
                  <div>
                    <div className="header">
                      <div>
                        <svg className="check" width="16" height="16" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16 8.5C16 12.9183 12.4183 16.5 8 16.5C3.58172 16.5 0 12.9183 0 8.5C0 4.08172 3.58172 0.5 8 0.5C12.4183 0.5 16 4.08172 16 8.5Z" fill="#4071E6"/>
                          <path fillRule="evenodd" clipRule="evenodd" d="M7.65072 10.5L10.919 7.09559C11.1676 6.83663 11.1592 6.42515 10.9002 6.17655C10.6412 5.92794 10.2298 5.93634 9.98115 6.1953L7.48938 8.7909L6.02643 7.75187C5.73375 7.544 5.32798 7.61275 5.12011 7.90543C4.91224 8.19811 4.98099 8.60389 5.27367 8.81175L7.65072 10.5Z" fill="white"/>
                        </svg>
                        <div className="empty"></div>
                        <span className="title">Pay with Apple Pay</span>
                      </div>
                      <img src="/plans/apple-pay.png" />
                    </div>
                    <div className="content">
                      Continuing will take you to your Apple Pay account. <br />
                      You&apos;ll be able to pay your plan after you log in.
                    </div>
                  </div>
                  {paymentRequestButtonElement()}
                </TabUnstyled> */}
                {
                  <TabUnstyled
                    type="button"
                    onClick={() => {
                      setPaymentMethod("cards");
                    }}
                    className={clsx(
                      s.creditCardTab,
                      "checkoutTab paymentMethodTab"
                    )}
                    value="cards"
                  >
                    <div>
                      <div className="header">
                        <div>
                          <svg
                            className="check"
                            width="16"
                            height="16"
                            viewBox="0 0 16 17"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M16 8.5C16 12.9183 12.4183 16.5 8 16.5C3.58172 16.5 0 12.9183 0 8.5C0 4.08172 3.58172 0.5 8 0.5C12.4183 0.5 16 4.08172 16 8.5Z"
                              fill="#4071E6"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M7.65072 10.5L10.919 7.09559C11.1676 6.83663 11.1592 6.42515 10.9002 6.17655C10.6412 5.92794 10.2298 5.93634 9.98115 6.1953L7.48938 8.7909L6.02643 7.75187C5.73375 7.544 5.32798 7.61275 5.12011 7.90543C4.91224 8.19811 4.98099 8.60389 5.27367 8.81175L7.65072 10.5Z"
                              fill="white"
                            />
                          </svg>
                          <div className="empty"></div>
                          <span className="title">
                            {i18n.step2.stripeTitle}
                          </span>
                        </div>
                        <img
                          className="creditCardsImg"
                          src="/plans/credit-cards.png"
                        />
                      </div>
                      <div className="content">
                        {!isRUCountry ? (
                          <div className={s.cardContent}>
                            <div className={s.inputGroup}>
                              <span className={s.inputLabel}>
                                {i18n.step2.cardNumber}
                              </span>
                              <div className={s.inputWrapper}>
                                <CardNumberElement
                                  options={{
                                    style: {
                                      base: inputStyle,
                                    },
                                  }}
                                />
                              </div>
                            </div>

                            <div className={s.row}>
                              <div className={s.inputGroup}>
                                <span className={s.inputLabel}>
                                  {i18n.step2.cardExpire}
                                </span>
                                <div className={s.inputWrapper}>
                                  <CardExpiryElement
                                    options={{
                                      style: {
                                        base: inputStyle,
                                      },
                                    }}
                                  />
                                </div>
                              </div>
                              <div className={s.inputGroup}>
                                <span className={s.inputLabel}>
                                  {i18n.step2.CardCVC}
                                </span>
                                <div className={s.inputWrapper}>
                                  <CardCvcElement
                                    options={{
                                      style: {
                                        base: inputStyle,
                                      },
                                    }}
                                  />
                                  <svg
                                    width="29"
                                    height="29"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="var(--colorIconCardCvc)"
                                    role="presentation"
                                  >
                                    <path
                                      opacity=".2"
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M15.337 4A5.493 5.493 0 0013 8.5c0 1.33.472 2.55 1.257 3.5H4a1 1 0 00-1 1v1a1 1 0 001 1h16a1 1 0 001-1v-.6a5.526 5.526 0 002-1.737V18a2 2 0 01-2 2H3a2 2 0 01-2-2V6a2 2 0 012-2h12.337zm6.707.293c.239.202.46.424.662.663a2.01 2.01 0 00-.662-.663z"
                                    ></path>
                                    <path
                                      opacity=".4"
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M13.6 6a5.477 5.477 0 00-.578 3H1V6h12.6z"
                                    ></path>
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M18.5 14a5.5 5.5 0 110-11 5.5 5.5 0 010 11zm-2.184-7.779h-.621l-1.516.77v.786l1.202-.628v3.63h.943V6.22h-.008zm1.807.629c.448 0 .762.251.762.613 0 .393-.37.668-.904.668h-.235v.668h.283c.565 0 .95.282.95.691 0 .393-.377.66-.911.66-.393 0-.786-.126-1.194-.37v.786c.44.189.88.291 1.312.291 1.029 0 1.736-.526 1.736-1.288 0-.535-.33-.967-.88-1.14.472-.157.778-.573.778-1.045 0-.738-.652-1.241-1.595-1.241a3.143 3.143 0 00-1.234.267v.77c.378-.212.763-.33 1.132-.33zm3.394 1.713c.574 0 .974.338.974.778 0 .463-.4.785-.974.785-.346 0-.707-.11-1.076-.337v.809c.385.173.778.26 1.163.26.204 0 .392-.032.573-.08a4.313 4.313 0 00.644-2.262l-.015-.33a1.807 1.807 0 00-.967-.252 3 3 0 00-.448.032V6.944h1.132a4.423 4.423 0 00-.362-.723h-1.587v2.475a3.9 3.9 0 01.943-.133z"
                                    ></path>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          // <YookassaForm ref={yookassaFormRef} />
                          <>{i18n.step2.cardDesc}</>
                        )}
                      </div>
                    </div>
                  </TabUnstyled>
                }

                {paypalPrices?.annual && paypalPrices?.monthly && (
                  <TabUnstyled
                    type="button"
                    onClick={() => {
                      setPaymentMethod("payPal");
                    }}
                    className="checkoutTab paymentMethodTab"
                    value="payPal"
                  >
                    <div>
                      <div className="header">
                        <div>
                          <svg
                            className="check"
                            width="16"
                            height="16"
                            viewBox="0 0 16 17"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M16 8.5C16 12.9183 12.4183 16.5 8 16.5C3.58172 16.5 0 12.9183 0 8.5C0 4.08172 3.58172 0.5 8 0.5C12.4183 0.5 16 4.08172 16 8.5Z"
                              fill="#4071E6"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M7.65072 10.5L10.919 7.09559C11.1676 6.83663 11.1592 6.42515 10.9002 6.17655C10.6412 5.92794 10.2298 5.93634 9.98115 6.1953L7.48938 8.7909L6.02643 7.75187C5.73375 7.544 5.32798 7.61275 5.12011 7.90543C4.91224 8.19811 4.98099 8.60389 5.27367 8.81175L7.65072 10.5Z"
                              fill="white"
                            />
                          </svg>
                          <div className="empty"></div>
                          <span className="title">
                            {i18n.step2.paypalTitle}
                          </span>
                        </div>
                        <img className="paypalImg" src="/plans/paypal.svg" />
                      </div>
                      <div className="content">{i18n.step2.paypalDesc}</div>
                    </div>
                  </TabUnstyled>
                )}
              </TabsListUnstyled>
            </TabsUnstyled>
          </>
        );
      case "thankYou":
        return "nothing";
      default:
        return "nothing";
    }
  };

  const inputStyle = {
    fontSize: "12px",
    color: "#36373C",
    backgroundColor: "white",
    ":-webkit-autofill": {},
    "::placeholder": {
      color: "rgba(54, 55, 60, 0.4)",
    },
  };

  const stripe = useStripe();
  const elements = useElements();
  const [paymentRequest, setPaymentRequest] = React.useState(null);
  //stripe1
  // PaymentRequestButtonElement
  React.useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: "US",
        currency: "usd",
        total: {
          label: "Demo total",
          amount: 1099,
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      // Check the availability of the Payment Request API.
      pr.canMakePayment().then((result) => {
        if (result) {
          // @ts-ignore
          setPaymentRequest(pr);
        }
      });
    }
  }, [stripe]);

  const paymentRequestButtonElement = () => {
    if (paymentRequest) {
      return <PaymentRequestButtonElement options={{ paymentRequest }} />;
    }
  };

  const [plans, setPlans] = React.useState();
  const [checkoutError, setCheckoutError] = React.useState("");
  const [checkoutSuccess, setCheckoutSuccess] = React.useState(false);

  React.useEffect(() => {
    dispatch(fetchUser(userToken) as unknown as AnyAction);

    if (cookie.user) {
      const axiosHeaders = {
        headers: {
          Authorization: cookie.user.accessToken,
        },
      };

      setIsLoadingPrices(true);
      // getting a list of prices from stripe
      Api.get<{ prices: [{ interval: string }]; countryISO?: string }>(
        "/stripe-pay/prices",
        axiosHeaders
      )
        .then((result) => {
          // console.log(result.data);
          const prices = {
            annual: result.data.prices.find(
              (price) => price.interval === "annual"
            ),
            monthly: result.data.prices.find(
              (price) => price.interval === "monthly"
            ),
          };
          setStripePrices(prices);
          setPrices(prices);

          if (result.data.countryISO) {
            setCountryISO(result.data.countryISO);
          }
        })
        .catch((reason) => {
          console.log(reason);
        })
        .finally(() => {
          setIsLoadingPrices(false);
        });

      // getting a list of prices from paypal
      Api.get<{ plans: [{ interval: string }] }>(
        "/paypal-pay/get-plans",
        axiosHeaders
      )
        .then((result) => {
          // console.log(result.data);
          setPaypalPrices({
            annual: result.data.plans.find(
              (price) => price.interval === "annual"
            ),
            monthly: result.data.plans.find(
              (price) => price.interval === "monthly"
            ),
          });
        })
        .catch((reason) => {
          console.log(reason);
        });
    }
  }, [cookie.user, dispatch, userToken]);
  const handleYookassaSubmit = async () => {
    const price = String(
      duration == "monthly"
        ? RU_PRICING.costProMonthly
        : RU_PRICING.costProYearly
    );

    const plan = duration == "monthly" ? "monthly" : "yearly";

    const axiosHeaders = {
      headers: {
        Authorization: cookie.user.accessToken,
      },
    };

    const axiosBody = JSON.stringify({
      price: price,
      plan: plan,
    });
    Api.post("/yookassa-pay/create-subscription", axiosBody, axiosHeaders)
      .then((result) => {
        if (result.data.response === "User already has pro status") {
          setCheckoutError(i18n.alreadyPro);
          return;
        }

        if (result.status === 201) {
          const axiosBody = JSON.stringify({
            paymentId: result?.data?.id,
            amount: result?.data?.amount?.currency,
            value: result?.data?.amount?.value,
          });

          Api.post(
            "/yookassa-pay/refund-payment",
            axiosBody,
            axiosHeaders
          ).then((result) => {
            console.log(result.data);
          });

          setUserProStatus();

          if (plan === "monthly") {
            gaEvent("complete_checkout");
            gaEvent("complete_checkout_monthly");
            gaEvent("complete_checkout_monthly_yookassa");
          } else {
            gaEvent("complete_checkout");
            gaEvent("complete_checkout_annual");
            gaEvent("complete_checkout_annual_yookassa");
          }

          Router.push(result.data.confirmation.confirmation_url);
        }

        // Router.push(result.data.link.href);

        // if(result.data.amount) {
        // 	setUserProStatus()
        // 	setCheckoutSuccess(true)
        // 	if (duration == 'monthly') {
        // 		gaEvent('complete_checkout'),
        // 			gaEvent('complete_checkout_monthly'),
        // 			gaEvent(
        // 				'complete_checkout_monthly_yookassa'
        // 			);
        // 	} else {
        // 		gaEvent('complete_checkout'),
        // 			gaEvent('complete_checkout_annual'),
        // 			gaEvent(
        // 				'complete_checkout_annual_yookassa'
        // 			);
        // 	}
        // }
      })
      .catch((err) => {
        console.log("Err", err);
        setCheckoutError(i18n.smthWrong);
      })
      .finally(() => {
        setIsLoaded(false);
      });

    // const {
    //   number,
    // 	month,
    // 	year,
    // 	cvc
    // } = yookassaFormRef.current.values

    // if(!number || !month || !year || !cvc) {
    // 	setCheckoutError('Заполните, пожалуйста, все поля')
    // 	setIsLoaded(false);
    // 	return
    // }

    // const paymentToken = await checkout
    // .tokenize({
    // 		number,
    // 		cvc,
    // 		month,
    // 		year,
    // 	})
    // 	.then((res: any) => {
    // 		if(res.status === "error") {
    // 			const errorArr: string[] = [];

    // 			Object.keys(res.error.params)
    // 				.forEach(key => errorArr.push(res.error.params[key].message));

    // 			setCheckoutError(errorArr.join(". "))
    // 		}
    // 		if (res.status === "success") {
    // 			const { paymentToken } = res.data.response;
    // 			console.log(paymentToken);
    // 			return paymentToken;
    // 		}
    // 	});

    // if(paymentToken) {
    // 	const price = String(duration == 'monthly' ? planCostPro : planCostProYear - annualDiscount)
    // 	const plan = duration == 'monthly' ? "monthly" : "yearly"

    // 	const axiosBody = JSON.stringify({
    // 		"price": price,
    // 		"plan": plan,
    // 		"paymentToken": paymentToken
    // 	})

    // 	const axiosHeaders = {
    // 		headers: {
    // 			Authorization: cookie.user.accessToken,
    // 		},
    // 	};

    // 	Api.post("/yookassa-pay/create-subscription", axiosBody, axiosHeaders).then((result) => {
    // 		console.log(result);

    // 		if(result.data.response === "User already has pro status") {
    // 			setCheckoutError(i18n.alreadyPro)
    // 		}

    // 		if(result.data.amount) {
    // 			setUserProStatus()
    // 			setCheckoutSuccess(true)
    // 			if (duration == 'monthly') {
    // 				gaEvent('complete_checkout'),
    // 					gaEvent('complete_checkout_monthly'),
    // 					gaEvent(
    // 						'complete_checkout_monthly_yookassa'
    // 					);
    // 			} else {
    // 				gaEvent('complete_checkout'),
    // 					gaEvent('complete_checkout_annual'),
    // 					gaEvent(
    // 						'complete_checkout_annual_yookassa'
    // 					);
    // 			}
    // 		}

    // 	}).catch((err) => {
    // 		console.log(err);
    // 		setCheckoutError(i18n.smthWrong)
    // 	})
    // }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoaded(true);
    setCheckoutError("");

    const axiosHeaders = {
      headers: {
        "Content-Type": "application/json",
        Authorization: cookie.user.accessToken,
      },
    };

    if (paymentMethod == "cards") {
      if (isRUCountry) {
        duration == "monthly"
          ? (gaEvent("initiated_checkout_monthly"),
            gaEvent("initiated_checkout_monthly_yookassa"))
          : (gaEvent("initiated_checkout_annual"),
            gaEvent("initiated_checkout_annual_yookassa"));

        handleYookassaSubmit();
        return;
      }

      let price;

      if (duration === "monthly") {
        gaEvent("initiated_checkout_monthly");
        gaEvent("initiated_checkout_monthly_stripe");
        price = stripePrices?.monthly;
      } else {
        gaEvent("initiated_checkout_annual");
        gaEvent("initiated_checkout_annual_stripe");
        price = stripePrices?.annual;
      }

      const axiosHeaders = {
        headers: {
          "Content-Type": "application/json",
          Authorization: cookie.user.accessToken,
        },
      };

      let subid: string;
      let ele: any = elements?.getElement(CardNumberElement);
      const result = await stripe?.createPaymentMethod({
        card: ele,
        type: "card",
        billing_details: {
          email: cookie.user.email,
        },
      });

      if (!result?.paymentMethod?.id) {
        let message = i18n.cardDecline;

        if (result?.error?.message) {
          message += ` (${result.error.message})`;
        }
        setCheckoutError(message);
        return;
      }

      const axiosData = JSON.stringify({
        priceId: price.id,
        payment_method: result?.paymentMethod?.id,
      });

      Api.post("/stripe-pay/create-subscription", axiosData, axiosHeaders)
        .then((result) => {
          subid = result.data.subscriptionId;
          if (result.data.status == 400) {
            setCheckoutError(result.data.message);
            setIsLoaded(false);
            return;
          }
          stripe!
            .confirmCardPayment(result.data.clientSecret, {
              payment_method: {
                // @ts-ignore CardNumberElement is combined with all other fields (CardExpiryElement, CardCvcElement)
                card: ele,
                billing_details: {
                  email: cookie.user.email,
                  name: cookie.user.first_name,
                },
              },
            })
            .then(function (result) {
              if (result.error) {
                // console.log(result);
                setIsLoaded(false);
                // @ts-ignore
                setCheckoutError(result.error.message);
              }
              // the payment was confirmed
              if (result!.paymentIntent!.status == "succeeded") {
                // console.log(result);
                // setIsLoaded(false)
                // setCheckoutSuccess(true)
                if (duration == "monthly") {
                  gaEvent("complete_checkout"),
                    gaEvent("complete_checkout_monthly"),
                    gaEvent("complete_checkout_monthly_stripe");
                } else {
                  gaEvent("complete_checkout"),
                    gaEvent("complete_checkout_annual"),
                    gaEvent("complete_checkout_annual_stripe");
                }

                if (result!.paymentIntent!.amount === 50) {
                  Api.post(
                    "/stripe-pay/refund-amount",
                    JSON.stringify({
                      paymentIntent: result!.paymentIntent!.id,
                      amount: result!.paymentIntent!.amount,
                    }),
                    axiosHeaders
                  ).then((result) => console.log(result));
                }

                Api.put(
                  "/stripe-pay/success-stripe",
                  JSON.stringify({
                    subId: subid,
                  }),
                  axiosHeaders
                )
                  .then((result) => {
                    setUserProStatus();
                    setCheckoutSuccess(true);
                  })
                  .catch((err) => {
                    console.log(err);
                  })
                  .finally(() => {
                    setIsLoaded(false);
                  });

                // setIsLoaded(false)
              }
            })
            .catch((err) => {
              console.log(err);
              // console.log(err?.error?.message);
              // setCheckoutError(err.error.message);
              setCheckoutError(i18n.smthWrong);
              setIsLoaded(false);
            })
            .finally(() => {
              // setIsLoaded(false)
            });

          if (result.status === 201) {
            Api.put(
              "/stripe-pay/success-stripe",
              JSON.stringify({
                subId: subid,
              }),
              axiosHeaders
            )
              .then((result) => {
                setUserProStatus();
                setCheckoutSuccess(true);
              })
              .catch((err) => {
                console.log(err);
              })
              .finally(() => {
                setIsLoaded(false);
              });
          }
        })
        .catch((err) => {
          console.log("/stripe-pay/create-subscription error");
          console.log("err", err);
          setCheckoutError(i18n.smthWrong);
          setIsLoaded(false);
        });

      // payPal
    } else if (paymentMethod == "payPal") {
      let price;

      if (duration === "monthly") {
        gaEvent("initiated_checkout_monthly");
        gaEvent("initiated_checkout_monthly_paypal");
        price = paypalPrices?.monthly;
      } else {
        gaEvent("initiated_checkout_annual");
        gaEvent("initiated_checkout_annual_paypal");
        price = paypalPrices?.annual;
      }

      const axiosData = JSON.stringify({
        plan_id: price.id,
        url: window.location.pathname,
      });

      // console.log(window.location.pathname);

      Api.post("paypal-pay/create-sub", axiosData, axiosHeaders)
        .then((result) => {
          console.log(result);
          // console.log(result.data.link);
          // window.location.href = result.data.link
          if (result.data.status == 400) {
            setCheckoutError(result.data.message);
          } else {
            Router.push(result.data.link.href);
          }
        })
        .catch((err) => {
          setCheckoutError(i18n.smthWrong);
          console.log(err);
          console.log(err.response);
          if (err.response) {
            setCheckoutError(err.response.data.message);
          }
        })
        .finally(() => {
          setIsLoaded(false);
        });
    } else {
      // payment method not selected
      setIsLoaded(false);
    }
  };

  return !checkoutSuccess ? (
    <form className={s.form} onSubmit={handleSubmit}>
      <div>
        <div className={s.header}>
          <svg
            className={clsx(checkoutStep == "step2" ? null : "hidden")}
            onClick={() => {
              dispatch(ChangeCheckoutStepAction("step1"));
            }}
            viewBox="0 0 6 10"
          >
            <path
              d="M1.45222 0.644603L5.40234 4.59473L1.39462 8.60245"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h3>{i18n.title}</h3>
        </div>
        {modalContent()}
      </div>

      <div>
        {/* <div className={s.promocode}>
          <div onClick={() => {setPromocodeVisible(true)}}>
            <Link href="">{i18n.promo}</Link>
          </div>
          <div className={clsx(s.promocodeInputGroup, !promocodeVisible && 'hidden')}>
            <input type="text" />
            <button type="button">
              <svg width="11" height="8" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 1L4.6 7L1 4.27273" stroke="#1F2128" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div> */}

        <div className={s.price}>
          {/* <div className={s.subtotal}>
            <div>{i18n.subtotal}</div>
            <div>{i18nPrice.currencyAbbr} {subtotalPrice}</div>
          </div>
          <div className={s.discount}>
            <div>{i18n.discount}</div>
            <div>{i18nPrice.currencyAbbr} {annualDiscountText}</div>
          </div> */}

          <div className={s.divider}></div>
          <div className={s.total} style={{ marginTop: "12px" }}>
            <div>{i18n.total}</div>
            <div>
              {isLoadingPrices ? (
                <Skeleton height={18} width={44} />
              ) : (
                totalPrice
              )}
            </div>
          </div>
        </div>
        <div className={s.btn}>
          {checkoutStep == "step1" ? (
            <div
              onClick={() => {
                duration == "monthly"
                  ? gaEvent("choose_monthly_plan")
                  : gaEvent("choose_annual_plan");
                dispatch(ChangeCheckoutStepAction("step2"));
              }}
            >
              <BtnPrimary type="submit" loading={isLoadingPrices}>
                {i18n.step1.btn}
              </BtnPrimary>
            </div>
          ) : (
            <BtnPrimary
              type="submit"
              loading={isLoaded || !stripePrices || !paypalPrices}
            >
              {i18n.step2.btn}
            </BtnPrimary>
          )}
        </div>
        <div className={s.policy}>
          {i18n.policy.text}{" "}
          <Link
            href="/policy/terms-of-use"
            onClick={() => {
              dispatch(ToggleCheckoutModalAction(false));
            }}
          >
            {i18n.policy.link1}
          </Link>{" "}
          {i18n.policy.separator}{" "}
          <Link
            href="/policy/privacy-policy"
            onClick={() => {
              dispatch(ToggleCheckoutModalAction(false));
            }}
          >
            {i18n.policy.link2}
          </Link>
          .
        </div>

        {checkoutError && (
          <span style={{ color: "red", fontSize: "12px" }}>
            {checkoutError}
          </span>
        )}
      </div>
    </form>
  ) : (
    <div className={s.successPage}>
      <Box
        sx={{
          marginBottom: "20px",
          img: {
            display: "block",
            width: "100px",
            height: "100px",
            margin: "0 auto",
          },
        }}
      >
        <img className={s.checkSvg} src="/auth/password-reset.svg" />
      </Box>
      <h3>{i18n.thx.title}</h3>
      <p>{i18n.thx.text}</p>
      <div
        className={s.btn}
        onClick={() => {
          dispatch(ToggleCheckoutModalAction(false));
        }}
      >
        <BtnPrimary onClickRedirect="/design">{i18n.thx.btn}</BtnPrimary>
      </div>
    </div>
  );
};

export default CheckoutForm;
