import clsx from "clsx";
import { Trans, useTranslation } from "next-i18next";
import React, { useRef } from "react";
import { useElapsingTime } from "../../ElapsingTime";
import { InputCheckbox } from "../../Inputs";
import s from "./UploadGridElement.module.scss";
import { LinearDownloadProgress } from "../../DownloadModal/LinearDownloadProgress";
import { BaseGridElement } from "../BaseGridElement/BaseGridElement";
import { daysDifference } from "../../../utils/daysDifference";
import { addDays } from "../../../utils/addDays";
import { KEEP_TRASH_DAYS } from "../../../utils/constants";

interface UploadGridElementProps {
  item: any;
  activeItem?: any;
  selectable?: boolean;
  isActive?: boolean;
  onChangeCheckbox?: any;
  buttonMore?: boolean;
  threeDots?: boolean;
  threeDotsAction?: any;
  showUpload?: boolean;
  hasLoaded?: boolean;
  alwaysShowSelection?: boolean;
  isSelected?: boolean;
  trash?: boolean;
}

export const UploadGridElement: React.FC<
  React.PropsWithChildren<UploadGridElementProps>
> = ({
  item,
  selectable,
  isActive,
  onChangeCheckbox,
  threeDots,
  threeDotsAction,
  activeItem,
  hasLoaded,
  showUpload,
  alwaysShowSelection,
  isSelected,
  trash,
}) => {
  const isActiveDots = item._id === activeItem?._id;

  const threeDotsRef = useRef<null | HTMLDivElement>(null);

  const { t } = useTranslation("common");
  const isFile = item instanceof File;
  const timeText = useElapsingTime(
    isFile ? new Date() : new Date(item.createdAt)
  );

  const handleThreeDotsClick = () => {
    threeDotsAction?.(threeDotsRef, item);
  };

  const imageSource = isFile ? URL.createObjectURL(item) : item.preview;
  const imageTitle = isFile ? item.name : item.title;

  const renderImage = (element: React.ReactNode) => {
    if (item._id === "load") return element;

    if (alwaysShowSelection) {
      return (
        <span
          onClick={() => {
            onChangeCheckbox();
          }}
        >
          {element}
        </span>
      );
    }

    return element;
  };

  const daysBeforeDeleted = trash
    ? Math.max(
        daysDifference(new Date(), addDays(item.deletedAt, KEEP_TRASH_DAYS)),
        1
      )
    : undefined;

  return (
    <BaseGridElement
      imageWrapper={renderImage}
      title={imageTitle}
      preview={imageSource}
      threeDots={threeDots}
      isActiveDots={isActiveDots}
      onDotsClick={(ref) => threeDotsAction?.(ref, item)}
      showUpload={showUpload}
      hasLoaded={hasLoaded}
      selectable={item._id !== "load" && selectable}
      isSelected={isSelected}
      onChangeCheckbox={onChangeCheckbox}
      alwaysShowSelection={alwaysShowSelection}
      daysBeforeDeleted={daysBeforeDeleted}
      subtitle={
        <Trans
          t={t}
          i18nKey="timeAction.upload"
          values={{
            timeElapsed: timeText,
          }}
        />
      }
    />
  );

  return (
    <div className={s.DesignGridElement}>
      {/* see more button */}
      {threeDots && (
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

      <div
        className={s.imgWrapper}
        style={{ backgroundImage: `url("${imageSource}")` }}
      >
        <div className={clsx(s.selectWrap, !selectable && "hidden")}>
          <InputCheckbox
            onChange={onChangeCheckbox}
            value={isActive}
            checked={!!isActive}
            variant="blue"
          />
        </div>
        <div className={s.check}></div>
        {showUpload && (
          <div className={s.loading}>
            <LinearDownloadProgress
              hasLoaded={!!hasLoaded}
              progressClass={s.progressClass}
            />
          </div>
        )}
      </div>

      <div className={s.text}>
        <div className={s.title}>
          <div className={s.titleWrap}>{imageTitle}</div>
        </div>

        <div className={s.subtitleWrap}>
          <div className={s.subtitle}>
            <Trans
              t={t}
              i18nKey="timeAction.upload"
              values={{
                timeElapsed: timeText,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
