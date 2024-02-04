import React, { useRef } from "react";

import s from "./BaseUplaodButton.module.scss";
import BtnPrimary from "../BtnPrimary";
import clsx from "clsx";

interface UploadSectionBtnProps {
  onUpload: (files: File[]) => unknown;
  children?: React.ReactNode;
  disabled?: boolean;
  unstyled?: boolean;
  className?: string;
}

const ALLOWED_EXTENSIONS = [
  "raw",
  "png",
  "tiff",
  "tif",
  "jpeg",
  "bmp",
  "svg",
  "webp",
  "jpg",
];

const ALLOWED_FILE_SIZE = 1024 * 1024 * 50;

const isValidForUpload = (file: File) => {
  const extension = file.name
    .split(".")
    [file.name.split(".").length - 1].toLowerCase();

  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return false;
  }

  if (file.size > ALLOWED_FILE_SIZE) {
    return false;
  }

  return true;
};

export const BaseUploadButton: React.FC<UploadSectionBtnProps> = ({
  onUpload,
  children,
  disabled,
  unstyled,
  className,
}) => {
  const inputRef = useRef<null | HTMLInputElement>(null);

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    const validFiles = files.filter((file) => isValidForUpload(file));

    onUpload(validFiles);

    // should reset value to allow uploading the same file twice
    e.target.value = "";
  };

  return (
    <label className={clsx(s.uploadLabel, className)}>
      {unstyled ? (
        <button disabled={disabled} onClick={() => inputRef.current?.click()}>
          {children}
        </button>
      ) : (
        <BtnPrimary
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
        >
          {children}
        </BtnPrimary>
      )}
      <input
        type="file"
        id="12"
        accept={`.${ALLOWED_EXTENSIONS.join(",.")}`}
        onChange={handleFileChange}
        multiple
        title=""
        ref={inputRef}
      />
    </label>
  );
};
