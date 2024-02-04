import { Drawer, Popper, useMediaQuery } from "@mui/material";
import { useTranslation } from "next-i18next";
import React, { useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { UploadedImage } from "..";
import { Api } from "../../../../../api";
import { useClickOutside } from "../../../../../utils/useClickOutside";
import { UploadElementBaseDropdownContent } from "../../../../Dashboard/UploadElements/UploadElementBaseDropdownContent";
import s from "./ImageItem.module.scss";
import Dropdown from "../../../../Dropdown";

interface ImageItemPopperProps {
  anchor: any;
  image: UploadedImage;
  onSelect: () => unknown;
  onDelete: () => unknown;
  onClose: () => unknown;
  onUpdate: (imageId: string, image: UploadedImage) => unknown;
}

export const ImageItemPopper: React.FC<ImageItemPopperProps> = ({
  anchor,
  image,
  onSelect,
  onClose,
  onDelete,
  onUpdate,
}) => {
  const ref = useRef(null);
  const { t }: any = useTranslation("design", {
    keyPrefix: "content.polotno.sidePanel.imageModal",
  });

  useClickOutside(ref, onClose, anchor);

  async function toDataURL(url: string) {
    const blob = await fetch(url).then((res) => res.blob());
    return URL.createObjectURL(blob);
  }

  async function downloadImage() {
    const a = document.createElement("a");
    a.href = await toDataURL(image.src);
    a.download = image.title;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    onClose();
  }

  const selectImage = () => {
    onSelect();
    onClose();
  };

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <Dropdown anchor={anchor} popperRef={ref} onClose={onClose}>
      <UploadElementBaseDropdownContent
        upload={image}
        onUploadUpdate={(id, properties) =>
          onUpdate(id, { ...image, ...properties })
        }
      >
        <div className={s.actions}>
          <button onClick={downloadImage} className={s.xPadding}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17 11.6667V12.7333C17 14.2268 17 14.9735 16.7094 15.544C16.4537 16.0457 16.0457 16.4537 15.544 16.7094C14.9735 17 14.2268 17 12.7333 17H5.26667C3.77319 17 3.02646 17 2.45603 16.7094C1.95426 16.4537 1.54631 16.0457 1.29065 15.544C1 14.9735 1 14.2268 1 12.7333V11.6667M13.4444 7.22222L9 11.6667M9 11.6667L4.55556 7.22222M9 11.6667V1"
                stroke="#1F2128"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {t("download")}
          </button>
          <button onClick={selectImage} className={s.xPadding}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="0.5"
                y="0.5"
                width="15"
                height="15"
                rx="2.5"
                stroke="#1F2128"
              />
              <path
                d="M12.7999 5.33301L10.118 8.01491L7.43613 10.6968L4.2666 7.7711"
                stroke="#1F2128"
                strokeLinecap="round"
              />
            </svg>
            {t("select")}
          </button>
          <button onClick={handleDelete} className={s.xPadding}>
            <svg
              width="18"
              height="19"
              viewBox="0 0 18 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.71011 0.986328H8.73305H10.2204H10.2433H10.2433C10.7444 0.986323 11.1535 0.986319 11.4859 1.00908C11.8281 1.03252 12.1402 1.08244 12.4352 1.20844C12.8956 1.40509 13.2915 1.72802 13.5478 2.14969C13.7196 2.43235 13.7864 2.73285 13.8166 3.04328C13.8331 3.21287 13.8401 3.40362 13.8429 3.61438H15.591H15.6023H17.3417C17.7007 3.61438 17.9917 3.90539 17.9917 4.26438C17.9917 4.62336 17.7007 4.91438 17.3417 4.91438H16.2057L15.6342 13.5369L15.6325 13.5635C15.5881 14.2333 15.5523 14.7739 15.4884 15.2112C15.4226 15.662 15.3208 16.0552 15.1163 16.4163C14.79 16.9924 14.2975 17.4562 13.7031 17.746C13.3302 17.9278 12.9321 18.0041 12.4797 18.0402C12.0413 18.0752 11.5023 18.0752 10.8354 18.0752H10.8353H10.8084H8.1755H8.14857H8.14851C7.48159 18.0752 6.94258 18.0752 6.50416 18.0402C6.05182 18.0041 5.65372 17.9278 5.28078 17.746C4.68639 17.4562 4.19387 16.9924 3.8676 16.4163C3.66313 16.0552 3.56125 15.662 3.49546 15.2112C3.43163 14.7739 3.39581 14.2333 3.35142 13.5635L3.34966 13.5369L2.77823 4.91438H1.64219C1.2832 4.91438 0.992188 4.62336 0.992188 4.26438C0.992188 3.90539 1.2832 3.61438 1.64219 3.61438H3.38156H3.39288H5.11046C5.11335 3.40362 5.12026 3.21287 5.13679 3.04328C5.16705 2.73285 5.23378 2.43235 5.40559 2.14969C5.66188 1.72802 6.0578 1.40509 6.51819 1.20844C6.8132 1.08244 7.12531 1.03252 7.46754 1.00908C7.79988 0.986319 8.20897 0.986323 8.7101 0.986328H8.71011ZM12.5228 3.16938C12.5347 3.29154 12.5402 3.43483 12.5428 3.61438H6.41063C6.41321 3.43483 6.41876 3.29154 6.43066 3.16938C6.45107 2.96004 6.48565 2.87563 6.51648 2.8249C6.61667 2.66006 6.78958 2.50615 7.02883 2.40395C7.13153 2.36009 7.27857 2.32507 7.55637 2.30604C7.83901 2.28668 8.20343 2.28633 8.73305 2.28633H10.2204C10.75 2.28633 11.1144 2.28668 11.397 2.30604C11.6748 2.32507 11.8219 2.36009 11.9246 2.40395C12.1638 2.50615 12.3367 2.66006 12.4369 2.8249C12.4678 2.87563 12.5023 2.96004 12.5228 3.16938ZM14.9028 4.91438H4.08108L4.64681 13.4509C4.69338 14.1536 4.72628 14.6429 4.78183 15.0235C4.83624 15.3963 4.90596 15.6118 4.9988 15.7757C5.19603 16.1239 5.49314 16.4033 5.85045 16.5775C6.01801 16.6592 6.23505 16.7146 6.60764 16.7444C6.98824 16.7748 7.47529 16.7752 8.1755 16.7752H10.8084C11.5086 16.7752 11.9957 16.7748 12.3763 16.7444C12.7488 16.7146 12.9659 16.6592 13.1334 16.5775C13.4908 16.4033 13.7879 16.1239 13.9851 15.7757C14.0779 15.6118 14.1477 15.3963 14.2021 15.0235C14.2576 14.6429 14.2905 14.1536 14.3371 13.4509L14.9028 4.91438ZM8.30684 6.86946C8.30684 6.51047 8.01582 6.21946 7.65684 6.21946C7.29785 6.21946 7.00684 6.51047 7.00684 6.86946V14.3504C7.00684 14.7093 7.29785 15.0004 7.65684 15.0004C8.01582 15.0004 8.30684 14.7093 8.30684 14.3504V6.86946ZM11.612 6.86946C11.612 6.51047 11.321 6.21946 10.962 6.21946C10.603 6.21946 10.312 6.51047 10.312 6.86946V14.3504C10.312 14.7093 10.603 15.0004 10.962 15.0004C11.321 15.0004 11.612 14.7093 11.612 14.3504V6.86946Z"
                fill="#232327"
              />
            </svg>

            {t("trash")}
          </button>
        </div>
      </UploadElementBaseDropdownContent>
    </Dropdown>
  );
};
