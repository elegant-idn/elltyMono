import { SwipeableDrawer, useMediaQuery } from "@mui/material";
import Popper from "@mui/material/Popper";
import clsx from "clsx";
import { nanoid } from "nanoid";
import { useTranslation } from "next-i18next";
import { default as Link, default as NextLink } from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import data from "../../../data/main";
import { useIsMac } from "../../../utils/useIsMac";
import useTypedSelector from "../../../utils/useTypedSelector";
import BtnPrimary from "../../BtnPrimary";
import UpgradeToProBar from "../../Dashboard/UpgradeToProBar";
import { InputCheckbox } from "../../Inputs";
import { NumberInput } from "../../NumberInput";
import ResizeSearch from "../ResizeSearch";
import Toggler from "../Toggler";
import s from "./FileDropdown.module.scss";

interface FileDropdownProps {
  designName?: string;
  onDesignNameChange?: (designName: string) => void;
  onDesignNameSubmit?: (designName?: string) => void;
  fileTooltip: any;
  fileTooltipRef: any;
  categories: object[];
  onClickDownload?: any;
  onSaveClick?: () => void;
  designMode: boolean;
  initialWindow?: string;
  offsetTop?: number;
  goBackBtn?: boolean;
  userToken?: any;
  templateId?: any;
  userTemplateId?: any;
  store?: any;
  forDesign?: boolean;
  mobile?: boolean;
  isOpenDrawer?: boolean;
  setIsOpenDrawer?: (value: boolean) => void;
  isOpenDownloadDrawer?: boolean;
  setIsOpenDownloadDrawer?: (value: boolean) => void;
  offsetLeft?: number;
  onCopyClick?: () => void;
}

const initialWidth = 1080;
const initialHeight = 1080;

const maxSize = 10000;
const minSize = 100;

