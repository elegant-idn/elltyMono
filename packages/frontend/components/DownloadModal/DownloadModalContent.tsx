import { Box } from "@mui/system";
import { Trans, useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  SetUser,
  ToggleCheckoutModalAction,
  ToggleDownloadModalAction,
} from "../../redux/actions";
import useTypedSelector from "../../utils/useTypedSelector";
import BtnPrimary from "../BtnPrimary";
import { LinearDownloadProgress } from "./LinearDownloadProgress";
import s from "./DownloadModalContent.module.scss";
import { Api } from "../../api";
import { useCookies } from "react-cookie";
import BtnSecondary from "../BtnSecondary";
import { RU_PRICING } from "../../data/ru-pricing";

interface DownloadModalContentProps {
  remainingDownloads?: number;
  onUpgraded?: () => unknown;
}

interface UpgradeResponseData {
  nextAmount: number;
  nextPaymentDate: string;
}

interface UpgradeData {
  nextAmount: number;
  nextPaymentDate: Date;
}

const SHOW_TEXT_AFTER_DOWNLOAD_TIME_MS = 2_000;
export const DownloadModalContent: React.FC<DownloadModalContentProps> = ({
  remainingDownloads,
  onUpgraded,
}) => {
  const [cookie] = useCookies();
  const { t: tCheckout }: any = useTranslation("Checkout");
  const i18nPrice = tCheckout("price", { returnObjects: true });

  const isDownloading = useTypedSelector(
    (state) => state.designReducer.isDownloading
  );
  const { t }: any = useTranslation("downloadModal");
  const user = useTypedSelector((state) => state.mainReducer.user);
  const createKey = (key: string) => {
    return `${user.plan === "free" ? "toPro" : "toYearly"}.${key}`;
  };
  const dispatch = useDispatch();
  const [canDownload, setCanDownload] = useState(false);
  const [showSubmitUpgrade, setShowSubmitUpgrade] = useState(false);
  const [showDownloading, setShowDownloading] = useState(isDownloading);
  const [upgradeData, setUpgradeData] = useState<UpgradeData | null>(null);
  const [upgradeIsLoading, setUpgradeIsLoading] = useState(false);
  const showOffer = !(
    (user.billingPeriod === "yearly" || !user.billingPeriod) &&
    user.plan === "pro"
  );

  useEffect(() => {
    if (isDownloading) setCanDownload(true);

    const timeout = setTimeout(() => {
      setShowDownloading(isDownloading);
    }, SHOW_TEXT_AFTER_DOWNLOAD_TIME_MS);

    return () => {
      clearTimeout(timeout);
    };
  }, [isDownloading]);

  const changeSubscriptionPeriodToYearly = async () => {
    setUpgradeIsLoading(true);

    try {
      const price = String(RU_PRICING.costProYearly);
      const axiosHeaders = {
        headers: {
          Authorization: cookie.user.accessToken,
        },
      };

      const axiosBody = {
        plan: "yearly",
        price,
      };

      const upgradeResponse = await Api.put<UpgradeResponseData>(
        "/yookassa-pay/change-plan",
        axiosBody,
        axiosHeaders
      );
      const newUser = { ...user };

      newUser.billingPeriod = "yearly";

      dispatch(SetUser(newUser));

      setUpgradeData({
        nextAmount: upgradeResponse.data.nextAmount,
        nextPaymentDate: new Date(upgradeResponse.data.nextPaymentDate),
      });
    } catch {
      // pass
    }

    setUpgradeIsLoading(false);
  };

  const closeModal = () => {
    dispatch(ToggleDownloadModalAction(false));
  };

  const handleClickCTA = () => {
    if (!showOffer) {
      closeModal();
      return;
    }

    if (showOffer && user.plan === "free") {
      closeModal();
      dispatch(ToggleCheckoutModalAction(true));
      return;
    }

    setShowSubmitUpgrade(true);
  };

  const upgradeSubscription = async () => {
    await changeSubscriptionPeriodToYearly();

    onUpgraded?.();
    setShowSubmitUpgrade(false);
  };

  if (showDownloading) {
    return (
      <>
        <Box mb={2}>{t("preparing")}</Box>
        <LinearDownloadProgress hasLoaded={!isDownloading} />
      </>
    );
  }

  const upgradeMonthText =
    upgradeData &&
    tCheckout("monthsOfPayments", { returnObjects: true })[
      upgradeData.nextPaymentDate.getMonth()
    ];

  return (
    <div className={s.root}>
      <div>
        {canDownload && !upgradeData && !showSubmitUpgrade && (
          <p>
            {user.plan === "free" ? t("done") : t("saved")}

            <br />
          </p>
        )}
        <p>
          {user.plan === "free" && (
            <>
              {remainingDownloads !== 0 ? (
                <Trans
                  t={t}
                  i18nKey="remainingDownloads"
                  values={{ count: remainingDownloads }}
                />
              ) : (
                t("noRemainingDownloads")
              )}
            </>
          )}
          {upgradeData && (
            <Trans
              i18nKey="upgraded"
              t={t}
              values={{
                startDate: `${upgradeData.nextPaymentDate.getDate()} ${upgradeMonthText} ${upgradeData.nextPaymentDate.getFullYear()}`,
                price: upgradeData.nextAmount,
              }}
            />
          )}
          {showSubmitUpgrade && <Trans i18nKey="submitUpgrade" t={t} />}
        </p>
      </div>

      {showSubmitUpgrade ? (
        <div className={s.buttons}>
          {!upgradeIsLoading && (
            <BtnSecondary onClick={closeModal}>Отменить</BtnSecondary>
          )}
          <BtnPrimary onClick={upgradeSubscription} loading={upgradeIsLoading}>
            Да, обновить план
          </BtnPrimary>
        </div>
      ) : (
        <BtnPrimary onClick={handleClickCTA} loading={upgradeIsLoading}>
          {showOffer ? t(createKey("CTA")) : t("close")}
        </BtnPrimary>
      )}
    </div>
  );
};
