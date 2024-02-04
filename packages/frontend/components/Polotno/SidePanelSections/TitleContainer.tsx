import React, { useEffect, useRef } from "react";
import s from "./SidePanelSections.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { SetElementsPanelCategoryAction } from "../../../redux/actions";
import { RootState } from "../../../redux/store";

function TitleContainer() {
  const dispatch = useDispatch();
  const { t: tCommon }: any = useTranslation("common");
  const i18nCategories: any[] = tCommon("categories", { returnObjects: true });
  const ref = useRef<HTMLDivElement>(null);

  const elementsPanelCategory = useSelector(
    (state: RootState) => state.designReducer.elementsPanelCategory
  );
  const i18nCategory = i18nCategories.find(
    (s) => s.value == elementsPanelCategory.value
  );

  return (
    <div className={s.title} ref={ref}>
      <div
        className={s.itemContainer}
        onClick={() => {
          dispatch(SetElementsPanelCategoryAction(""));
        }}
      >
        <div className={s.svgContainer}>
          <svg viewBox="0 0 6 10">
            <path
              d="M1.45222 0.644603L5.40234 4.59473L1.39462 8.60245"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span>{i18nCategory?.text}</span>
      </div>
    </div>
  );
}

export default TitleContainer;
