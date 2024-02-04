import clsx from "clsx";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { InputCheckbox } from "../../Inputs";
import ThreeDots from "../../ThreeDots";
import s from "./DesignElements.module.scss";
import { BaseGridElement } from "../BaseGridElement/BaseGridElement";
import { addDays } from "../../../utils/addDays";
import { daysDifference } from "../../../utils/daysDifference";
import { KEEP_TRASH_DAYS } from "../../../utils/constants";

interface DesignElementProps {
  item: any;
  activeItem?: any;
  selectable?: boolean;
  alwaysShowSelection?: boolean;
  isSelected?: boolean;
  onChangeCheckbox?: any;
  buttonMore?: boolean;
  userTemplate: boolean;
  threeDots?: boolean;
  threeDotsRef?: any;
  threeDotsAction?: any;
  showUpload?: boolean;
  hasLoaded?: boolean;
  trash?: boolean;
}

const btnMore = (
  <div className={s.btnMore}>
    <svg
      width="10"
      height="3"
      viewBox="0 0 10 3"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1.64773 2.61163C1.34906 2.61163 1.09306 2.51029 0.87973 2.30762C0.666397 2.09429 0.559731 1.82762 0.559731 1.50762C0.559731 1.19829 0.666397 0.942292 0.87973 0.739625C1.09306 0.526291 1.34906 0.419625 1.64773 0.419625C1.9464 0.419625 2.19706 0.520958 2.39973 0.723625C2.6024 0.926292 2.70373 1.18762 2.70373 1.50762C2.70373 1.82762 2.59706 2.09429 2.38373 2.30762C2.18106 2.51029 1.93573 2.61163 1.64773 2.61163ZM5.27273 2.61163C4.97406 2.61163 4.71806 2.51029 4.50473 2.30762C4.2914 2.09429 4.18473 1.82762 4.18473 1.50762C4.18473 1.19829 4.2914 0.942292 4.50473 0.739625C4.71806 0.526291 4.97406 0.419625 5.27273 0.419625C5.5714 0.419625 5.82206 0.520958 6.02473 0.723625C6.2274 0.926292 6.32873 1.18762 6.32873 1.50762C6.32873 1.82762 6.22206 2.09429 6.00873 2.30762C5.80606 2.51029 5.56073 2.61163 5.27273 2.61163ZM8.89773 2.61163C8.59906 2.61163 8.34306 2.51029 8.12973 2.30762C7.9164 2.09429 7.80973 1.82762 7.80973 1.50762C7.80973 1.19829 7.9164 0.942292 8.12973 0.739625C8.34306 0.526291 8.59906 0.419625 8.89773 0.419625C9.1964 0.419625 9.44706 0.520958 9.64973 0.723625C9.8524 0.926292 9.95373 1.18762 9.95373 1.50762C9.95373 1.82762 9.84706 2.09429 9.63373 2.30762C9.43106 2.51029 9.18573 2.61163 8.89773 2.61163Z" />
    </svg>
  </div>
);

export const DesignGridElement: React.FC<
  React.PropsWithChildren<DesignElementProps>
> = ({
  item,
  selectable,
  isSelected,
  onChangeCheckbox,
  userTemplate,
  threeDots,
  threeDotsAction,
  activeItem,
  hasLoaded,
  showUpload,
  alwaysShowSelection,
  trash,
}) => {
  const isActiveDots = item.id === activeItem?.id;

  const { t } = useTranslation("common");
  const translationCategories = t("categories", {
    returnObjects: true,
  }) as any[];

  const getCategoryName = (category: any) => {
    const translatedCategory = translationCategories.find(
      (trans) => trans.value === category.value
    );

    return translatedCategory?.text ?? category.value;
  };

  const renderImage = (element: React.ReactNode) => {
    if (item._id === "load" || trash) return element;

    if (alwaysShowSelection) {
      return (
        <span
          onClick={() => {
            onChangeCheckbox();
          }}
        >
          {element}
        </span>
      );
    }

    return (
      <Link
        passHref
        href={
          userTemplate
            ? `/design/${item._id}`
            : `/design?template_id=${item._id}&category_id=${item.categories[0]._id}`
        }
      >
        <a target="_blank">{element}</a>
      </Link>
    );
  };

  const daysBeforeDeleted = trash
    ? Math.max(
        daysDifference(new Date(), addDays(item.deletedAt, KEEP_TRASH_DAYS)),
        1
      )
    : undefined;

  return (
    <BaseGridElement
      imageWrapper={renderImage}
      title={item.title}
      preview={item.preview}
      threeDots={threeDots}
      isActiveDots={isActiveDots}
      onDotsClick={(ref) => threeDotsAction?.(ref, item)}
      showUpload={showUpload}
      hasLoaded={hasLoaded}
      loadingClassName={s.loadingBaseGridElement}
      selectable={item._id !== "load" && selectable}
      isSelected={isSelected}
      onChangeCheckbox={onChangeCheckbox}
      alwaysShowSelection={alwaysShowSelection}
      daysBeforeDeleted={daysBeforeDeleted}
      subtitle={
        <>
          {item.width && item.height && !item.categories && (
            <>
              {item.width}{" "}
              <svg
                width="5"
                height="5"
                viewBox="0 0 5 5"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.03125 1.20313L4.23125 4.40313M1.03125 4.40313L4.23125 1.20312"
                  stroke="#878787"
                  strokeWidth="0.7"
                  strokeLinecap="round"
                />
              </svg>
              {item.height} px
            </>
          )}
          {item.categories && <>{getCategoryName(item.categories)}</>}
        </>
      }
    />
  );
};

