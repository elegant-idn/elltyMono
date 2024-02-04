import { useTranslation } from "next-i18next";
import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import {
  ToggleAuthModalAction,
  ToggleCheckoutModalAction,
} from "../../../../redux/actions";
import useTypedSelector from "../../../../utils/useTypedSelector";
import BtnPrimary from "../../../BtnPrimary";
import s from "./UploadsSection.module.scss";

interface UploadSectionBtnProps {
  progress: number | null;
  onUpload: (files: File[]) => unknown;
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

export const UploadSectionBtn: React.FC<UploadSectionBtnProps> = ({
  progress,
  onUpload,
}) => {
  const { t }: any = useTranslation("design", {
    keyPrefix: "content.polotno.sidePanel",
  });
  const { t: tIndex }: any = useTranslation("index");
  const user = useTypedSelector((state) => state.mainReducer.user);
  const dispatch = useDispatch();
  const inputRef = useRef<null | HTMLInputElement>(null);

  const shared = {
    className: s.uploadBtn,
    disabled:
      (progress === null && user.uuid) ||
      (progress === 100 && user.plan === "pro"),
  };

  if (!user.uuid) {
    return (
      <div className={s.uploadLabel}>
        <BtnPrimary
          {...shared}
          onClick={() => dispatch(ToggleAuthModalAction(true))}
        >
          {t("uploadBtn")}
        </BtnPrimary>
      </div>
    );
  }

  if (user.plan === "free" && progress === 100) {
    return (
      <div className={s.uploadLabel}>
        <BtnPrimary
          {...shared}
          onClick={() => dispatch(ToggleCheckoutModalAction(true))}
        >
          {tIndex("toPro")}
        </BtnPrimary>
      </div>
    );
  }

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    const validFiles = files.filter((file) => isValidForUpload(file));

    onUpload(validFiles);

    // should reset value to allow uploading the same file twice
    e.target.value = "";
  };

  return (
    <label className={s.uploadLabel}>
      <BtnPrimary
        {...shared}
        onClick={() => inputRef.current?.click()}
        style={{ cursor: shared.disabled ? "not-allowed" : undefined }}
      >
        {t("uploadBtn")}
      </BtnPrimary>
      <input
        type="file"
        id="12"
        accept={`.${ALLOWED_EXTENSIONS.join(",.")}`}
        onChange={handleFileChange}
        multiple
        disabled={shared.disabled}
        title=""
        ref={inputRef}
      />
    </label>
  );
};
