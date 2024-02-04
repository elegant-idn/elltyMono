import clsx from "clsx";
import { nanoid } from "nanoid";
import type { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Router from "next/router";
import s from "./PlansPage.module.scss";

import { useDispatch, useSelector } from "react-redux";
import { SetCheckoutPlanDurationAction } from "../../redux/actions";
import { RootState } from "../../redux/store";

import {
  TabPanelUnstyled,
  TabsListUnstyled,
  TabsUnstyled,
  TabUnstyled,
} from "@mui/base";
import { useEffect, useState } from "react";
import { Api } from "../../api";
import Accordion from "../../components/Accordion";
import ContainerFluid from "../../components/ContainerFluid";
import MainLayout from "../../components/Layouts/MainLayout";
import PageLayout from "../../components/Layouts/PageLayout";
import CardFree from "../../components/PlanCards/CardFree";
import CardPro from "../../components/PlanCards/CardPro";
import { StripeCTA } from "../../components/StripeSections";
import { useFormatPrice } from "../../utils/useFormatPrice";
import { usePlansPricing } from "../../utils/usePlansPricing";

interface TemplatesProps {
  userToken: string;
  cookieUser: any;
}

const Plans: NextPage<TemplatesProps> = ({ userToken, cookieUser }) => {
  const { t }: any = useTranslation("index");
  const accordionLocal = t("accordionData", { returnObjects: true });
  const i18n = t("plansPage", { returnObjects: true });

  const { t: tCheckout }: any = useTranslation("Checkout");
  const i18nPrice = tCheckout("price", { returnObjects: true });

  const dispatch = useDispatch();
  const planDuration = useSelector(
    (state: RootState) => state.mainReducer.checkoutPlanDuration
  );

  const {
    setPrices,
    getFreePrice,
    setCountryISO,
    getMonthPrice,
    getAnnualPrice,
  } = usePlansPricing();
  const [isLoadingPrices, setIsLoadingPrices] = useState(true);

  useEffect(() => {
    setIsLoadingPrices(true);
    // getting a list of prices from stripe
    Api.get<{ prices: [{ interval: string }]; countryISO?: string }>(
      "/stripe-pay/prices"
    )
      .then((result) => {
        // console.log(result.data);

        setPrices({
          annual: result.data.prices.find(
            (price) => price.interval === "annual"
          ),
          monthly: result.data.prices.find(
            (price) => price.interval === "monthly"
          ),
        });

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
  }, [setCountryISO, setPrices]);

  const freePrice = getFreePrice();

  const proPriceMonthly = getMonthPrice();

  const proPriceAnnually = getAnnualPrice();

  //@ts-ignore
  const accordions = accordionLocal.map((item) => {
    return (
      <Accordion key={nanoid(5)} title={item.title} content={item.content} />
    );
  });

  return (
    <PageLayout userToken={userToken}>
      <Head>
        <title>{i18n.headTitle}</title>
        <meta name="description" content={i18n.meta.description} />
      </Head>
      <MainLayout
        userToken={userToken}
        cookieUser={cookieUser}
        authorized={cookieUser.accessToken ? true : false}
      >
        <div className={s.wrapper}>
          <ContainerFluid>
            <h1 className={s.title}>{i18n.title}</h1>
            <h2 className={s.text}>{i18n.subtitle}</h2>

            <TabsUnstyled className={s.tabs} value={planDuration}>
              <TabsListUnstyled className={s.tabsList}>
                <TabUnstyled
                  onClick={() => {
                    dispatch(SetCheckoutPlanDurationAction("annually"));
                  }}
                  className={clsx("tab", s.badgeTab)}
                  value="annually"
                >
                  <div
                    // this is so that clicking on the badge does not activate the tab
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className={s.badge}
                  >
                    {i18n.save}
                    <svg
                      viewBox="0 0 22 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M21.3147 16.1976C21.4519 16.1048 21.4878 15.9182 21.3949 15.781L19.8812 13.5453C19.7883 13.4081 19.6018 13.3721 19.4646 13.465C19.3274 13.5579 19.2915 13.7444 19.3844 13.8816L20.7299 15.869L18.7425 17.2145C18.6053 17.3074 18.5694 17.4939 18.6623 17.6311C18.7552 17.7683 18.9417 17.8042 19.0789 17.7113L21.3147 16.1976ZM1.08238 0.820637C1.05654 0.656978 0.902929 0.545248 0.739269 0.571081C0.575611 0.596914 0.463881 0.750528 0.489714 0.914187L1.08238 0.820637ZM21.2032 15.6546C12.7997 14.0363 7.93665 11.3384 5.09461 8.55439C2.25712 5.77487 1.40808 2.88405 1.08238 0.820637L0.489714 0.914187C0.828905 3.06302 1.71885 6.0875 4.67474 8.98301C7.62609 11.8741 12.6108 14.6109 21.0898 16.2438L21.2032 15.6546Z"
                        fill="#36373C"
                      />
                    </svg>
                  </div>
                  <span>{i18n.yearly}</span>
                </TabUnstyled>
                <TabUnstyled
                  onClick={() => {
                    dispatch(SetCheckoutPlanDurationAction("monthly"));
                  }}
                  className="tab"
                  value="monthly"
                >
                  {i18n.mounthly}
                </TabUnstyled>
              </TabsListUnstyled>
              <TabPanelUnstyled className={s.tabPanel} value="annually">
                <CardFree
                  price={freePrice}
                  local={i18n.cards}
                  isLoading={isLoadingPrices}
                />
                <CardPro
                  isLoading={isLoadingPrices}
                  currency={i18nPrice.currency}
                  price={proPriceAnnually}
                  value="annually"
                  local={i18n.cards}
                  text={i18n.cards.planY}
                />
              </TabPanelUnstyled>
              <TabPanelUnstyled className={s.tabPanel} value="monthly">
                <CardFree
                  price={freePrice}
                  local={i18n.cards}
                  isLoading={isLoadingPrices}
                />
                <CardPro
                  isLoading={isLoadingPrices}
                  currency={i18nPrice.currency}
                  price={proPriceMonthly}
                  value="monthly"
                  local={i18n.cards}
                  text={i18n.cards.planM}
                />
              </TabPanelUnstyled>
            </TabsUnstyled>

            <h3 className={s.subtitle}>FAQs</h3>
            <div className={s.accordionsWrapper}>{accordions}</div>
          </ContainerFluid>
        </div>

        <StripeCTA
          onClickBtn={() => {
            Router.push("/templates");
          }}
          hasOval={true}
          local={t}
        />
        <svg display="none">
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

        {/* <CheckoutModal /> */}
      </MainLayout>
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
      ])),
      cookieUser: !!req.cookies.user && (JSON.parse(req.cookies.user) || ""),
      userToken: !!req.cookies.user_token && (req.cookies.user_token || null),
    },
  };
}

export default Plans;
