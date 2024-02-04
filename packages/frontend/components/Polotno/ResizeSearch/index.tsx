import { useTranslation } from "next-i18next";
import React from "react";
import s from "./ResizeSearch.module.scss";
import magnifierGrey from "../../../public/magnifier-gray.svg";
import Image from "next/image";

interface SearchPanelProps {}

const ResizeSearch: React.FC<
  React.PropsWithChildren<SearchPanelProps>
> = ({}) => {
  const { t } = useTranslation("design");
  const i18n: Record<string, string> = t("content.polotno.sidePanel", {
    returnObjects: true,
  });
  const searchInputRef = React.useRef<any>(null);

  return (
    <div className={s.root}>
      <div className={s.icon}>
        <Image
          src={magnifierGrey}
          alt="searchIcon"
          onClick={() => {
            searchInputRef.current.focus();
          }}
        />
      </div>
      <input
        ref={searchInputRef}
        className={s.input}
        type="text"
        placeholder={i18n.searchPlaceholder}
      />
    </div>
  );
};

export default ResizeSearch;
