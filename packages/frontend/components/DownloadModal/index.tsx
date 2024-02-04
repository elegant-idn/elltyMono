import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import useMediaQuery from "@mui/material/useMediaQuery";
import clsx from "clsx";
import { Trans, useTranslation } from "next-i18next";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { ToggleDownloadModalAction } from "../../redux/actions";
import useTypedSelector from "../../utils/useTypedSelector";
import s from "./DownloadModal.module.scss";
import { DownloadModalContent } from "./DownloadModalContent";

interface DownloadModal {
  remainingDownloads?: number;
}

const backdropProps = {
  timeout: 500,
};

export const DownloadModal: React.FC<DownloadModal> = ({
  remainingDownloads,
}) => {
  const isMobile = useMediaQuery("(max-width: 500px)");
  const { t }: any = useTranslation("downloadModal");
  const user = useTypedSelector((state) => state.mainReducer.user);
  const [hasUpgradedPeriod, setHasUpgradedPeriod] = useState(false);

  const createKey = (key: string) => {
    return `${user.plan === "free" ? "toPro" : "toYearly"}.${key}`;
  };

  const dispatch = useDispatch();
  const modalOpen = useTypedSelector(
    (state) => state.designReducer.downloadModalOpen
  );

  const [bannerImageSrc, applyGradient] = useMemo(() => {
    const getName = (name: string) => {
      return isMobile ? `${name}-mob` : name;
    };

    switch (true) {
      case hasUpgradedPeriod:
        return [`/plans/${getName("banner4")}.png`, false];
      case user.plan === "free":
        return [`/plans/${getName("banner5")}.png`, true];
      case user.billingPeriod === "yearly" || !user.billingPeriod:
        return [`/plans/${getName("banner6")}.png`, false];
      case user.plan === "pro" || user.billingPeriod === "monthly":
        return [`/plans/${getName("banner5")}.png`, true];
      default:
        return "" as never;
    }
  }, [user, hasUpgradedPeriod, isMobile]);

  const showOffer = !(
    (user.billingPeriod === "yearly" || !user.billingPeriod) &&
    user.plan === "pro"
  );

  const closeModal = () => {
    dispatch(ToggleDownloadModalAction(false));
  };

  const advIcon = (
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
  );

  const advsLength = Object.keys(
    t(createKey("advs"), {
      returnObjects: true,
    })
  ).length;

  return (
    <Modal
      open={modalOpen}
      onClose={closeModal}
      closeAfterTransition
      BackdropProps={backdropProps}
    >
      <Box className={clsx("modal", s.root)}>
        <button className={s.closeBtn} onClick={closeModal} />

        <div className={clsx(s.banner, { [s.gradient]: applyGradient })}>
          <Image
            src={bannerImageSrc}
            alt="banner"
            layout="fill"
            objectFit="cover"
          />
          {showOffer && (
            <Box className={s.text}>
              <h1 className={s.title}>{t(createKey("title"))}</h1>
              <div className={s.advs}>
                {new Array(advsLength)
                  .fill(true)
                  .map((_: any, index: number) => {
                    const advKey = createKey(`advs.adv${index + 1}`);
                    return (
                      <div className={s.adv} key={index}>
                        {advIcon}
                        <p>
                          <Trans
                            i18nKey={advKey}
                            t={t}
                            components={{
                              bold: <span className={s.semiBold} />,
                            }}
                          />
                        </p>
                      </div>
                    );
                  })}
              </div>
            </Box>
          )}
        </div>

        <div className={s.content}>
          <DownloadModalContent
            remainingDownloads={remainingDownloads}
            onUpgraded={() => setHasUpgradedPeriod(true)}
          />
        </div>
      </Box>
    </Modal>
  );
};
