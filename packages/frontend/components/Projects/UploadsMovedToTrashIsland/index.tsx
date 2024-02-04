import React from "react";
import { NotificationIsland } from "../../NotificationIsland";
import { ImageStack } from "../../ImageStack";
import { useTranslation } from "next-i18next";
import s from "./UploadsMovedToTrashIsland.module.scss";
import { KEEP_TRASH_DAYS } from "../../../utils/constants";

interface DesignsMovedToTrashIsland {
  onUndo: () => void;
  deletedUploads: any[];
}

export const UploadsMovedToTrashIsland: React.FC<DesignsMovedToTrashIsland> = ({
  deletedUploads,
  onUndo,
}) => {
  const { t } = useTranslation("Dashboard");
  const { t: tCommon } = useTranslation("common");

  return (
    <NotificationIsland maxWidth={478}>
      <div className={s.islandContainer}>
        <ImageStack images={deletedUploads} />
        <div>
          <p className={s.islandTitle}>
            {t("uploadsTrashIsland.title", {
              count: deletedUploads.length,
            })}
          </p>
          <p className={s.islandSubtitle}>
            {t("uploadsTrashIsland.description", {
              count: deletedUploads.length,
              days: KEEP_TRASH_DAYS,
            })}
          </p>
        </div>
        <div className={s.islandUndo}>
          <button onClick={onUndo}>{tCommon("file.undo")}</button>
        </div>
      </div>
    </NotificationIsland>
  );
};