const FileDropdown: React.FC<React.PropsWithChildren<FileDropdownProps>> = ({
  userToken,
  designName: propsDesignName,
  fileTooltip,
  fileTooltipRef,
  categories,
  onClickDownload,
  designMode,
  initialWindow = "main",
  offsetTop = 0,
  offsetLeft = 0,
  goBackBtn = true,
  templateId,
  store,
  forDesign = false,
  mobile = false,
  isOpenDrawer = false,
  setIsOpenDrawer = () => false,
  isOpenDownloadDrawer = false,
  setIsOpenDownloadDrawer = () => false,
  onSaveClick,
  onDesignNameSubmit,
  onDesignNameChange: propsOnDesignNameChange,
  userTemplateId,
  onCopyClick,
}) => {
  const isMobile = useMediaQuery("(max-width: 1000px)");

  const {
    t,
    i18n: { language },
  }: any = useTranslation("common");
  const { t: tSidePanel }: any = useTranslation("design");
  const i18n = t("file", { returnObjects: true });
  const i18nCategories: any[] = t("categories", {
    returnObjects: true,
    defaultValue: [],
  });
  const i18nSidePanel = tSidePanel("content.polotno.sidePanel", {
    returnObjects: true,
  });
  const user = useTypedSelector((state) => state.mainReducer.user);
  const router = useRouter();
  const [designName, setDesignName] = useState(propsDesignName);
  const [newDesignResize, setNewDesignResize] = React.useState<boolean>(false);
  const [stage, setStage] = React.useState(initialWindow); // main, categories, resize

  const onDesignNameChange = (newDesignName: string) => {
    setDesignName(newDesignName);
  };

  useEffect(() => {
    propsDesignName !== undefined && setDesignName(propsDesignName);
  }, [propsDesignName]);

  const [isMac, setIsMac] = useState(false);
  useIsMac(setIsMac);

  const [resizeWidthValue, setResizeWidthValue] = React.useState<string>("");
  const [resizeHeightValue, setResizeHeightValue] = React.useState<string>("");

  const resizeWidth = useMemo(() => {
    const int = parseInt(resizeWidthValue);

    return int || initialWidth;
  }, [resizeWidthValue]);

  const resizeHeight = useMemo(() => {
    const int = parseInt(resizeHeightValue);

    return int || initialHeight;
  }, [resizeHeightValue]);

  const [useMagicResizeFocus, setUseMagicResizeFocus] = React.useState(false);
  const [changeTitle, setChangeTitle] = React.useState(false);
  const [changesSaved, setChangesSaved] = React.useState(false);
  const [error, setError] = React.useState<string>("");

  const [useMagicPrompt, setUseMagicPrompt] = React.useState<boolean>(false);

  // Categories states
  const [customSizeOnFocus, setCustomSizeOnFocus] =
    React.useState<boolean>(false);
  const [videoOnFocus, setVideoOnFocus] = React.useState<boolean>(false);
  const [presentationOnFocus, setPresentationOnFocus] =
    React.useState<boolean>(false);
  const [facebookPublicsOnFocus, setFacebookPublicsOnFocus] =
    React.useState<boolean>(false);
  const [facebookCoverOnFocus, setFacebookCoverOnFocus] =
    React.useState<boolean>(false);
  const [posterOnFocus, setPosterOnFocus] = React.useState<boolean>(false);
  const [instagramOnFocus, setInstagramOnFocus] =
    React.useState<boolean>(false);
  const [categoryOnFocus, setCategoryOnFocus] = React.useState<string>("");

  const categoryElements = React.useRef<any>(null);
  const categoryItems = React.useRef<any>(null);

  const Pensil = ({ onClick }: any) => (
    <svg
      onClick={onClick}
      className={s.hoverEffect}
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.3571 15.612H9.14863M1 16L5.30655 14.3436C5.58201 14.2377 5.71974 14.1847 5.84859 14.1155C5.96305 14.0541 6.07216 13.9832 6.17479 13.9036C6.29033 13.8139 6.39467 13.7096 6.60336 13.5009L15.3571 4.74715C16.2143 3.88993 16.2143 2.50012 15.3571 1.64291C14.4999 0.785698 13.1101 0.785697 12.2529 1.64291L3.49913 10.3966C3.29044 10.6053 3.1861 10.7097 3.09644 10.8252C3.0168 10.9278 2.94589 11.0369 2.88445 11.1514C2.81528 11.2803 2.76231 11.418 2.65637 11.6934L1 16ZM1 16L2.59722 11.8473C2.71152 11.5501 2.76866 11.4015 2.86668 11.3335C2.95234 11.274 3.05834 11.2515 3.16078 11.2711C3.27799 11.2934 3.39056 11.406 3.61569 11.6311L5.36888 13.3843C5.59401 13.6095 5.70658 13.722 5.72896 13.8392C5.74852 13.9417 5.72603 14.0477 5.66655 14.1333C5.59849 14.2314 5.44991 14.2885 5.15274 14.4028L1 16Z"
        stroke="#242124"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
  const handleChangeTitle = async () => {
    designName && propsOnDesignNameChange?.(designName);
    onDesignNameSubmit?.(designName);
  };
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setError("");
      setChangesSaved(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [error, changesSaved]);
  React.useEffect(() => {
    const listOfExceptions = [
      "Photo Collage Instagram Post",
      "Photo Collage Instagram Story",
      "Arrows",
      "Shapes",
      "Figures",
      "Circle",
      "Invitation",
      "Lines",
      "Line Shapes",
      "Stars",
      "Frames",
      "Abstract Forms",
      "Stars",
      "Shadows",
      "Gradients",
      "Buttons",
      "Botanicals",
      "Brushes",
      "People",
      "Letterings",
      "Speech bubble",
      "Labels",
      "Stickers",
      "Boho",
      "Line Drawings",
      "Web-Elements",
      "Animals",
      "Patterns",
      "Winter",
      "Photo Frames",
    ];

    const filteredOrderedCategories: any[] = [];

    i18nCategories.forEach((i18nCategory) => {
      const isExcluded = i18nCategory.excludeFromFileDropdown;
      const isException = listOfExceptions.find((s) => s == i18nCategory.value);
      if (isException || isExcluded) return;

      const categoryData = categories.find(
        (category: any) => category.value === i18nCategory.value
      );
      if (!categoryData) return;
      filteredOrderedCategories.push(categoryData);
    });

    categoryElements.current = filteredOrderedCategories.map((item: any) => {
      const sizes = data.templateSizes.find(
        (s) => s.value == `/${item.value.toLowerCase().split(" ").join("-")}`
      );

      const categoryName = i18nCategories.find((s) => s.value == item.value);

      return (
        categoryName?.text && (
          <NextLink
            key={nanoid(5)}
            href={`/design?width=${sizes?.width}&height=${sizes?.height}&category_id=${item._id}`}
            passHref
          >
            <a className={clsx(s.categoryItem, s.between)} target="_blank">
              {categoryName?.text}{" "}
              <span className={s.sizes}>
                {sizes?.width} &times; {sizes?.height} px
              </span>
            </a>
          </NextLink>
        )
      );
    });
    // if (!categoryElements.current) {
    // }
  }, [categories]);

  React.useEffect(() => {
    if (!fileTooltip) {
      setStage(initialWindow);
      setResizeWidthValue("");
      setResizeHeightValue("");
    }
    setChangeTitle(false);
  }, [fileTooltip]);

  const toggleTitleChange = () => {
    if (changeTitle) {
      handleChangeTitle();
    }

    setChangeTitle(!changeTitle);
  };

  const listOfExceptions = [
    "Photo Collage Instagram Post",
    "Photo Collage Instagram Story",
    "Arrows",
    "Shapes",
    "Figures",
    "Circle",
    "Invitation",
    "Lines",
    "Line Shapes",
    "Stars",
    "Frames",
    "Abstract Forms",
    "Stars",
    "Shadows",
    "Gradients",
    "Buttons",
    "Botanicals",
    "Brushes",
    "People",
    "Letterings",
    "Speech bubble",
    "Labels",
    "Stickers",
    "Boho",
    "Line Drawings",
    "Web-Elements",
    "Animals",
    "Patterns",
    "Winter",
    "Photo Frames",
  ];
  const categoriesFilter = categories.filter(
    (item: any) => !listOfExceptions.find((s) => s == item.value)
  );
  categoryItems.current = categoriesFilter.map((item: any) => {
    const sizes = data.templateSizes.find(
      (s) => s.value == `/${item.value.toLowerCase().split(" ").join("-")}`
    );
    const categoryName = i18nCategories.find((s) => s.value == item.value);

    return (
      categoryName?.text && (
        <div className={s.category} key={item._id}>
          <div className={s.formatCheckbox}>
            <InputCheckbox
              value={categoryOnFocus === categoryName?.text}
              variant="blue"
              checked={categoryOnFocus === categoryName?.text}
              onChange={() => {
                setCategoryOnFocus(categoryName?.text);
                setResizeWidthValue(String(sizes!.width));
                setResizeHeightValue(String(sizes!.height));
              }}
            />
          </div>
          {categoryName?.text}
          <span
            className={clsx(s.sizePlaceholder, videoOnFocus && s.checkedInput)}
          >
            {sizes?.width} x {sizes?.height} px
          </span>
        </div>
      )
    );
  });

  const content = (
    <>
      <div
        className={clsx(
          s.root,
          forDesign && s.designDropdown,
          !designMode && s.designMode,
          stage === "resize" && s.xl
        )}
        style={{ top: `${offsetTop}px`, left: `${offsetLeft}px` }}
      >
        {stage === "main" && designMode && (
          <>
            {changesSaved && <p className={s.success}>changes saved</p>}
            {error && <p className={s.error}>{error}</p>}
            {user.uuid && (
              <>
                <div className={s.headerName} onClick={toggleTitleChange}>
                  {changeTitle ? (
                    <form onSubmit={toggleTitleChange}>
                      <input
                        onChange={(e: any) =>
                          onDesignNameChange?.(e.target.value)
                        }
                        defaultValue={designName}
                        autoFocus
                        onBlur={toggleTitleChange}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </form>
                  ) : (
                    <>
                      <span>{designName}</span>
                      <Pensil />
                    </>
                  )}
                </div>
              </>
            )}

            <div className={s.divider}></div>
            <div className={s.body}>
              {goBackBtn && (
                <button
                  className={s.link}
                  onClick={() => {
                    setStage("categories");
                  }}
                >
                  {i18n.createNewDesign}
                  <svg>
                    <use href="#chevron" />
                  </svg>
                </button>
              )}
              {userTemplateId && user && (
                <Link
                  passHref
                  href={`/design/${userTemplateId}?copy=true&name=${encodeURIComponent(
                    designName ?? ""
                  )}`}
                >
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onCopyClick}
                  >
                    <button className={s.link}>{i18n.MakeACopy}</button>
                  </a>
                </Link>
              )}
              <button className={s.link} onClick={onSaveClick}>
                {i18n.save}
              </button>
              {mobile && (
                <button className={s.link} onClick={() => setStage("resize")}>
                  {i18nSidePanel.resize}
                </button>
              )}
              <button
                className={s.link}
                onClick={
                  mobile
                    ? isOpenDownloadDrawer
                      ? () => {
                          setIsOpenDrawer(true);
                          setIsOpenDownloadDrawer(false);
                        }
                      : () => {
                          setIsOpenDrawer(false);
                          setIsOpenDownloadDrawer(true);
                        }
                    : onClickDownload
                }
              >
                {i18n.download}
              </button>
            </div>
          </>
        )}

        {stage === "categories" && (
          <div className={clsx(s.categoriesStage, designMode && s.designMode)}>
            {designMode && goBackBtn ? (
              <>
                <div
                  className={clsx(s.header, s.headerLink)}
                  onClick={() => {
                    setStage("main");
                  }}
                >
                  <svg>
                    <use href="#chevron" />
                  </svg>
                  {i18n.createNewDesign}
                </div>
                <div className={s.divider}></div>
              </>
            ) : (
              <>
                {isMobile && (
                  <>
                    <div className={clsx(s.header)}>{i18n.createNewDesign}</div>
                    <div className={s.divider}></div>
                  </>
                )}
              </>
            )}
            <div className={clsx(s.body, !isMac && s.scroll)}>
              {goBackBtn && (
                <button
                  className={s.link}
                  onClick={() => {
                    setStage("newDesign");
                    //setNewDesignResize(true);
                  }}
                >
                  {i18n.CustomSize}
                  <svg>
                    <use href="#chevron" />
                  </svg>
                </button>
              )}
              <div>{categoryElements.current}</div>
            </div>
          </div>
        )}

        {stage === "newDesign" && (
          <div
            className={clsx(
              s.newDesignStage,
              designMode && s.designMode,
              s.resizeStage
            )}
          >
            {goBackBtn && (
              <>
                <div
                  className={clsx(s.header, s.headerLink)}
                  onClick={() => {
                    setStage("categories");
                  }}
                >
                  <svg>
                    <use href="#chevron" />
                  </svg>
                  {i18n.CustomSize}
                </div>
                <div className={s.divider}></div>
              </>
            )}
            <div className={s.body}>
              <NumberInput
                value={resizeWidthValue}
                label={isMobile ? i18n.width : `${i18n.width} (px)`}
                onChange={(value) => {
                  setResizeWidthValue(String(value));
                }}
                min={minSize}
                max={maxSize}
              />
              <NumberInput
                value={resizeHeightValue}
                label={isMobile ? i18n.height : `${i18n.height} (px)`}
                onChange={(value) => {
                  setResizeHeightValue(String(value));
                }}
                min={minSize}
                max={maxSize}
              />

              <div className={s.px}>px</div>

              <div className={s.newDesignLink}>
                <NextLink
                  key={nanoid(5)}
                  href={`/design?width=${resizeWidth}&height=${resizeHeight}`}
                  passHref
                >
                  <a target="_blank">
                    <BtnPrimary
                      disabled={!resizeHeightValue || !resizeWidthValue}
                    >
                      {i18n.createNewDesign}
                    </BtnPrimary>
                  </a>
                </NextLink>
              </div>
            </div>
          </div>
        )}

        {stage === "resize" && (
          <div className={clsx(s.resizeStage, designMode && s.designMode)}>
            {goBackBtn && (
              <>
                <div
                  className={clsx(s.header, s.headerLink)}
                  onClick={() => {
                    setStage("categories");
                  }}
                >
                  <svg>
                    <use href="#chevron" />
                  </svg>
                  {i18n.CustomSize}
                </div>
                <div className={s.divider}></div>
              </>
            )}

            <div className={s.body}>
              <div className={s.search}>
                <ResizeSearch />
              </div>
              <p className={s.formatText}>{i18nSidePanel.customFormat}</p>
              <section className={s.customFormatZone}>
                <div className={s.inputs}>
                  <div
                    className={clsx(
                      s.resizeCheck,
                      customSizeOnFocus && s.checked
                    )}
                  >
                    <InputCheckbox
                      value={customSizeOnFocus}
                      variant="blue"
                      checked={!!customSizeOnFocus}
                      onChange={() => {
                        setCustomSizeOnFocus(!customSizeOnFocus);
                        setVideoOnFocus(false);
                        setPresentationOnFocus(false);
                        setFacebookCoverOnFocus(false);
                        setFacebookPublicsOnFocus(false);
                        setPosterOnFocus(false);
                        setInstagramOnFocus(false);
                      }}
                    />
                  </div>
                  <NumberInput
                    value={resizeWidthValue}
                    label={`${i18n.width} (px)`}
                    onChange={(value) => {
                      setResizeWidthValue(String(value));
                    }}
                    min={minSize}
                    max={maxSize}
                  />
                  <NumberInput
                    value={resizeHeightValue}
                    label={`${i18n.height} (px)`}
                    onChange={(value) => {
                      setResizeHeightValue(String(value));
                    }}
                    min={minSize}
                    max={maxSize}
                  />
                </div>
                <div className={s.magicResize}>
                  <p className={s.magicText}>{i18nSidePanel.useMagicResize}</p>
                  <div
                    className={s.magicHover}
                    onMouseOver={() => setUseMagicPrompt(true)}
                    onMouseLeave={() => setUseMagicPrompt(false)}
                  >
                    ?
                  </div>
                  <span
                    className={clsx(s.prompt, useMagicPrompt && s.activePrompt)}
                  >
                    {i18nSidePanel.magicResizeDescription}
                  </span>
                  <Toggler
                    checked={useMagicResizeFocus}
                    onChange={() => {
                      setUseMagicResizeFocus(
                        useMagicResizeFocus ? false : true
                      );
                    }}
                  />
                </div>
              </section>
              <section className={s.formats}>
                <p className={s.allFormatText}>{i18nSidePanel.allFormats}</p>
                {categoryItems.current}
              </section>
              <section className={s.buttons}>
                {newDesignResize && (
                  <NextLink
                    key={nanoid(5)}
                    href={`/design?width=${resizeWidth}&height=${resizeHeight}`}
                    passHref
                  >
                    <a className={s.categoryItem} target="_blank">
                      <BtnPrimary>{i18n.createNewDesign}</BtnPrimary>
                    </a>
                  </NextLink>
                )}
                {!newDesignResize &&
                  (user.plan == "free" || user.email == null ? (
                    <UpgradeToProBar />
                  ) : (
                    <BtnPrimary
                      onClick={() => {
                        store.setSize(
                          resizeWidth,
                          resizeHeight,
                          useMagicResizeFocus
                        );
                      }}
                      disabled={!resizeHeightValue || !resizeWidthValue}
                    >
                      {i18nSidePanel.resizeBtn}
                    </BtnPrimary>
                  ))}
              </section>
            </div>
          </div>
        )}
      </div>
      <svg display="none">
        <symbol
          width="8"
          height="14"
          viewBox="0 0 8 14"
          id="chevron"
          // eslint-disable-next-line
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.05599 0.610678L7.44531 7L0.962825 13.4825"
            stroke="#1F2128"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </symbol>
      </svg>
    </>
  );

  return mobile ? (
    <SwipeableDrawer
      anchor="bottom"
      onOpen={() => {}}
      onClose={() => setIsOpenDrawer(false)}
      open={!!isOpenDrawer}
      ref={(instance) => {
        fileTooltipRef.current = instance?.querySelector(".MuiDrawer-paper");
      }}
      classes={{
        paper: clsx("drawerPaper"),
      }}
      sx={{
        "& .MuiDrawer-paper": {
          overflow: "hidden",
        },
      }}
    >
      {content}
    </SwipeableDrawer>
  ) : (
    <Popper
      ref={fileTooltipRef}
      id="popper"
      open={!!fileTooltip}
      anchorEl={fileTooltip}
    >
      {content}
    </Popper>
  );
};

export default FileDropdown;
