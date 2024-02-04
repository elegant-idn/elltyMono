import clsx from "clsx";
import React, { useRef } from "react";
import { InputCheckbox } from "../../Inputs";
import s from "./BaseGridElement.module.scss";
import { LinearDownloadProgress } from "../../DownloadModal/LinearDownloadProgress";
import { Checkbox } from "../../Checkbox";
import { useTranslation } from "next-i18next";
import { toHumanReadableTimeElapsed } from "../../../utils/toHumanReadableTimeElapsed";

interface BaseGridElementProps {
  selectable?: boolean;
  alwaysShowSelection?: boolean;
  isSelected?: boolean;
  onChangeCheckbox?: any;
  threeDots?: boolean;
  isActiveDots?: boolean;
  onDotsClick?: (ref: React.MutableRefObject<null | HTMLDivElement>) => unknown;
  preview?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  imageWrapper?: (element: React.ReactNode) => React.ReactNode;
  showUpload?: boolean;
  hasLoaded?: boolean;
  loadingClassName?: string;
  daysBeforeDeleted?: number;
}

export const BaseGridElement: React.FC<
  React.PropsWithChildren<BaseGridElementProps>
> = ({
  selectable,
  isSelected,
  onChangeCheckbox,
  threeDots,
  isActiveDots,
  onDotsClick,
  preview,
  subtitle,
  title,
  hasLoaded,
  showUpload,
  loadingClassName,
  alwaysShowSelection,
  daysBeforeDeleted,
  imageWrapper = (element) => element,
}) => {
  const { t } = useTranslation("common");
  const threeDotsRef = useRef<null | HTMLDivElement>(null);

  const handleThreeDotsClick = () => {
    onDotsClick?.(threeDotsRef);
  };

  return (
    <div className={clsx(s.DesignGridElement, showUpload && loadingClassName)}>
      {threeDots && !showUpload && (
        <button
          className={clsx(s.threeDotsHolder, { [s.activeDots]: isActiveDots })}
          onClick={handleThreeDotsClick}
        >
          <div
            className={clsx(s.dotsBtn, { [s.activeDots]: isActiveDots })}
            ref={threeDotsRef}
          >
            <svg
              viewBox="0 0 15 4"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.6433 2.55182C8.06605 2.55182 8.40877 2.2134 8.40877 1.79593C8.40877 1.37846 8.06605 1.04004 7.6433 1.04004C7.22054 1.04004 6.87783 1.37846 6.87783 1.79593C6.87783 2.2134 7.22054 2.55182 7.6433 2.55182Z"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.0016 2.55182C13.4243 2.55182 13.7671 2.2134 13.7671 1.79593C13.7671 1.37846 13.4243 1.04004 13.0016 1.04004C12.5788 1.04004 12.2361 1.37846 12.2361 1.79593C12.2361 2.2134 12.5788 2.55182 13.0016 2.55182Z"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2.285 2.55182C2.70776 2.55182 3.05047 2.2134 3.05047 1.79593C3.05047 1.37846 2.70776 1.04004 2.285 1.04004C1.86224 1.04004 1.51953 1.37846 1.51953 1.79593C1.51953 2.2134 1.86224 2.55182 2.285 2.55182Z"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </button>
      )}

      {imageWrapper(
        <>
          <div
            className={clsx(
              s.imgWrapper,
              "imgWrapper",
              isSelected && s.selected
            )}
            style={{ backgroundImage: `url("${preview}")` }}
          >
            <div
              className={clsx(
                s.selectWrap,
                !selectable && "hidden",
                alwaysShowSelection && s.showSelection
              )}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Checkbox
                value={isSelected}
                onChange={() => onChangeCheckbox()}
                className={clsx(
                  {
                    [s.uncheckedCheckbox]: !isSelected,
                  },
                  s.checkbox
                )}
              />
            </div>

            <div className={s.check}></div>

            {daysBeforeDeleted !== undefined && (
              <div
                className={clsx(s.daysBeforeDeleted, {
                  [s.expiring]: daysBeforeDeleted < 10,
                })}
              >
                {t("timeElapsed.units.day", { count: daysBeforeDeleted })}
              </div>
            )}
          </div>
          {showUpload && (
            <div className={s.loading}>
              <LinearDownloadProgress
                hasLoaded={!!hasLoaded}
                progressClass={s.progressClass}
              />
            </div>
          )}
        </>
      )}

      <div className={clsx(s.text, "text")}>
        <div className={s.title}>
          <div className={s.titleWrap}>{title}</div>
        </div>

        <div className={s.subtitleWrap}>
          <div className={s.subtitle}>{subtitle}</div>
        </div>
      </div>
    </div>
  );
};
