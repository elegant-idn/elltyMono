import { useTranslation } from "next-i18next";
import React from "react";
import { useDispatch } from "react-redux";
import s from "./SearchPanel.module.scss";

interface SearchPanelProps {
  value?: any;
  changeValue?: any;
}

const SearchPanel: React.FC<React.PropsWithChildren<SearchPanelProps>> = ({
  value,
  changeValue,
}) => {
  const { t } = useTranslation("index");
  const i18n = t("templatesPage", { returnObjects: true });
  const searchInputRef = React.useRef<any>(null);
  const dispatch = useDispatch();

  return (
    <div className={s.root}>
      <input
        ref={searchInputRef}
        type="text"
        placeholder={String(i18n.search)}
        value={value}
        onChange={(e: any) => {
          dispatch(changeValue(e.target.value));
        }}
      />
      <img
        onClick={() => {
          searchInputRef.current.focus();
        }}
        src="/magnifier.svg"
        alt="magnifier"
      />

      {value && (
        <svg
          onClick={() => {
            dispatch(changeValue(""));
          }}
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="#000"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.05469 7.0625L23.3747 23.3825M7.05469 23.3825L23.3747 7.0625"
            stroke="#000"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      )}
    </div>
  );
};

export default SearchPanel;
