import clsx from "clsx";
import { Trans, useTranslation } from "next-i18next";
import React, { useState } from "react";
import { DeleteImagesPopper } from "./DeleteImagesPopper";
import s from "./UploadsSection.module.scss";

interface UploadSectionGirdActionsProps {
  selectedCount: number;
  onDeselect: () => unknown;
  onDelete: () => unknown;
  onDownload: () => unknown;
}

export const UploadSectionGridActions: React.FC<
  UploadSectionGirdActionsProps
> = ({ selectedCount, onDelete, onDeselect, onDownload }) => {
  const [anchor, setAnchor] = useState(null);

  const { t }: any = useTranslation("design", {
    keyPrefix: "content.polotno.sidePanel",
  });

  return (
    <>
      <div className={s.actions}>
        <span className={s.selected}>
          <Trans
            t={t}
            i18nKey="selected"
            values={{
              count: selectedCount,
            }}
            components={[<span key="1" />]}
          />
        </span>
        <div className={s.middleContainer}>
          <button
            className={s.download}
            onClick={onDownload}
            title={t("downloadSelected")}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17 11.6667V12.7333C17 14.2268 17 14.9735 16.7094 15.544C16.4537 16.0457 16.0457 16.4537 15.544 16.7094C14.9735 17 14.2268 17 12.7333 17H5.26667C3.77319 17 3.02646 17 2.45603 16.7094C1.95426 16.4537 1.54631 16.0457 1.29065 15.544C1 14.9735 1 14.2268 1 12.7333V11.6667M13.4444 7.22222L9 11.6667M9 11.6667L4.55556 7.22222M9 11.6667V1"
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            className={clsx(s.delete, { [s.active]: anchor })}
            onClick={(e) => {
              setAnchor(null);
              onDelete?.();
            }}
            title={t("deleteSelected")}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.46191 7.03516L3.98983 16.0595C4.02076 16.5882 4.45852 17.0011 4.98812 17.0011H13.0126C13.5422 17.0011 13.98 16.5882 14.0109 16.0595L14.5388 7.03516"
                stroke="white"
                strokeLinecap="round"
              />
              <path
                d="M1 4.73723H17H13.6667L12.3333 1H5.66667L4.33333 4.73723H1Z"
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <div className={s.deselectContainer}>
          <button onClick={onDeselect} title={t("deselect")}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L15 15M1 15L15 1"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
      {anchor && (
        <DeleteImagesPopper
          anchorElement={anchor}
          onDelete={() => {
            setAnchor(null);
            onDelete?.();
          }}
          onClose={() => {
            setAnchor(null);
          }}
          onCancel={onDeselect}
        />
      )}
    </>
  );
};
