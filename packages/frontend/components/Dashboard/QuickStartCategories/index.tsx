import { Box } from "@mui/material";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import s from "./QuickStartCategories.module.scss";
import { FreeMode, Navigation, Pagination } from "swiper";
import { useTranslation } from "next-i18next";
import data from "../../../data/main";
import { Api } from "../../../api";

const getTemplateSize = (value: string) => {
  return data.templateSizes.find((ts) => ts.value === value);
};

const allSections = data.categories.reduce<any[]>((acc, category) => {
  acc.push(...category.sections);
  return acc;
}, []);

const getTemplateDataByValue = (value: string) => {
  return allSections.find((ts) => ts.value === value);
};

interface QuickStartCategoriesProps {}

export const QuickStartCategories: React.FC<
  QuickStartCategoriesProps
> = ({}) => {
  const { t: tCategoriesSections } = useTranslation("categoriesSections");

  const { t } = useTranslation("index");

  const transTabs: any = t("designTabsData", {
    returnObjects: true,
    defaultValue: [],
  });

  const tabs = transTabs.filter((tab: any) => tab.homepage !== false);

  const categories: any = tCategoriesSections("sections", {
    returnObjects: true,
    defaultValue: [],
  });

  const swiperRef = useRef(null);
  const [currentTab, setCurrentTab] = useState(tabs[0].value);

  const [metaCategories, setMetaCategories] = useState([]);

  useEffect(() => {
    (async () => {
      const categoriesResult = await Api.get("/categories");
      setMetaCategories(categoriesResult.data);
    })();
  }, []);

  useEffect(() => {
    (swiperRef.current as any)?.swiper.setProgress(0, 0);
  }, [currentTab]);

  const displayCategories = useMemo(() => {
    return (
      categories
        .find((category: any) => category.value === currentTab)
        ?.sections.filter((section: any) => section.homepage !== false) ?? []
    );
  }, [currentTab, categories]);

  const createTemplateDesignLink = (
    width: number | undefined,
    height: number | undefined,
    category: any
  ) => {
    const categoryData = getTemplateDataByValue(category.value);

    const meta: any = metaCategories.find(
      (meta: any) => meta.value === categoryData.name
    );

    return `/design?blank&width=${width ?? 1920}&height=${
      height ?? 1080
    }&category_id=${meta && meta?._id}`;
  };

  return (
    <Box>
      <Box className={s.tabs}>
        {tabs.map((category: any, i: number) => (
          <button
            key={i}
            className={clsx(s.tab, {
              [s.selected]: category.value === currentTab,
            })}
            onClick={() => setCurrentTab(category.value)}
          >
            {category.text}
          </button>
        ))}
      </Box>

      <Box sx={{ position: "relative" }} className={s.categories}>
        <Swiper
          className={s.swiper}
          modules={[Navigation, Pagination, FreeMode]}
          spaceBetween={16}
          slidesPerView="auto"
          freeMode={true}
          {...{ ref: swiperRef }}
          pagination={{
            clickable: true,
          }}
          navigation={{
            prevEl: ".designPrevSlide",
            nextEl: ".designNextSlide",
            disabledClass: "disabled",
          }}
        >
          {displayCategories.map((category: any, i: number) => {
            const size = getTemplateSize(category.value);

            return (
              <SwiperSlide
                key={i}
                className={clsx(s.swiperSlide, s.blank, "unselectable")}
              >
                <Link
                  passHref
                  href={createTemplateDesignLink(
                    size?.width,
                    size?.height,
                    category
                  )}
                >
                  <a target="_blank">
                    <div className={s.img}>
                      <Image
                        src={`/design${category.value}.png`}
                        layout="fill"
                        alt={category.name}
                      />
                      <div className={s.createBlank}>
                        {t("dashboard.createABlank")}
                      </div>
                    </div>
                    <span>{category.name}</span>
                    <p className={s.underText}>
                      {size?.width}
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
                      {size?.height} px
                    </p>
                  </a>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
        <div className={clsx(s.prevSlide, "prevSlide designPrevSlide")}>
          <svg viewBox="0 0 6 10">
            <path
              d="M1.45222 0.644603L5.40234 4.59473L1.39462 8.60245"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className={clsx(s.nextSlide, "nextSlide designNextSlide")}>
          <svg viewBox="0 0 6 10">
            <path
              d="M1.45222 0.644603L5.40234 4.59473L1.39462 8.60245"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </Box>
    </Box>
  );
};
