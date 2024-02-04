import React, { useEffect, useRef } from "react";
import s from "./SidePanelSections.module.scss";
import { useTranslation } from "next-i18next";

type Props = {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
};

function SearchInput({ query, setQuery }: Props) {
  const searchRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { t }: any = useTranslation("design");
  const i18n = t("content", { returnObjects: true });

  return (
    <div className={s.childContainer} ref={containerRef}>
      <div
        className={s.searchInputWrapper}
        onClick={() => {
          if (searchRef.current) {
            searchRef.current.focus();
          }
        }}
      >
        <div className={s.img}>
          <div></div>
        </div>
        <input
          className={s.searchInput}
          placeholder={i18n.polotno.sidePanel.searchPlaceholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          ref={searchRef}
        />
        <div className={s.searchInputBorder}></div>
      </div>
    </div>
  );
}

export default SearchInput;
