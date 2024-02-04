import { useMediaQuery } from "@mui/material";
import clsx from "clsx";
import { observer } from "mobx-react-lite";
import Image from "next/image";
import { unstable_registerNextDomDrop } from "polotno/config";
import React from "react";
import { useCookies } from "react-cookie";
import { UploadedImage } from "..";
import { Api } from "../../../../../api";
import { Checkbox } from "../../../../Checkbox";
import { LinearDownloadProgress } from "../../../../DownloadModal/LinearDownloadProgress";
import { addRandomTokenToUrl } from "../../../GridImg";
import { DeleteImagesPopper } from "../DeleteImagesPopper";
import s from "./ImageItem.module.scss";
import { ImageItemPopper } from "./ImageItemPopper";

interface ImageItemProps {
  isSelected?: boolean;
  showActions?: boolean;
  alwaysHideActions?: boolean;
  onSelect?: () => unknown;
  onDelete?: (response: any) => unknown;
  onUpdate?: (imageId: string, image: UploadedImage) => unknown;
  onDeleteStart?: () => unknown;
  image: UploadedImage | File;
  store: any | null;
  showUpload?: boolean;
  hasLoaded?: boolean;
}

export const ImageItem: React.FC<ImageItemProps> = observer(
  ({
    isSelected,
    onSelect,
    showActions,
    image,
    alwaysHideActions,
    store,
    showUpload,
    hasLoaded,
    onDelete,
    onDeleteStart,
    onUpdate,
  }) => {
    const [cookie] = useCookies();
    const isMobile = useMediaQuery("(max-width: 500px)");
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [deleteAnchor, setDeleteAnchor] = React.useState<null | HTMLElement>(
      null
    );
    const skeletonRef = React.useRef<HTMLDivElement>(null);

    const setAnchorElement = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const isFile = image instanceof File;
    const isSvg = !isFile && image.src.toLowerCase().endsWith(".svg");
    const imageSource = isFile ? URL.createObjectURL(image) : image.preview;

    const customGetImageSize = async () => {
      if (isFile) return undefined;

      const { height, width } = image;

      const scaleHeightBy = store.height / height;
      const scaleWidthBy = store.width / width;

      let elementHeight = height * 0.7;
      let elementWidth = width * 0.7;

      if (scaleHeightBy < 1 || scaleWidthBy < 1) {
        const scale = Math.min(scaleHeightBy, scaleWidthBy);

        elementHeight *= scale;
        elementWidth *= scale;
      }

      return { elementHeight, elementWidth };
    };

    const loadImage = async () => {
      if (isFile) return;

      const size = await customGetImageSize();
      if (!size) return;

      store.activePage.addElement({
        type: isSvg ? "svg" : "image",
        src: addRandomTokenToUrl(image.src),
        x: store.width / 2 - size.elementWidth / 2,
        y: store.height / 2 - size.elementHeight / 2,
        height: size.elementHeight,
        width: size.elementWidth,
      });

      if (isMobile) {
        store.openSidePanel("");
      }
    };

    const registerNextImage = async () => {
      if (isFile) return;

      const size = await customGetImageSize();
      if (!size) return;

      unstable_registerNextDomDrop((pos, element) => {
        if (!isSvg && element) {
          element.set({
            maskSrc: image.src,
          });
          return;
        }
        store.activePage.addElement({
          type: isSvg ? "svg" : "image",
          src: image.src,
          x: pos.x - size.elementWidth / 2,
          y: pos.y - size.elementHeight / 2,
          width: size.elementWidth,
          height: size.elementHeight,
        });
      });
    };

    const handleMoveToTrash = async () => {
      if (isFile) return;

      setDeleteAnchor(null);

      onDeleteStart?.();

      const response = await Api.patch(
        "uploads/trash",
        {
          ids: [image._id],
        },
        {
          headers: {
            Authorization: cookie.user.accessToken,
          },
        }
      );

      onDelete?.(response);
    };

    return (
      <div className={s.gridItem}>
        {showActions && <div onClick={onSelect} className={s.clickOverlay} />}
        {!isFile && !alwaysHideActions && (
          <>
            <Checkbox
              value={isSelected}
              className={clsx(s.selectAction, { [s.visible]: showActions })}
              onChange={onSelect}
              variant="dark"
            />
            <button
              onClick={setAnchorElement}
              className={clsx(s.dropdownAction, { [s.visible]: anchorEl })}
            >
              <svg
                width="15"
                height="4"
                viewBox="0 0 15 4"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.65627 2.64324C8.11579 2.64324 8.4883 2.27539 8.4883 1.82162C8.4883 1.36785 8.11579 1 7.65627 1C7.19675 1 6.82423 1.36785 6.82423 1.82162C6.82423 2.27539 7.19675 2.64324 7.65627 2.64324Z"
                  fill="white"
                />
                <path
                  d="M13.4805 2.64324C13.94 2.64324 14.3125 2.27539 14.3125 1.82162C14.3125 1.36785 13.94 1 13.4805 1C13.021 1 12.6485 1.36785 12.6485 1.82162C12.6485 2.27539 13.021 2.64324 13.4805 2.64324Z"
                  fill="white"
                />
                <path
                  d="M1.83203 2.64324C2.29155 2.64324 2.66407 2.27539 2.66407 1.82162C2.66407 1.36785 2.29155 1 1.83203 1C1.37251 1 1 1.36785 1 1.82162C1 2.27539 1.37251 2.64324 1.83203 2.64324Z"
                  fill="white"
                />
                <path
                  d="M7.65627 2.64324C8.11579 2.64324 8.4883 2.27539 8.4883 1.82162C8.4883 1.36785 8.11579 1 7.65627 1C7.19675 1 6.82423 1.36785 6.82423 1.82162C6.82423 2.27539 7.19675 2.64324 7.65627 2.64324Z"
                  stroke="white"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.4805 2.64324C13.94 2.64324 14.3125 2.27539 14.3125 1.82162C14.3125 1.36785 13.94 1 13.4805 1C13.021 1 12.6485 1.36785 12.6485 1.82162C12.6485 2.27539 13.021 2.64324 13.4805 2.64324Z"
                  stroke="white"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M1.83203 2.64324C2.29155 2.64324 2.66407 2.27539 2.66407 1.82162C2.66407 1.36785 2.29155 1 1.83203 1C1.37251 1 1 1.36785 1 1.82162C1 2.27539 1.37251 2.64324 1.83203 2.64324Z"
                  stroke="white"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </>
        )}
        {showUpload && (
          <div className={s.loading}>
            <LinearDownloadProgress
              hasLoaded={!!hasLoaded}
              progressClass={s.progressClass}
            />
          </div>
        )}
        <div
          onClick={showActions ? undefined : loadImage}
          className={clsx(s.imageWrapper, {
            [s.selected]: isSelected,
          })}
        >
          {isFile || isSvg ? (
            <img src={imageSource} alt="" />
          ) : (
            <>
              <div className="itemSkeleton" ref={skeletonRef}></div>
              <Image
                src={imageSource}
                alt={image.title}
                width={image.width}
                height={image.height}
                loader={(props) => props.src}
                onLoadingComplete={() => skeletonRef.current?.remove()}
                draggable
                onDragStart={registerNextImage}
                onDragEnd={() => {
                  unstable_registerNextDomDrop(null);
                }}
              />
            </>
          )}
        </div>

        {!isFile && onSelect && anchorEl && onUpdate && (
          <div onClick={(e) => e.stopPropagation()}>
            <ImageItemPopper
              anchor={anchorEl}
              image={image}
              onSelect={onSelect}
              onDelete={handleMoveToTrash}
              onClose={() => setAnchorEl(null)}
              onUpdate={onUpdate}
            />
          </div>
        )}

        {deleteAnchor && onDelete && (
          <DeleteImagesPopper
            anchorElement={deleteAnchor}
            onClose={() => setDeleteAnchor(null)}
            onDelete={handleMoveToTrash}
          />
        )}
      </div>
    );
  }
);
