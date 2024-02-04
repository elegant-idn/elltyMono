import React from "react";
import { NotificationIsland } from "../../NotificationIsland";
import { ImageStack } from "../../ImageStack";
import { useTranslation } from "next-i18next";
import s from "./DesignsMovedToTrashIsland.module.scss";
import { KEEP_TRASH_DAYS } from "../../../utils/constants";

interface DesignsMovedToTrashIsland {
  onUndo: () => void;
  deletedTemplates: any[];
}

export const DesignsMovedToTrashIsland: React.FC<DesignsMovedToTrashIsland> = ({
  deletedTemplates,
  onUndo,
}) => {
  const { t } = useTranslation("Dashboard");
  const { t: tCommon } = useTranslation("common");

  const getDeletedTemplatesStackImages = () => {
    return deletedTemplates.map((item) => ({
      ...item,
      preview: item.preview[0],
    }));
  };

  return (
    <NotificationIsland maxWidth={478}>
      <div className={s.islandContainer}>
        <ImageStack images={getDeletedTemplatesStackImages()} />
        <div>
          <p className={s.islandTitle}>
            {t("templatesTrashIsland.title", {
              count: deletedTemplates.length,
            })}
          </p>
          <p className={s.islandSubtitle}>
            {t("templatesTrashIsland.description", {
              count: deletedTemplates.length,
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
