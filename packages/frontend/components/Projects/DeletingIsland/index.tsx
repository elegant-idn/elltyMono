import React, { ComponentProps, useEffect, useState } from "react";
import { NotificationIsland } from "../../NotificationIsland";
import { ImageStack } from "../../ImageStack";
import { Backdrop } from "@mui/material";
import s from "./DeletingIsland.module.scss";
import { useTranslation } from "next-i18next";
import { LinearDownloadProgress } from "../../DownloadModal/LinearDownloadProgress";

interface DeletingIslandProps {
  deletedItem: ComponentProps<typeof ImageStack>["images"][number] | null;
  isItemDeleted: boolean;
}

export const DeletingIsland: React.FC<DeletingIslandProps> = ({
  deletedItem,
  isItemDeleted,
}) => {
  const { t } = useTranslation("Dashboard");

  // save deletedItem until backdrop fully closed (exited)
  const [savedItem, setSavedItem] = useState(
    deletedItem ? { ...deletedItem } : null
  );

  useEffect(() => {
    if (deletedItem) {
      setSavedItem({ ...deletedItem });
    }
  }, [deletedItem]);

  const title = savedItem?.title ?? "";
  const imageName = title.length > 15 ? title.slice(0, 15) + "..." : title;

  return (
    <Backdrop
      open={!!deletedItem}
      className={s.backdrop}
      onExited={() => {
        if (!deletedItem) {
          setSavedItem(null);
        }
      }}
    >
      <NotificationIsland>
        {savedItem && <ImageStack images={[savedItem]} />}

        <div className={s.content}>
          <div className={s.title}>
            {t("deleteIsland.deleting", { name: imageName })}
          </div>

          <div className={s.loader}>
            <LinearDownloadProgress
              hasLoaded={isItemDeleted}
              progressClass={s.progress}
              key={deletedItem?._id}
            />
          </div>
        </div>
      </NotificationIsland>
    </Backdrop>
  );
};
