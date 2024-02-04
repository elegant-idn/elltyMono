import { useState } from "react";
import { RU_PRICING } from "../data/ru-pricing";
import { useFormatPrice } from "./useFormatPrice";
import { useTranslation } from "next-i18next";

export const usePlansPricing = () => {
  const formatPrice = useFormatPrice();
  const { t }: any = useTranslation("Checkout");
  const i18n = t("form", { returnObjects: true });

  const [duration, setDuration] = useState("annually");
  const [prices, setPrices] = useState<null | {
    monthly: any;
    annual: any;
  }>(null);
  const [countryISO, setCountryISO] = useState<null | string>(null);

  const isRUCountry = countryISO === "RU";
  const getTotalPrice = () => {
    if (isRUCountry) {
      return formatPrice(
        (duration === "monthly"
          ? RU_PRICING.costProMonthly
          : RU_PRICING.costProYearly) * 100,
        "RUB"
      );
    }

    return duration === "monthly"
      ? formatPrice(prices?.monthly?.amount, prices?.monthly?.currency)
      : formatPrice(prices?.annual?.amount, prices?.annual?.currency);
  };

  const getDiscountAmount = () => {
    if (isRUCountry) {
      const monthlyPaymentForAnnualPlan = RU_PRICING.costProYearly / 12;
      const discountAmount =
        RU_PRICING.costProMonthly - monthlyPaymentForAnnualPlan;

      const discountPercentage = discountAmount / RU_PRICING.costProMonthly;

      return (discountPercentage * 100).toFixed();
    }

    return Number(
      (1 - prices?.annual?.amount / 12 / prices?.monthly?.amount) * 100
    ).toFixed();
  };

  const getMonthPrice = () => {
    if (isRUCountry) {
      return formatPrice(RU_PRICING.costProMonthly * 100, "RUB");
    }

    return formatPrice(prices?.monthly.amount, prices?.monthly.currency);
  };

  const getAnnualPrice = () => {
    if (isRUCountry) {
      return formatPrice((RU_PRICING.costProYearly / 12) * 100, "RUB");
    }

    return formatPrice(prices?.annual?.amount / 12, prices?.annual?.currency);
  };

  const getAnnualSubPrice = () => {
    if (isRUCountry) {
      return formatPrice(RU_PRICING.costProYearly * 100, "RUB");
    }

    return `${formatPrice(prices?.annual?.amount, prices?.annual?.currency)}${
      i18n.step1.durationY.price
    }`;
  };

  const getFreePrice = () => {
    if (isRUCountry) {
      return formatPrice(0, "RUB");
    }

    return formatPrice(0, prices?.annual?.currency);
  };

  return {
    setDuration,
    setPrices,
    setCountryISO,
    getAnnualPrice,
    getAnnualSubPrice,
    getDiscountAmount,
    getMonthPrice,
    getTotalPrice,
    duration,
    isRUCountry,
    prices,
    getFreePrice,
  };
};
