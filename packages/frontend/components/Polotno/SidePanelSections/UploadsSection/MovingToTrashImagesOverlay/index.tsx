import { Backdrop } from "@mui/material";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { UploadedImage } from "..";
import { LinearDownloadProgress } from "../../../../DownloadModal/LinearDownloadProgress";
import s from "./DeletingImagesOverlay.module.scss";
import { NotificationIsland } from "../../../../NotificationIsland";
import { ImageStack } from "../../../../ImageStack";

interface DeletingImagesOverlayProps {
  images: UploadedImage[];
  isDeleted: boolean;
}

export const MovingToTrashImagesOverlay: React.FC<
  DeletingImagesOverlayProps
> = ({ images, isDeleted }) => {
  const [deletingImages, setDeletingImages] = useState<UploadedImage[]>([]);
  const { t }: any = useTranslation("design", {
    keyPrefix: "content.polotno.sidePanel.trashOverlay",
  });

  useEffect(() => {
    // there is an unmount animation, so need to persist images to show
    if (images.length === 0) return;

    setDeletingImages([...images]);
  }, [images]);

  // const imageName =
  //   deletingImages.length === 1 ? deletingImages[0].title.slice(0, 15) : null;

  return (
    <Backdrop open={images.length > 0} className={s.root} unmountOnExit>
      <NotificationIsland position="relative">
        <div className={s.images}>
          <ImageStack images={images} />
        </div>
        <div className={s.info}>
          {deletingImages.length === 1 ? (
            <p>
              {t("movingToTrash")
                .replace(/{{.+?}}/, "")
                .trim()}
            </p>
          ) : (
            <p>
              {t("movingToTrash", {
                name: t("items", { count: deletingImages.length }),
              })}
            </p>
          )}
          <div className={s.loader}>
            <LinearDownloadProgress
              hasLoaded={isDeleted}
              progressClass={s.progress}
            />
          </div>
        </div>
      </NotificationIsland>
    </Backdrop>
  );
};