export const DesignListElement: React.FC<
  React.PropsWithChildren<DesignElementProps>
> = ({
  item,
  selectable,
  isSelected: isActive,
  onChangeCheckbox,
  buttonMore = true,
  userTemplate,
  threeDots,
  threeDotsRef,
  threeDotsAction,
}) => {
  const dispatch = useDispatch();
  // console.log(item);
  const { t } = useTranslation("common");
  const translationCategories = t("categories", {
    returnObjects: true,
  }) as any[];

  const getCategoryName = (category: any) => {
    const translatedCategory = translationCategories.find(
      (trans) => trans.value === category.value
    );

    return translatedCategory?.text ?? category.value;
  };

  return (
    <div className={s.DesignListElement}>
      <div className={clsx(s.selectWrap, !selectable && "hidden")}>
        <InputCheckbox
          onChange={onChangeCheckbox}
          value={isActive}
          checked={!!isActive}
          variant="blue"
        />
      </div>
      <div className={s.info}>
        <Link
          passHref
          href={
            userTemplate
              ? `/design/${item._id}`
              : `/design?template_id=${item._id}&category_id=${item.categories[0]._id}`
          }
        >
          <a target="_blank">
            <div
              className={s.imgWrapper}
              style={{ backgroundImage: `url("${item.preview[0]}")` }}
            ></div>
          </a>
        </Link>

        <div className={s.title}>{item.title}</div>
      </div>

      {item.categories && (
        <div className={s.category}>{getCategoryName(item.categories)}</div>
      )}

      {/* it is better not to remove the wrapper to the block btnMore*/}
      {buttonMore && <div className={s.btnMoreWrapper}>{btnMore}</div>}
      {threeDots && (
        <div
          className={s.threeDotsHolderList}
          ref={threeDotsRef}
          onClick={threeDotsAction}
        >
          <ThreeDots />
        </div>
      )}
    </div>
  );
};

interface DesignHeaderProps {
  selectable?: boolean;
  isActive?: boolean;
  onChangeCheckbox?: any;
}

export const DesignListHeader: React.FC<
  React.PropsWithChildren<DesignHeaderProps>
> = ({ selectable, isActive, onChangeCheckbox }) => {
  const { t }: any = useTranslation("Dashboard");
  const i18n = t("common", { returnObjects: true });

  return (
    <div className={s.DesignListHeader}>
      <div className={clsx(s.selectWrap, !selectable && "hidden")}>
        <InputCheckbox
          onChange={onChangeCheckbox}
          value={isActive}
          checked={!!isActive}
          variant="blue"
        />
      </div>
      <div className={s.nameHeader}>{i18n.name}</div>
      <div className={s.typeHeader}>{i18n.type}</div>
    </div>
  );
};

export const DesignListAdminHeader: React.FC<
  React.PropsWithChildren<DesignHeaderProps>
> = ({ selectable, isActive, onChangeCheckbox }) => {
  return (
    <div className={clsx(s.DesignListHeader, s.DesignListAdminHeader)}>
      <div className={clsx(s.selectWrap, !selectable && "hidden")}>
        <InputCheckbox
          onChange={onChangeCheckbox}
          value={isActive}
          checked={!!isActive}
          variant="blue"
        />
      </div>

      <div className={s.previewHeader}>Preview</div>
      <div className={s.nameHeader}>Name</div>
      <div className={s.categoriesHeader}>Categories</div>
      <div className={s.tagsHeader}>Tags</div>
    </div>
  );
};
