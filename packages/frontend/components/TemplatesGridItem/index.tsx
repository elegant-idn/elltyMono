import clsx from "clsx";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import Router from "next/router";
import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { getRandomArrayElement } from "../../utils/getRandomArrayElement";
import hexToDataUrl from "../../utils/hexToDataUrl";
import s from "./TemplatesGridItem.module.scss";

interface GridItemProps {
  item: any;
  handleOpenCardModal?: any;
}

const colors = [
  "#D2D7B5",
  "#FBEFC1",
  "#EBF8FF",
  "#A3B8CD",
  "#EFE9F4",
  "#FCF2F5",
  "#DE9EA3",
  "#F3EBE1",
  "#F7F6F5",
  "#F6F6F6",
];

const getItemColor = () => {
  return getRandomArrayElement(colors);
};

export const TemplatesGridItem: React.FC<
  React.PropsWithChildren<GridItemProps>
> = ({ item, handleOpenCardModal }) => {
  // console.log(item.status == 'pro');
  const [like, setLike] = React.useState(false);
  const [imgLoaded, setImgLoaded] = React.useState(false);
  const blurDataURLRef = useRef(hexToDataUrl(getItemColor()));

  const handleClickLike = () => {
    setLike(!like);
  };

  const hasBorder = !!item.colors.find((color: any) => color.value === "white");

  return (
    <div className={clsx(s.item, "unselectable")} onClick={handleOpenCardModal}>
      <div className={clsx(s.imgWrapper)}>
        <Image
          src={item.preview[2]}
          alt={item.title}
          layout="intrinsic"
          width={item.width}
          height={item.height}
          placeholder="blur"
          blurDataURL={blurDataURLRef.current}
          onLoadingComplete={() => setImgLoaded(true)}
          className={clsx({ [s.border]: hasBorder })}
        />
        {item.status == "pro" && imgLoaded && (
          <div className={s.proBadge}>
            <svg
              width="17"
              height="17"
              viewBox="7 7 25 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.40499 18.445C9.24069 18.0616 9.59037 17.6574 9.9934 17.7649L16.0952 19.3921C16.3294 19.4545 16.5747 19.34 16.6772 19.1204L19.5469 12.9709C19.7265 12.5862 20.2735 12.5862 20.4531 12.9709L23.3228 19.1204C23.4253 19.34 23.6706 19.4545 23.9048 19.3921L30.0066 17.7649C30.4096 17.6574 30.7593 18.0616 30.595 18.445L26.6299 27.697C26.5511 27.8808 26.3703 28 26.1703 28H13.8297C13.6297 28 13.4489 27.8808 13.3701 27.697L9.40499 18.445Z"
                fill="#FFBE0B"
              />
            </svg>
          </div>
        )}
      </div>
      <div className={s.title}>{item.title}</div>
      <div
        className={clsx(s.likeWrapper, like && s.liked)}
        onClick={(e) => {
          e.stopPropagation(), handleClickLike();
        }}
      >
        {/* heart svg */}
        <svg viewBox="0 0 16 14">
          <path d="M9.21739 1.71711C8.91304 1.71711 8.27107 2.37198 8.01883 2.92375M8.01883 2.92375C8.77874 1.73971 10.9011 -0.149028 13.5289 1.4863C14.4144 2.19483 14.8203 3.15923 14.9125 3.55286C15.1893 4.53694 14.9679 7.15458 11.8685 9.75255C8.99057 12.1143 8.08659 12.9016 7.99435 13L4.12016 9.75255C2.18307 7.98122 0.633394 6.387 1.07616 3.55286C1.7403 1.42725 2.94923 1.10699 3.5667 0.895854C4.67361 0.600637 6.48876 0.531039 8.01883 2.92375Z" />
        </svg>
      </div>
    </div>
  );
};

interface TemplatesGridItemBlankProps {
  width?: number;
  height?: number;
  categoryId: string;
}

export const TemplatesGridItemBlank: React.FC<
  React.PropsWithChildren<TemplatesGridItemBlankProps>
> = ({ width = 1080, height = 1080, categoryId }) => {
  const dispatch = useDispatch();
  const { t }: any = useTranslation("index");
  const i18n = t("templatesPage", { returnObjects: true });

  return (
    <div
      className={clsx(s.item, s.blank, "unselectable")}
      onClick={() => {
        // if(width && height) {
        //   dispatch(SetInitialSizesAction({width, height}))
        // }
        Router.push(
          `/design?blank&width=${width}&height=${height}&category_id=${categoryId}`
        );
      }}
    >
      <div className={s.imageContainer}>
        <div className={s.blankPlaceholder}>
          <img
            src="/templates/cross.svg"
            height="21"
            width="21"
            alt="cross image"
          />
        </div>
        <Image width={width} height={height} src="" alt="" unoptimized />
      </div>
      <div className={s.title}>{i18n.createABlank}</div>
    </div>
  );
};
