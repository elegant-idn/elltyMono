import clsx from "clsx";
import { useRouter } from "next/router";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  SetProTemplatesModalPreviewAction,
  ToggleAuthModalAction,
  ToggleProTemplatesModalAction,
  ToggleTemplatesModalAction,
} from "../../redux/actions";
import { RootState } from "../../redux/store";
import s from "./TemplatesModal.module.scss";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Masonry from "react-masonry-css";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";

import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useCookies } from "react-cookie";
import BtnPrimary from "../BtnPrimary";
import ContainerFluid from "../ContainerFluid";
import { TemplatesGridItemBlank } from "../TemplatesGridItem";

interface TemplatesModalProps {
  // the object includes the fields:
  // src, title, category, width, height, like, tags
  item: any;
  categoryUrl: string;
  templateId: string;
}

const TemplatesModal: React.FC<
  React.PropsWithChildren<TemplatesModalProps>
> = ({ item, categoryUrl, templateId }) => {
  const { t }: any = useTranslation("index");
  const i18n = t("templatesPage.templateModal", { returnObjects: true });
  const [cookie] = useCookies();
  const router = useRouter();
  const dispatch = useDispatch();
  const modalOpen = useSelector(
    (state: RootState) => state.mainReducer.templatesModalOpen
  );
  const [imgLoaded, setImgLoaded] = React.useState(false);

  // let imgRef = React.useRef<any>(null)

  // console.log(imageStyles);

  // React.useEffect(() => {
  //   console.log('change');
  //   console.log(imgRef.current);
  //   if(imgRef.current) {
  //     console.log(imgRef.current);
  //     setImageStyles(getComputedStyle(imgRef.current, ""))
  //   }
  // }, [imgRef])

  // React.useEffect(() => {
  //   console.log(item.title.toLowerCase().replace(/,/g, '').split(' ').join('-'));
  //   if (router.query.id) {
  //     window.history.replaceState(null, '', `${item._id}`)
  //   } else {
  //     // console.log('here');
  //     window.history.replaceState(null, '', `/templates/${item._id}_${item.title.toLowerCase().split(' ').join('-')}`)
  //   }
  // }, [])

  // modal link tooltip
  const cardModalTooltipRef = React.useRef<any>(null);
  const cardModalTooltipBtn = React.useRef<any>(null);
  const [cardModalTooltipState, setCardModalTooltipState] =
    React.useState(false);

  const handleClickOutside = (event: any) => {
    if (
      cardModalTooltipRef.current &&
      !cardModalTooltipRef.current.contains(event.target) &&
      !cardModalTooltipBtn.current.contains(event.target)
    ) {
      setCardModalTooltipState(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  const handleClickCreateDesign = () => {
    if (item.status == "free") {
      return;
    }

    if (cookie.user) {
      if (cookie.user.plan == "free") {
        dispatch(SetProTemplatesModalPreviewAction(item.preview[1]));
        dispatch(ToggleProTemplatesModalAction(true));
      }
    } else {
      dispatch(ToggleAuthModalAction(null));
    }
  };

  const allowOpen = item.status === "free" || cookie.user?.plan === "pro";

  // const categoriesElements = item.categories.map((item: any) => {
  //   return <div key={item._id} className={s.modalTag}>{item.value}</div>
  // })

  const cardModalTagSlides = item.tags.map((item: any) => {
    return (
      <SwiperSlide key={item._id} className={s.swiperSlide}>
        {item.value}
      </SwiperSlide>
    );
  });

  // const masonryElements = data.templatesMasonry.map((item) => {
  //   return (
  //     <TemplatesGridItem key={item.id} item={item} />
  //   )
  // })

  const handleClickCopyLink = () => {
    navigator.clipboard.writeText(String(window.location));
    setCardModalTooltipState(!cardModalTooltipState);
  };

  const handleClose = (changeUrl = true) => {
    if (changeUrl) {
      if (categoryUrl) {
        router.replace(`/templates${categoryUrl}`, undefined, {
          locale: cookie.locale,
          shallow: true,
        });
      } else {
        router.replace(`/templates`, undefined, {
          locale: cookie.locale,
          shallow: true,
        });
      }
    }

    dispatch(ToggleTemplatesModalAction(false));
  };

  return (
    <Modal
      open={modalOpen}
      onClose={() => handleClose()}
      closeAfterTransition
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Box className={clsx("modal", s.modalCard)}>
        <button className={s.closeBtn} onClick={() => handleClose()}></button>
        {/* <div className={s.leftArrow}></div>
        <div className={s.rightArrow}></div> */}

        <div className={s.containerFluid}>
          <ContainerFluid>
            <div className={s.header}>
              <a href="#">
                <img
                  className={clsx(s.logo, "templateModalImg")}
                  src="/logo.svg"
                  alt="logo"
                />
              </a>
              <button
                className={s.closeBtn}
                onClick={() => handleClose()}
              ></button>
            </div>

            <div className={s.content}>
              <div className={s.modalImg}>
                {!imgLoaded && <div className={s.skeleton}></div>}
                <img
                  src={item.preview[0]}
                  alt={item.title}
                  onLoad={() => setImgLoaded(true)}
                />

                {/* <div className={s.imgWrapper}>
                  <Image src={item.preview[0]} layout="fill" objectFit="contain" alt="" />
                  {item.status == 'pro' &&
                    <div className={s.proBadge}>pro</div>
                  }
                </div> */}

                {/* {item.status == 'pro' &&
                  <div className={s.proBadge} style={{left: imageStyles?.marginLeft}}>pro</div>
                } */}
              </div>
              <div className={s.modalText}>
                <div className={s.modalTextTitle}>
                  {item.title}{" "}
                  {item.status == "pro" && (
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

                <div className={s.modalTags}>
                  {/* {categoriesElements} */}
                  {/* <div className={clsx(s.modalTag, s.plan)}>PRO</div> */}
                  <div className={s.modalTag}>{item.categories[0].value}</div>
                  <div className={s.modalTag}>
                    {item.width} x {item.height} px
                  </div>
                </div>

                <div className={s.modalAdvs}>
                  <div className={s.modalAdvTitle}>{i18n.advTitle}</div>
                  <div className={s.modalAdv}>
                    <svg viewBox="0 0 18 18" fill="none">
                      <rect
                        x="1.45898"
                        y="1.45898"
                        width="15.0817"
                        height="15.0817"
                        rx="2.5"
                        stroke="#36373C"
                        strokeLinecap="square"
                        strokeLinejoin="round"
                        strokeDasharray="3 6"
                      />
                      <path
                        d="M5.87305 6.31934H9.00004M12.127 6.31934H9.00004M9.00004 6.31934V12.3246"
                        stroke="#36373C"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {i18n.advItem1}
                  </div>
                  <div className={s.modalAdv}>
                    <svg viewBox="0 0 18 18" fill="none">
                      <circle cx="6.87939" cy="6.00586" r="1.5" />
                      <rect x="1.5" y="1.5" width="15" height="15" rx="2.5" />
                      <path
                        d="M1.5 13.5L5.48576 10.8428C5.80092 10.6327 6.20774 10.6187 6.5366 10.8066L8.74698 12.0697C9.17906 12.3166 9.72694 12.2082 10.0325 11.8154L12.3045 8.89416C12.6738 8.41937 13.3757 8.37567 13.801 8.801L16.5 11.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {i18n.advItem2}
                  </div>
                  <div className={s.modalAdv}>
                    <svg className={s.brushSvg} viewBox="0 0 18 18" fill="none">
                      <path
                        d="M5.73936 9.89889C5.59191 10.1324 5.66164 10.4412 5.89511 10.5886C6.12859 10.7361 6.4374 10.6664 6.58485 10.4329L5.73936 9.89889ZM7.9385 11.7187C7.69151 11.8422 7.5914 12.1425 7.7149 12.3895C7.83839 12.6365 8.13873 12.7366 8.38572 12.6131L7.9385 11.7187ZM10.1621 10.6722L10.4876 11.0517L10.1621 10.6722ZM7.66211 7.97658L7.25922 7.68047L7.66211 7.97658ZM16.1001 1.66203C16.4195 1.70195 16.5167 1.7989 16.5482 1.8459C16.5844 1.89995 16.627 2.02632 16.5695 2.29988C16.4514 2.86131 15.9875 3.68278 15.2569 4.6568C13.819 6.57387 11.549 8.82414 9.83662 10.2926L10.4876 11.0517C12.233 9.55495 14.5605 7.25177 16.0569 5.25685C16.7935 4.27488 17.3809 3.30073 17.5481 2.50561C17.6332 2.10089 17.6267 1.65876 17.3787 1.28891C17.1259 0.912014 16.7035 0.729671 16.2241 0.669749L16.1001 1.66203ZM9.83662 10.2926C8.96162 11.043 8.27841 11.5487 7.9385 11.7187L8.38572 12.6131C8.85074 12.3806 9.62038 11.7954 10.4876 11.0517L9.83662 10.2926ZM6.58485 10.4329C6.97814 9.81019 7.4832 9.06428 8.065 8.27269L7.25922 7.68047C6.66409 8.4902 6.14572 9.2555 5.73936 9.89889L6.58485 10.4329ZM8.065 8.27269C9.23219 6.6846 10.6935 4.93278 12.1673 3.62332C12.9044 2.96842 13.6305 2.43695 14.3119 2.08999C14.9974 1.74096 15.5972 1.59917 16.1001 1.66203L16.2241 0.669749C15.4469 0.57259 14.6385 0.801562 13.8582 1.19884C13.0739 1.59818 12.2766 2.18855 11.5031 2.87576C9.95578 4.25054 8.44721 6.06409 7.25922 7.68047L8.065 8.27269ZM10.5287 10.3322L8.02871 7.63657L7.29551 8.31658L9.79551 11.0122L10.5287 10.3322Z"
                        fill="#36373C"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M4.54916 16.2031C6.33965 15.7972 7.44439 14.7125 7.44439 13.467C7.44439 12.0863 6.32511 10.967 4.9444 10.967C3.72221 10.967 2.61037 12.1919 2.59792 13.7254C2.65712 14.8582 2.26424 15.6997 1.93174 16.257L1.93724 16.2583C2.56201 16.4011 3.52422 16.4354 4.54916 16.2031ZM1.59781 13.7514C1.66114 14.8083 1.26071 15.4398 0.916487 15.9826C0.825602 16.126 0.738635 16.2631 0.665158 16.4003C0.313394 17.0569 2.44641 17.7052 4.77025 17.1783C6.75926 16.7274 8.44439 15.4 8.44439 13.467C8.44439 11.534 6.87739 9.96698 4.9444 9.96698C3.0114 9.96698 1.59781 11.8184 1.59781 13.7514Z"
                        fill="#36373C"
                      />
                    </svg>
                    {i18n.advItem3}
                  </div>
                </div>

                <div className={s.modalBtns}>
                  <div className={s.modalBtnPrimary}>
                    {allowOpen ? (
                      <Link
                        passHref
                        href={`/design?template_id=${templateId}&category_id=${item.categories[0]._id}`}
                      >
                        <a target="_blank">
                          <BtnPrimary>{i18n.btnPrimary}</BtnPrimary>
                        </a>
                      </Link>
                    ) : (
                      <BtnPrimary onClick={handleClickCreateDesign}>
                        {i18n.btnPrimary}
                      </BtnPrimary>
                    )}
                  </div>
                  <div
                    // className={clsx(s.modalBtnLike, item.like && s.like)}
                    className={clsx(s.modalBtnLike)}
                    // onClick={() => {setitem()}}
                  >
                    <svg viewBox="0 0 16 14">
                      <path d="M9.21739 1.71711C8.91304 1.71711 8.27107 2.37198 8.01883 2.92375M8.01883 2.92375C8.77874 1.73971 10.9011 -0.149028 13.5289 1.4863C14.4144 2.19483 14.8203 3.15923 14.9125 3.55286C15.1893 4.53694 14.9679 7.15458 11.8685 9.75255C8.99057 12.1143 8.08659 12.9016 7.99435 13L4.12016 9.75255C2.18307 7.98122 0.633394 6.387 1.07616 3.55286C1.7403 1.42725 2.94923 1.10699 3.5667 0.895854C4.67361 0.600637 6.48876 0.531039 8.01883 2.92375Z" />
                    </svg>
                  </div>
                </div>

                <div className={s.modalShare}>
                  <span>{i18n.share}</span>
                  <svg className={s.fb}>
                    <use href="#fb" />
                  </svg>
                  <svg className={s.twitter}>
                    <use href="#twitter" />
                  </svg>
                  <svg className={s.pinterest}>
                    <use href="#pinterest" />
                  </svg>
                  <svg
                    ref={cardModalTooltipBtn}
                    className={s.chain}
                    onClick={handleClickCopyLink}
                  >
                    <use href="#chain" />
                  </svg>
                  <div
                    ref={cardModalTooltipRef}
                    className={clsx(
                      s.chainTooltip,
                      cardModalTooltipState && s.active
                    )}
                  >
                    <img className={s.imgDone} src="/done.svg" />
                    <div>
                      <div className={s.chainTooltipTitle}>
                        {i18n.linkCopied}
                      </div>
                      <div className={s.chainTooltipSubtitle}>
                        {i18n.linkCopiedText}
                      </div>
                    </div>
                    <div
                      className={s.chainTooltipClose}
                      onClick={() => {
                        setCardModalTooltipState(!cardModalTooltipState);
                      }}
                    ></div>
                  </div>
                </div>
                {/* ./modalShare */}
              </div>
              {/* ./modalText */}
            </div>
            {/* ./content */}

            <div className={s.cardSlider}>
              <Swiper
                className={s.swiper}
                modules={[Navigation]}
                spaceBetween={10}
                speed={200}
                slidesPerView="auto"
                navigation={{
                  prevEl: ".cardSliderPrev",
                  nextEl: ".cardSliderNext",
                  disabledClass: "disabled",
                }}
              >
                {cardModalTagSlides}
              </Swiper>
              <div className={clsx(s.prevSlide, "prevSlide cardSliderPrev")}>
                <svg viewBox="0 0 6 10">
                  <path
                    d="M1.45222 0.644603L5.40234 4.59473L1.39462 8.60245"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className={clsx(s.nextSlide, "nextSlide cardSliderNext")}>
                <svg viewBox="0 0 6 10">
                  <path
                    d="M1.45222 0.644603L5.40234 4.59473L1.39462 8.60245"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            {/* ./cardSlider */}
            <div className={s.modalGridTitle}>{i18n.gridTitle}</div>
            <div className={clsx(s.cardGrid, "grid")}>
              {/* <div className={clsx(s.viewGridSizer, 'grid-sizer')}></div> */}
              <Masonry
                breakpointCols={{
                  default: 6,
                  1440: 6,
                  1280: 5,
                  1024: 4,
                  620: 3,
                  480: 2,
                }}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
                // spacing={2}
              >
                <TemplatesGridItemBlank
                  width={item.width}
                  height={item.height}
                  categoryId={item.categories[0]._id}
                />
                {/* { masonryElements } */}
              </Masonry>
            </div>
          </ContainerFluid>
        </div>
      </Box>
    </Modal>
  );
};

export default TemplatesModal;
