import { LinearProgress } from "@mui/material";
import clsx from "clsx";
import { useTranslation } from "next-i18next";
import React from "react";
import { useDispatch } from "react-redux";
import { ToggleCheckoutModalAction } from "../../../../redux/actions";
import useTypedSelector from "../../../../utils/useTypedSelector";
import s from "./UploadsSection.module.scss";

interface UploadSectionStorageProps {
  progress: number | null;
}

export const UploadSectionStorage: React.FC<UploadSectionStorageProps> = ({
  progress,
}) => {
  const { t }: any = useTranslation("design", {
    keyPrefix: "content.polotno.sidePanel",
  });
  const user = useTypedSelector((state) => state.mainReducer.user);
  const dispatch = useDispatch();

  const openCheckout = () => dispatch(ToggleCheckoutModalAction(true));

  const openCheckoutOnClick = user.uuid && user.plan === "free";

  return (
    <div
      className={clsx(s.storage, { [s.clickable]: openCheckoutOnClick })}
      onClick={openCheckoutOnClick ? openCheckout : undefined}
    >
      <div className={s.storageInfo}>
        <div>
          {progress === null && <div className={s.skeleton}></div>}
          <p>{t("storage", { percentage: progress })}</p>
        </div>
        {user.plan === "free" && (
          <span>
            <svg
              width="17"
              height="17"
              viewBox="7 7 25 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.40499 18.445C9.24069 18.0616 9.59037 17.6574 9.9934 17.7649L16.0952 19.3921C16.3294 19.4545 16.5747 19.34 16.6772 19.1204L19.5469 12.9709C19.7265 12.5862 20.2735 12.5862 20.4531 12.9709L23.3228 19.1204C23.4253 19.34 23.6706 19.4545 23.9048 19.3921L30.0066 17.7649C30.4096 17.6574 30.7593 18.0616 30.595 18.445L26.6299 27.697C26.5511 27.8808 26.3703 28 26.1703 28H13.8297C13.6297 28 13.4489 27.8808 13.3701 27.697L9.40499 18.445Z"
                fill="#FFBE0B"
              />
            </svg>
          </span>
        )}
      </div>

      <LinearProgress
        classes={{
          root: s.progressRoot,
          bar: clsx(s.progressBar, { [s.full]: progress && progress >= 80 }),
        }}
        variant={progress === null ? "indeterminate" : "determinate"}
        value={progress ?? undefined}
      />
    </div>
  );
};
