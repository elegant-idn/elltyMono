/* eslint-disable @next/next/no-img-element */
import React from "react";
import s from "./Slider.module.scss";
import { observer } from "mobx-react-lite";
import { getImageSize } from "polotno/utils/image";
import { unstable_registerNextDomDrop } from "polotno/config";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Controller,
  FreeMode,
  Mousewheel,
  Scrollbar,
} from "swiper";
import "swiper/css";
import clsx from "clsx";
import { nanoid } from "nanoid";
import GridImg from "../GridImg";
import { useDispatch } from "react-redux";
import { SetElementsPanelCategoryAction } from "../../../redux/actions";
import { useTranslation } from "next-i18next";
import { Api } from "../../../api";

interface ICategory {
  value: string;
  _id: string;
}

interface SliderProps {
  store: any;
  category: ICategory;
}

const EMPTY_SLIDERS = [1, 2, 3, 4, 5, 6, 7, 8];

// @ts-ignore
const Slider: React.FC<React.PropsWithChildren<SliderProps>> = ({
  store,
  category,
}) => {
  const { t: tCommon }: any = useTranslation("common");
  const i18nCategories: any[] = tCommon("categories", { returnObjects: true });
  const i18n = i18nCategories.find((s) => s.value == category.value);
  const { t }: any = useTranslation("design");
  const i18nSidePanel = t("content.polotno.sidePanel", { returnObjects: true });

  // const category = elementsCategories.find(
  //   (item) => item.value === sliderCategory
  // ) || {
  //   value: "Arrow",
  //   text: "Arrow",
  //   _id: "",
  // };

  const dispatch = useDispatch();
  const [elements, setElements] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const emptySliderItems = EMPTY_SLIDERS.map((item: number) => {
    return (
      <SwiperSlide key={item} className={s.slide}>
        <div className={s.skeleton}></div>
      </SwiperSlide>
    );
  });

  const sliderItems = elements.map((item: any, i) => {
    const src = `${item.src}`;

    return (
      <SwiperSlide key={i} className={s.slide}>
        <GridImg
          store={store}
          src={item.data}
          preview={item.preview[0]}
          status={item.status}
        />
      </SwiperSlide>
    );
  });

  React.useEffect(() => {
    Api.get(`/elements?categories=${category._id}&amount=10&offset=1`)
      .then((result) => {
        // console.log(result.data);
        setElements(result.data.elements);
      })
      .catch((err) => {
        console.log(err.response);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className={s.root}>
      <div className={s.sliderHeader}>
        {isLoading ? (
          <div className={s.textSkeleton} style={{ width: "125px" }}></div>
        ) : (
          <div>{i18n.text}</div>
        )}
        <div
          onClick={() => {
            dispatch(SetElementsPanelCategoryAction(category));
          }}
        >
          {isLoading ? (
            <div className={s.textSkeleton} style={{ width: "68px" }}></div>
          ) : (
            i18nSidePanel.showMore
          )}
        </div>
      </div>

      <Swiper
        spaceBetween={15}
        onInit={(swiper) => {
          if (window.innerWidth <= 500) swiper.allowTouchMove = true; // 500 is the breakpoint
          swiper.init();
        }}
        slidesPerView="auto"
        modules={[Navigation, FreeMode, Mousewheel]}
        freeMode={{
          enabled: true,
          momentumBounce: false,
        }}
        init={false}
        navigation={{
          prevEl: `.prevSlide${category.value}`,
          nextEl: `.nextSlide${category.value}`,
          disabledClass: "disabled",
          enabled: elements.length > 0,
        }}
        allowTouchMove={false}
        mousewheel={{
          forceToAxis: true,
        }}
        direction="horizontal"
      >
        {elements.length ? sliderItems : emptySliderItems}
        <SwiperSlide className={s.lastSlide}>
          <button
            onClick={() => {
              dispatch(SetElementsPanelCategoryAction(category));
            }}
          >
            <svg viewBox="0 0 6 10">
              <path
                d="M1.45222 0.644603L5.40234 4.59473L1.39462 8.60245"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </SwiperSlide>
      </Swiper>

      <div
        className={clsx(
          s.prevSlide,
          `prevSlide${category.value} prevSlideUnstyled disabled`
        )}
      >
        <svg viewBox="0 0 6 10">
          <path
            d="M1.45222 0.644603L5.40234 4.59473L1.39462 8.60245"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div
        className={clsx(
          s.nextSlide,
          `nextSlide${category.value} nextSlideUnstyled disabled`
        )}
      >
        <svg viewBox="0 0 6 10">
          <path
            d="M1.45222 0.644603L5.40234 4.59473L1.39462 8.60245"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default Slider;
