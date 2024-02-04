import React, { forwardRef, useState } from "react";
import BtnOutline from "../../../../BtnOutline";
import s from "./DeleteImagesPopper.module.scss";
import { useTranslation } from "next-i18next";
import { Checkbox } from "../../../../Checkbox";

interface ContentProps {
  onCancel: () => unknown;
  onSubmit: () => unknown;
}

export const DeleteImagePopperContent = forwardRef<
  HTMLDivElement,
  ContentProps
>(({ onCancel, onSubmit }, ref) => {
  const [checked, setChecked] = useState(false);
  const { t }: any = useTranslation("common", {
    keyPrefix: "modal.deleteUpload",
  });

  return (
    <div className={s.popperRoot} ref={ref}>
      <p className={s.title}>{t("title")}</p>
      <p className={s.body}>{t("body")}</p>
      <div className={s.checkbox}>
        <label>
          <Checkbox value={checked} onChange={(v) => setChecked(v)} />
          <span>{t("checkbox")}</span>
        </label>
      </div>
      <div className={s.actions}>
        <BtnOutline variant="root" onClick={onCancel}>
          {t("cancel")}
        </BtnOutline>
        <BtnOutline
          variant="root"
          disabled={!checked}
          className={s.deleteBtn}
          onClick={onSubmit}
        >
          {t("submit")}
        </BtnOutline>
      </div>
    </div>
  );
});

DeleteImagePopperContent.displayName = "Content";
