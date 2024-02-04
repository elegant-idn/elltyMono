/* eslint-disable @next/next/no-img-element */
import React from "react";
import s from "./Polotno.module.scss";
import { getImageSize } from "polotno/utils/image";
import { unstable_registerNextDomDrop } from "polotno/config";
import { Api, BASE_URL } from "../../api";
import axios from "axios";
import usePageSizes from "../../utils/design/usePageSizes";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import {
  SetProTemplatesModalPreviewAction,
  ToggleProTemplatesModalAction,
  ToggleAuthModalAction,
  SetProElementsModalPreviewAction,
  ToggleProElementsModalAction,
} from "../../redux/actions";
import useTypedSelector from "../../utils/useTypedSelector";
import clsx from "clsx";
import Image from "next/image";
import hexToDataUrl from "../../utils/hexToDataUrl";

interface GridImgProps {
  store: any;
  src: string;
  preview?: string;
  uuid?: string;
  status?: "free" | "pro";
  loadWrapper?: (loadCallback: () => unknown) => unknown;
  width?: number;
  height?: number;
}

const defaultWrapper = (cb: () => unknown) => cb();

const MAX_ELEMENT_SIZE = 0.2;

export const addRandomTokenToUrl = (url: string) => {
  const randomValue = Math.floor(Math.random() * 9999);
  const [path, params] = url.split("?");

  if (params === undefined) {
    return [path, `nocache=${randomValue}`].join("?");
  }

  return [path, `nocache=${randomValue}&${params}`].join("?");
};

const GridImg: React.FC<React.PropsWithChildren<GridImgProps>> = ({
  store,
  src,
  preview,
  // if uuid props are passed to the component, this means
  // that the svg address must be queried with an api query
  uuid,
  status = "free",
  loadWrapper = defaultWrapper,
  width,
  height,
}) => {
  const [cookie] = useCookies();
  const dispatch = useDispatch();
  const [pageWidth] = usePageSizes();
  //console.log(pageHeight);
  // const [fetchSrc, setFetchSrc] = React.useState<string>('')
  const axiosData = JSON.stringify({
    format: "svg",
  });
  const user = useTypedSelector((state) => state.mainReducer.user);
  const skeletonRef = React.useRef<HTMLDivElement>(null);

  const fetchSrc: string | undefined = uuid
    ? `${BASE_URL}/iconfinder/v4/icons/${uuid}/formats/svg/0/download`
    : undefined;

  const isCusLine = () => src.startsWith("arrow");

  const drawArrow = (num: number, posX?: number, posY?: number) => {
    const defaultLineWidth = 400;
    const defaultLineHeight = 2;
    const [centerX, centerY] = [
      (store.width - defaultLineWidth) / 2,
      (store.height - defaultLineHeight) / 2,
    ];
    const [x, y] = [posX || centerX, posY || centerY];

    switch (Number(num)) {
      case 1:
        store.activePage.addElement({
          type: "line",
          x,
          y,
          width: defaultLineWidth,
          height: defaultLineHeight,
          color: "black",
        });
        break;
      case 2:
        store.activePage.addElement({
          type: "line",
          x,
          y,
          width: defaultLineWidth,
          height: defaultLineHeight,
          color: "black",
          dash: [5, 1],
        });
        break;
      case 3:
        store.activePage.addElement({
          type: "line",
          x,
          y,
          width: defaultLineWidth,
          height: defaultLineHeight,
          color: "black",
          dash: [1, 1],
        });
        break;
      case 4:
        store.activePage.addElement({
          type: "line",
          x,
          y,
          width: defaultLineWidth,
          height: defaultLineHeight,
          color: "black",
          endHead: "arrow",
        });
        break;
      case 5:
        store.activePage.addElement({
          type: "line",
          x,
          y,
          width: defaultLineWidth,
          height: defaultLineHeight,
          color: "black",
          endHead: "triangle",
        });
        break;
      case 6:
        store.activePage.addElement({
          type: "line",
          x,
          y,
          width: defaultLineWidth,
          height: defaultLineHeight,
          color: "black",
          dash: [1, 1],
          endHead: "triangle",
        });
        break;
      case 7:
        store.activePage.addElement({
          type: "line",
          x,
          y,
          width: defaultLineWidth,
          height: defaultLineHeight,
          color: "black",
          endHead: "arrow",
          startHead: "arrow",
        });
        break;
      case 8:
        store.activePage.addElement({
          type: "line",
          x,
          y,
          width: defaultLineWidth,
          height: defaultLineHeight,
          color: "black",
          dash: [1, 1],
          endHead: "arrow",
          startHead: "arrow",
        });
        break;
      case 9:
        store.activePage.addElement({
          type: "line",
          x,
          y,
          width: defaultLineWidth,
          height: defaultLineHeight,
          color: "black",
          endHead: "arrow",
          startHead: "bar",
        });
        break;
      case 10:
        store.activePage.addElement({
          type: "line",
          x,
          y,
          width: defaultLineWidth,
          height: defaultLineHeight,
          color: "black",
          dash: [1, 1],
          endHead: "triangle",
          startHead: "bar",
        });
        break;
      case 11:
        store.activePage.addElement({
          type: "line",
          x,
          y,
          width: defaultLineWidth,
          height: defaultLineHeight,
          color: "black",
          dash: [5, 1],
          endHead: "triangle",
          startHead: "circle",
        });
        break;
      case 12:
        store.activePage.addElement({
          type: "line",
          x,
          y,
          width: defaultLineWidth,
          height: defaultLineHeight,
          color: "black",
          endHead: "bar",
          startHead: "bar",
        });
        break;
      case 13:
        store.activePage.addElement({
          type: "line",
          x,
          y,
          width: defaultLineWidth,
          height: defaultLineHeight,
          color: "black",
          dash: [1, 1],
          endHead: "bar",
          startHead: "bar",
        });
        break;
      case 14:
        store.activePage.addElement({
          type: "line",
          x,
          y,
          width: defaultLineWidth,
          height: defaultLineHeight,
          color: "black",
          endHead: "square",
          startHead: "square",
        });
        break;
      case 15:
        store.activePage.addElement({
          type: "line",
          x,
          y,
          width: defaultLineWidth,
          height: defaultLineHeight,
          color: "black",
          endHead: "circle",
          startHead: "circle",
        });
        break;
    }
  };

  return (
    <div
      className={s.gridImg}
      onClick={async () => {
        const closeSection = () => {
          if (pageWidth <= 500) store.openSidePanel("");
        };

        if (isCusLine()) {
          drawArrow(Number(src.split("-")[1]));
          closeSection();
          return;
        }

        const elementType = (fetchSrc || src).includes("svg")
          ? "svg"
          : (fetchSrc || src).includes(".json")
          ? "json"
          : "image";
        // console.log("element sizes:", elementWidth, elementHeight);
        // console.log(fetchSrc || src);

        const openTemplate = () => {
          Api.get(fetchSrc || src)
            .then((result) => {
              store.loadJSON(result.data);
            })
            .catch((err) => {
              console.log(err);
            })
            .finally(() => {});
        };

        // Not used yet
        // function getImg(url: string) {
        //   return new Promise<HTMLImageElement>((resolve, reject) => {
        //     let img = new Image();
        //     img.onload = () => resolve(img);
        //     img.onerror = (reason) => reject(reason);
        //     img.src = url;
        //   });
        // }

        const openSvgOrImg = async () => {
          const nonCachedImgUrl = addRandomTokenToUrl(fetchSrc || src);
          const { width, height } = await getImageSize(fetchSrc || src);
          // const img = await getImg(fetchSrc || src)
          // console.log(img.width, img.height);
          const propElement = width / height;
          const elementWidth = store.width * MAX_ELEMENT_SIZE;
          const elementHeight = elementWidth / propElement;

          store.activePage.addElement({
            type: elementType,
            src: nonCachedImgUrl,
            // the location of the element in the center of the design
            x: store.width / 2 - elementWidth / 2,
            y: store.height / 2 - elementHeight / 2,
            width: elementWidth,
            height: elementHeight,
            keepRatio: false,
          });
        };

        loadWrapper(() => {
          if (elementType === "json") {
            if (status === "free") {
              openTemplate();
              closeSection();
              return;
            }

            if (user.email) {
              if (user.plan === "free") {
                dispatch(SetProTemplatesModalPreviewAction(preview));
                dispatch(ToggleProTemplatesModalAction(true));
              } else {
                openTemplate();
              }
            } else {
              dispatch(ToggleAuthModalAction(null));
            }
          }

          if (elementType === "svg" || elementType === "image") {
            if (status === "free") {
              openSvgOrImg();
              closeSection();
              return;
            }

            if (user.email) {
              if (user.plan === "free") {
                dispatch(SetProElementsModalPreviewAction(preview));
                dispatch(ToggleProElementsModalAction(true));
              } else {
                openSvgOrImg();
              }
            } else {
              dispatch(ToggleAuthModalAction(null));
            }
          }

          closeSection();
        });
      }}
    >
      <div className="itemSkeleton" ref={skeletonRef}></div>
      <Image
        src={preview || src}
        draggable
        width={width}
        height={height}
        layout={width && height ? "intrinsic" : "fill"}
        objectFit="contain"
        unoptimized
        onLoadingComplete={() => skeletonRef.current?.remove()}
        onDragStart={async (e) => {
          e.dataTransfer.effectAllowed = "move";
          const dupElem = document.createElement("img");
          dupElem.src = e.currentTarget.src;
          dupElem.style.width = "73px";
          dupElem.style.height = "73px";

          e.currentTarget.style.opacity = "0";

          document.body.appendChild(dupElem);
          e.dataTransfer.setDragImage(dupElem, 73 / 2, 73 / 2);
          if (isCusLine()) {
            unstable_registerNextDomDrop((pos) => {
              drawArrow(Number(src.split("-")[1]), pos.x - 200, pos.y);
            });

            dupElem.remove();
            return;
          }

          const { width, height } = await getImageSize(fetchSrc || src);
          const propElement = width / height;
          const elementWidth = store.width * MAX_ELEMENT_SIZE;
          const elementHeight = elementWidth / propElement;

          const nonCachedImgUrl = addRandomTokenToUrl(fetchSrc || src);
          const elementType = (fetchSrc || src).includes("svg")
            ? "svg"
            : (fetchSrc || src).includes(".json")
            ? "json"
            : "image";

          if (elementType === "json") {
            store.loadJSON(JSON.parse(nonCachedImgUrl));
            return;
          }

          unstable_registerNextDomDrop((pos, element) => {
            store.activePage.addElement({
              type: elementType,
              src: nonCachedImgUrl,
              x: pos.x - 30,
              y: pos.y - 30,
              width: elementWidth,
              height: elementHeight,
              keepRatio: false,
            });
          });

          dupElem.remove();
        }}
        onDragEnd={async (e) => {
          e.currentTarget.style.opacity = "1";
          unstable_registerNextDomDrop(null);
        }}
        alt="element item"
      />
      {status === "pro" && (
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
  );
};

export default GridImg;
