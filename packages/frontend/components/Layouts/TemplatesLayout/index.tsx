import clsx from "clsx";
import jump from "jump.js";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import React, { useCallback, useMemo, useRef } from "react";
import { Api } from "../../../api";
import data from "../../../data/main";
import templateTagsData from "../../../data/templateTags";
import s from "./TemplatesLayout.module.scss";

import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import {
  ChangeTemplatesSearchTermAction,
  SetActiveTemplatesCategory,
  SetInitialSizesAction,
  ToggleFilterAction,
  ToggleTemplatesModalAction,
} from "../../../redux/actions";
import { RootState } from "../../../redux/store";

import "swiper/css";
import "swiper/css/navigation";

import Box from "@mui/material/Box";
import Masonry from "react-masonry-css";

import { usePrevious } from "../../../utils/usePrev";
import Breadcrumb from "../../Breadcrumb";
import BtnPrimary from "../../BtnPrimary";
import BtnSecondary from "../../BtnSecondary";
import ContainerFluid from "../../ContainerFluid";
import { ProTemplateModal } from "../../ProTemplateModal";
import SearchInput from "../../SearchInput";
import { StripeTemplates } from "../../StripeSections";
import TemplatesFilterAccordions from "../../TemplatesFilterAccordions";
import {
  TemplatesGridItem,
  TemplatesGridItemBlank,
} from "../../TemplatesGridItem";
import TemplatesModal from "../../TemplatesModal";
import MainLayout from "../MainLayout";
import { TemplatesPagination } from "./TemplatesPagination";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import SkeletonWrapper from "./SkeletonWrapper";

interface TemplatesLayoutProps {
  userToken: string;
  cookieUser: any;
  title?: string;
  authorized: boolean;
  templateCategory?: { _id: string; value: string; url: string };
  pageData: any;
  local: any;
  templates?: any[];
  withCategory?: boolean;
  blankItem?: boolean;
  withTags?: boolean;
  tag?: string;
}

export const ELEMENTS_ON_TEMPLATES_LAYOUT = 34;

const TemplatesLayout: React.FC<
  React.PropsWithChildren<TemplatesLayoutProps>
> = ({
  userToken,
  cookieUser,
  children,
  title,
  authorized = false,
  templateCategory = { _id: "", value: "Popular", url: "" },
  pageData,
  local,
  templates: initialTemplates,
  withCategory,
  blankItem = true,
  withTags,
  tag,
}) => {
  const i18n = local("templatesPage", { returnObjects: true });
  const {
    i18n: { language },
    t,
  } = useTranslation("tags");
  const { t: sectionsT } = useTranslation("categoriesSections");
  const sections: any = sectionsT("sections", { returnObjects: true });

  const [cookie] = useCookies();
  const modalOpen = useSelector(
    (state: RootState) => state.mainReducer.templatesModalOpen
  );
  const proTemplateModalOpen = useSelector(
    (state: RootState) => state.mainReducer.proTemplateModalOpen
  );
  // is the mobile filter window open
  const dispatch = useDispatch();
  const filterState = useSelector(
    (state: RootState) => state.mainReducer.filterOpen
  );

  // is the mobile menu open
  const menuState = useSelector(
    (state: RootState) => state.mainReducer.menuState
  );
  const searchTerm = useSelector(
    (state: RootState) => state.mainReducer.templatesSearchTerm
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [isPaginationLoading, setIsPaginationLoading] = React.useState(false);

  // the data of the model window of the template card is stored in
  // modelstate and is updated when the card has been clicked in Masonry elements
  const [modalState, setModalState] = React.useState<any>({});

  const router = useRouter();
  const [routeTitle, setRouteTitle] = React.useState<any>("");

  // default values for the page /templates
  const [stripeSectionContent, setStripeSectionContent] = React.useState<any>({
    // path: '/templates',
    // name: 'All Templates',
    // text: 'Choose an eye-catching templates or create your own with powerful design tools to grab attention on your brand, product, social media and more.',
    // src: '/templates/hero.png',
    // imgClassName: 'imgInstagramPost',
    width: 1000,
    height: 1000,
  });

  const lastLangPage = React.useRef<number | null>(null);
  const lastEnPage = React.useRef<number | null>(null);

  let sizes: any;
  if (router.query.id) {
    let sizeRouteTitle: any;
    for (let i = 0; i < data.categories.length; i++) {
      sizeRouteTitle = data.categories[i].sections.find(
        (s) => s.value === `/${router.query.id}`
      );
      if (sizeRouteTitle) break;
    }

    if (sizeRouteTitle) {
      sizes = data.templateSizes.find((s) => s.value == sizeRouteTitle.value);
    }
  }

  const [templateInitialSizes, setTemplateInitialSizes] = React.useState({
    width: sizes?.width ?? 1080,
    height: sizes?.height ?? 1080,
  });

  const [templates, setTemplates] = React.useState(initialTemplates ?? []);
  const [colors, setColors] = React.useState([]);

  // only 1 color can be selected in the palette at a time
  const [paletteColor, setPaletteColor] = React.useState("");
  const [paletteElements, setPaletteElements] = React.useState<any>();

  const [paginationPageTotal, setPaginationPageTotal] =
    React.useState<number>(1);
  const [currentPage, setCurrentPage] = React.useState<number>(1);

  React.useEffect(() => {
    Api.get("/colors")
      .then((result) => {
        setColors(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  React.useEffect(() => {
    // if the user visits the category page and templates._id has not loaded yet, then do nothing

    if (router.query.id && !templateCategory._id) {
      let routeTitle;
      for (let i = 0; i < data.categories.length; i++) {
        routeTitle = data.categories[i].sections.find(
          (s) => s.value === `/${router.query.id}`
        );
        if (routeTitle) return;
      }
    }
  }, [router.query.id, templateCategory._id]);

  const prevCategoryId = usePrevious(templateCategory._id);
  const templateUseEffectRan = useRef(false);

  // total count
  React.useEffect(() => {
    (async () => {
      if (withCategory && templateCategory._id === "") return;

      const commonRequestParams = {
        categories: templateCategory._id,
        query: searchTerm,
        colors: paletteColor,
      };

      if (prevCategoryId === templateCategory._id) return;

      setIsPaginationLoading(true);
      const result = await Api.get(`/templates`, {
        params: {
          ...commonRequestParams,
          amount: ELEMENTS_ON_TEMPLATES_LAYOUT,
          page: 1,
        },
      });
      setPaginationPageTotal(
        Math.ceil(result.data.totalItems / ELEMENTS_ON_TEMPLATES_LAYOUT)
      );

      setCurrentPage(1);
      lastLangPage.current = null;
      lastEnPage.current = null;
      setIsPaginationLoading(false);
    })();
  }, [
    paletteColor,
    prevCategoryId,
    searchTerm,
    templateCategory._id,
    withCategory,
  ]);

  const hasInitial = !!initialTemplates;
  // templates
  React.useEffect(() => {
    (async () => {
      if (withCategory && templateCategory._id === "") return;

      if (!templateUseEffectRan.current && hasInitial) {
        templateUseEffectRan.current = true;
        return;
      }

      setIsLoading(true);

      const commonRequestParams = {
        categories: templateCategory._id,
        query: searchTerm,
        colors: paletteColor,
      };

      const templates: any[] = [];

      const cookieLocale = cookie.locale;

      if (
        !lastLangPage.current ||
        !(lastLangPage.current && currentPage > lastLangPage.current)
      ) {
        const langResult = await Api.get("/templates", {
          params: {
            ...commonRequestParams,
            amount: ELEMENTS_ON_TEMPLATES_LAYOUT,
            language: cookieLocale,
            page: currentPage,
          },
        });

        lastLangPage.current = langResult.data.pages;

        templates.push(...langResult.data.templates);
      }

      const neededAmountAfterLang =
        ELEMENTS_ON_TEMPLATES_LAYOUT - templates.length;

      if (
        neededAmountAfterLang > 0 &&
        cookieLocale !== "en" &&
        (!lastEnPage.current ||
          !(
            lastEnPage.current &&
            currentPage - (lastLangPage.current ?? 0) > lastEnPage.current
          ))
      ) {
        const page = currentPage - (lastLangPage.current ?? 0) + 1;

        const enResult = await Api.get("/templates", {
          params: {
            ...commonRequestParams,
            amount: neededAmountAfterLang,
            language: "en",
            page,
          },
        });

        lastEnPage.current = enResult.data.pages;

        templates.push(...enResult.data.templates);
      }

      const neededAmountAfterEn =
        ELEMENTS_ON_TEMPLATES_LAYOUT - templates.length;

      if (neededAmountAfterEn > 0) {
        const page =
          currentPage -
          (lastLangPage.current ?? 0) -
          (lastEnPage.current ?? 0) +
          1;

        const result = await Api.get("/templates", {
          params: {
            ...commonRequestParams,
            amount: neededAmountAfterLang,
            "language[nin]": [cookieLocale, "en"],
            page,
          },
        });
        templates.push(...result.data.templates);
      }

      setTemplates(templates);
      setIsLoading(false);
    })();
  }, [
    currentPage,
    cookie.locale,
    paletteColor,
    searchTerm,
    templateCategory._id,
    hasInitial,
    withCategory,
  ]);

  React.useEffect(() => {
    let palette = colors.map((item: any) => {
      return (
        <Box
          key={item._id}
          className={clsx(
            s.paletteColor,
            paletteColor == item._id && s.active,
            { [s.border]: item.value === "white" }
          )}
          sx={{ backgroundColor: item.hex }}
          onClick={() => {
            paletteColor == item._id
              ? setPaletteColor("")
              : setPaletteColor(item._id);
          }}
        >
          {/* check svg */}
          <svg viewBox="0 0 12 8" fill="none">
            <path
              d="M11 1.5L5 7L1 4.5"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </Box>
      );
    });

    setPaletteElements(palette);
  }, [colors, paletteColor]);

  React.useEffect(() => {
    // console.log('change');
    if (!router.query.id) {
      dispatch(
        SetInitialSizesAction({
          width: stripeSectionContent!.width,
          height: stripeSectionContent!.height,
        })
      );
      setTemplateInitialSizes({
        width: stripeSectionContent!.width,
        height: stripeSectionContent!.height,
      });
    } else {
      // /templates/category page
      let routeTitle: any;
      for (let i = 0; i < data.categories.length; i++) {
        routeTitle = data.categories[i].sections.find(
          (s) => s.value === `/${router.query.id}`
        );
        if (routeTitle) break;
      }
      // console.log(routeTitle);
      if (routeTitle) {
        setStripeSectionContent(routeTitle);
        setRouteTitle(routeTitle!.name);
        const sizes = data.templateSizes.find(
          (s) => s.value == routeTitle.value
        );
        dispatch(
          SetInitialSizesAction({
            width: sizes!.width,
            height: sizes!.height,
          })
        );
        setTemplateInitialSizes({
          width: sizes!.width,
          height: sizes!.height,
        });
      } else {
        // router.push('/templates')
        Api.get(`/templates/single/${String(router.query.id).split("_")[1]}`)
          .then((result) => {
            // console.log(result.data);
            handleOpenCardModal(result.data);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  }, [router]);

  const routes = [{ path: "/templates", title: i18n.allTemplates }];

  if (templateCategory._id) {
    const allSections: any[] = [];
    sections.forEach((section: any) => allSections.push(...section.sections));

    const translation = allSections.find(
      (section) => section.value === templateCategory.url
    );

    routes.push({
      path: `/templates${templateCategory.url}`,
      title: translation?.name ?? routeTitle,
    });
  }

  if (tag) {
    routes.push({
      path: `/templates${templateCategory.url}/${tag}`,
      title: t(`tags.${tag}`),
    });
  }

  const breadcrumbs = routes.map((item, index) => {
    const active = !(routes.length - 1 == index);
    return (
      <Breadcrumb key={nanoid(5)} href={item.path} active={active}>
        {item.title}
      </Breadcrumb>
    );
  });

  const handleClearFilters = () => {
    dispatch(SetActiveTemplatesCategory(null));
    dispatch(ChangeTemplatesSearchTermAction(""));
    setPaletteColor("");

    if (router.query.id) {
      router.push("/templates");
    }
  };

  const filter = (
    <aside className={s.filter}>
      <div className={clsx(s.filterBar, s.filterBtn)}>
        <Image src="/filter.svg" alt="filter image" height={18} width={21} />
        <div style={{ marginLeft: 8 }}>{i18n.filter.filterTitle}</div>
      </div>
      {/*} localData={pageData}*/}
      <div className={s.accordions}>
        <TemplatesFilterAccordions local={local} />
      </div>

      <div className={s.filterBar}>{i18n.filter.colorsTitle}</div>

      <div className={clsx(s.palette)}>
        {/* color selection element via palette */}
        <div className={s.palettePicker}>
          <Image
            src="/templates/cross.svg"
            alt="cross image"
            width={14}
            height={14}
          />
        </div>
        {paletteElements}
      </div>
      <div
        onClick={handleClearFilters}
        className={clsx(
          s.link,
          !searchTerm && !paletteColor && !router.query.id && s.disabled
        )}
      >
        {i18n.filter.clearAll}
      </div>
    </aside>
  );

  // console.log(router);
  // this function monitors the status of the template's modal
  // window and changes the url when needed.
  React.useEffect(() => {
    if (modalOpen) {
      // window.history.replaceState(
      //   null,
      //   '',
      //   `/templates/${modalState.title.toLowerCase().replace(/,/g, '').split(' ').join('-')}_${modalState._id}`
      // )
      // router.replace(`/templates/${modalState.title.toLowerCase().replace(/,/g, '').split(' ').join('-')}_${modalState._id}`, undefined, {
      //   locale: 'ru'
      // })

      // console.log(router.query);
      // console.log(data.templateSizes.find(s => s.value == `/${router.query.id}`));

      // if(!data.templateSizes.find(s => s.value == `/${router.query.id}`)) {
      //   return;
      // }

      // console.log(`/templates${templateCategory.url}`);
      // console.log(router);
      // if(router.query) return;

      if (templateCategory.url) {
        router.replace(
          "",
          `${modalState.title
            .toLowerCase()
            .replace(/,/g, "")
            .split(" ")
            .join("-")}_${modalState._id}`, // /templates
          { locale: cookie.locale, shallow: true }
        );
      } else {
        router.replace(
          "",
          `templates/${modalState.title
            .toLowerCase()
            .replace(/,/g, "")
            .split(" ")
            .join("-")}_${modalState._id}`, // /templates
          { locale: cookie.locale, shallow: true }
        );
      }

      // router.replace(
      //   router.asPath,
      //   'gg',
      //   {shallow: true}
      // )

      // Router.push({
      //   pathname: router.asPath,
      //   // query: { id: `/templates/${modalState.title.toLowerCase().replace(/,/g, '').split(' ').join('-')}_${modalState._id}` }
      //   query: { id: `${modalState.title.toLowerCase().replace(/,/g, '').split(' ').join('-')}_${modalState._id}` }
      //   },
      //   undefined, { shallow: true }
      // )
    } else {
      // this logic is located in the TemplatesModal component
      // if (templateCategory.url) {
      //   window.history.replaceState(null, '', `/${router.locale}/templates${templateCategory.url}`)
      // } else {
      //   window.history.replaceState(null, '', `/${router.locale}/templates`)
      // }
    }
  }, [modalOpen]);

  const handleOpenCardModal = useCallback(
    (item: any) => {
      setModalState(item);
      dispatch(ToggleTemplatesModalAction(true));
    },
    [dispatch]
  );

  const templateElements = useMemo(() => {
    return templates.map((item: any) => {
      return item ? (
        <TemplatesGridItem
          key={item._id}
          item={item}
          handleOpenCardModal={() => {
            handleOpenCardModal(item);
          }}
        />
      ) : null;
    });
  }, [templates, handleOpenCardModal]);

  const currentLocaleTags = (
    templateTagsData.categoryValueToTagValue[templateCategory.url] as any
  )?.filter((tagValue: string) => {
    const tagConfig = templateTagsData.tagConfig[tagValue] as any;

    return tagConfig?.locales?.includes(language);
  });

  const shouldHighlight = (tagValue: any) => {
    const highlight = (templateTagsData.highlight as any)?.includes(tagValue);

    const categorySpecificHighlight = (
      templateTagsData.categorySpecificHighlight?.[templateCategory.url] as any
    )?.includes(tagValue);

    return highlight || categorySpecificHighlight;
  };

  return (
    <>
      <MainLayout
        userToken={userToken}
        cookieUser={cookieUser}
        authorized={authorized}
        isLoading={isLoading || isPaginationLoading}
      >
        <div
          className={clsx(
            s.filterMobile,
            !filterState && "hidden",
            menuState.menuOpen && "hidden",
            "fullsreenWindow"
          )}
        >
          <div>
            <div className={clsx(s.mobileMenuDivider, s.first)}></div>
          </div>
          <ContainerFluid>
            <div className={s.filterHeader}>
              <span className={s.filterHeaderLink}>Close</span>
              <span className={s.filterHeaderTitle}>
                {i18n.filter.filterTitle}
              </span>
              <span
                onClick={() => {
                  dispatch(ToggleFilterAction(false));
                }}
                className={s.filterHeaderLink}
              >
                {i18n.filter.close}
              </span>
            </div>
          </ContainerFluid>
          <div>
            <div className={clsx(s.mobileMenuDivider, s.first)}></div>
          </div>
          <ContainerFluid>
            {filter}
            <div className={s.filterMobileBtns}>
              <Box className={s.btnSecondary}>
                <BtnSecondary onClick={handleClearFilters}>
                  {i18n.filter.clearAll}
                </BtnSecondary>
              </Box>
              <Box
                className={s.btnPrimary}
                onClick={() => {
                  dispatch(ToggleFilterAction(false));
                }}
              >
                <BtnPrimary>{i18n.filter.apply}</BtnPrimary>
              </Box>
            </div>
          </ContainerFluid>
        </div>
        <div id="stripeSection">
          <StripeTemplates data={pageData} />
        </div>
        <section className={s.templates}>
          <ContainerFluid>
            {filter}

            <div className={s.view}>
              <div className={s.header}>
                <div className={s.headerTop}>
                  <div
                    onClick={() => {
                      dispatch(ToggleFilterAction(true));
                    }}
                    className={clsx(
                      s.filterBar,
                      s.filterBtn,
                      s.mobile,
                      s.first
                    )}
                  >
                    <Image
                      src="/filter.svg"
                      alt="filter image"
                      width={21}
                      height={18}
                    />
                    <div style={{ marginLeft: 8 }}>
                      {i18n.filter.filterTitle}
                    </div>
                    {/*   </div>  
                  <div className={s.filterSearch}>
                    <SearchInput
                      value={searchTerm}
                      changeValue={ChangeTemplatesSearchTermAction}
                    />
         //uncomment to show search panel on template page from 694 to 700      */}{" "}
                  </div>
                </div>

                {/* <div className={clsx(s.filterSlider, s.tagSlider)}>
                  <Swiper
                    className={s.swiper}
                    modules={[Navigation]}
                    spaceBetween={10}
                    speed={200}
                    slidesPerView="auto"
                    navigation={{
                      prevEl: '.filterSliderPrev',
                      nextEl: '.filterSliderNext',
                      disabledClass: 'disabled'
                    }}
                  >
                    {tagSliderElements}
                  </Swiper>
                  <div className={clsx(s.prevSlide, 'prevSlide filterSliderPrev')}>
                    <svg viewBox="0 0 6 10">
                      <path d="M1.45222 0.644603L5.40234 4.59473L1.39462 8.60245" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className={clsx(s.nextSlide, 'nextSlide filterSliderNext')}>
                    <svg viewBox="0 0 6 10">
                      <path d="M1.45222 0.644603L5.40234 4.59473L1.39462 8.60245" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div> */}
                {withTags && (
                  <SkeletonWrapper
                    containerClassName={s.tagsContainer}
                    placeholder={
                      <div className={s.tags}>
                        {new Array(3).fill(null).map((i) => {
                          return <div className="loading-tag" key={i}></div>;
                        })}
                      </div>
                    }
                  >
                    {currentLocaleTags && (
                      <div className={s.tags}>
                        {currentLocaleTags.map((tagValue: string) => {
                          return (
                            <Link
                              passHref
                              href={`/templates${templateCategory.url}/${tagValue}`}
                              key={tagValue}
                            >
                              <a
                                className={clsx(s.tag, {
                                  [s.highlight]: shouldHighlight(tagValue),
                                })}
                              >
                                {t(`tags.${tagValue}`)}
                              </a>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </SkeletonWrapper>
                )}
                <div className={s.info}>
                  <div className={s.breadcrumbs}>{breadcrumbs}</div>
                </div>

                <div
                  onClick={() => {
                    dispatch(ToggleFilterAction(true));
                  }}
                  className={clsx(s.filterBar, s.filterBtn, s.mobile, s.second)}
                >
                  <Image
                    src="/filter.svg"
                    alt="filter image"
                    width={21}
                    height={18}
                  />

                  <div style={{ marginLeft: 8 }}>{i18n.filter.filterTitle}</div>
                </div>
              </div>
              <div className={clsx(s.viewGrid, "grid")}>
                {/* <div className={clsx(s.viewGridSizer, 'grid-sizer')}></div> */}
                <Masonry
                  breakpointCols={{
                    default: 6,
                    1440: 5,
                    1280: 5,
                    1024: 4,
                    620: 3,
                    480: 2,
                  }}
                  className="my-masonry-grid"
                  columnClassName="my-masonry-grid_column"
                  // spacing={2}
                >
                  {blankItem && (
                    <TemplatesGridItemBlank
                      width={templateInitialSizes.width}
                      height={templateInitialSizes.height}
                      categoryId={templateCategory._id}
                    />
                  )}
                  {templateElements}
                </Masonry>
              </div>
              <TemplatesPagination
                currentPage={currentPage}
                totalPages={paginationPageTotal}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  jump("#stripeSection");
                }}
              />
            </div>
          </ContainerFluid>
        </section>
        {!authorized && (
          <div className={s.stripeBottom}>
            <ContainerFluid>
              <div className={s.wrapper}>
                <div className={s.title}>{pageData?.stripeBottom?.title}</div>

                {pageData?.stripeBottom?.text.map((item: any) => {
                  return (
                    <p key={nanoid(5)} className={s.text}>
                      {item}
                    </p>
                  );
                })}
              </div>
            </ContainerFluid>
          </div>
        )}
        <Box sx={{ marginTop: "40px" }}></Box>
      </MainLayout>

      {modalOpen && (
        <TemplatesModal
          item={modalState}
          categoryUrl={templateCategory.url}
          templateId={modalState._id}
        />
      )}

      {proTemplateModalOpen && <ProTemplateModal />}

      <svg display="none">
        <symbol
          id="poster"
          viewBox="0 0 15 18"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2.7207 1.39893C2.7207 1.12278 2.94456 0.898926 3.2207 0.898926H4.2207C4.49685 0.898926 4.7207 1.12278 4.7207 1.39893V2.22998H10.3887V1.39893C10.3887 1.12278 10.6125 0.898926 10.8887 0.898926H11.8887C12.1648 0.898926 12.3887 1.12278 12.3887 1.39893V2.37304C13.5965 2.76083 14.4707 3.89332 14.4707 5.22998V14.7789C14.4707 16.4357 13.1275 17.7789 11.4707 17.7789H3.69727C2.04041 17.7789 0.697266 16.4357 0.697266 14.7789V5.22998C0.697266 3.91502 1.54328 2.79766 2.7207 2.39251V1.39893ZM3.69727 3.22998H11.4707C12.5752 3.22998 13.4707 4.12541 13.4707 5.22998V14.7789C13.4707 15.8834 12.5752 16.7789 11.4707 16.7789H3.69727C2.5927 16.7789 1.69727 15.8834 1.69727 14.7789V5.22998C1.69727 4.12541 2.5927 3.22998 3.69727 3.22998ZM3.69466 7.39906C3.69466 6.47283 4.44681 5.72119 5.37432 5.72119C6.30187 5.72119 7.05466 6.47287 7.05466 7.39906C7.05466 8.32525 6.30187 9.07693 5.37432 9.07693C4.44681 9.07693 3.69466 8.32529 3.69466 7.39906ZM6.04693 7.39785C6.04693 7.02677 5.74481 6.7251 5.37318 6.7251C5.00178 6.7251 4.70011 7.02656 4.70011 7.39785C4.70011 7.76915 5.00178 8.07061 5.37318 8.07061C5.74481 8.07061 6.04693 7.76893 6.04693 7.39785ZM8.56037 10.098C9.10573 9.4487 10.0877 9.38298 10.7177 9.93255L10.7978 10.0077L12.0763 11.298C12.2538 11.4772 12.2492 11.7632 12.0661 11.9369C11.8995 12.0948 11.6427 12.1054 11.464 11.9714L11.4129 11.9269L10.1345 10.6366C9.91178 10.4119 9.54969 10.4098 9.32366 10.6196L9.27403 10.6717L7.90153 12.3046C7.41605 12.883 6.54255 12.945 5.97739 12.4602L5.90229 12.3907L5.35454 11.844C5.21066 11.698 4.98121 11.6842 4.82142 11.802L4.77096 11.8462L3.82933 12.8178C3.65383 12.9989 3.36149 13.0066 3.17636 12.8349C3.00805 12.6789 2.98629 12.4283 3.11558 12.248L3.1589 12.1962L4.10033 11.2248C4.59595 10.7127 5.41211 10.6854 5.94006 11.1422L6.01702 11.2143L6.562 11.7582C6.72131 11.9172 6.97665 11.9212 7.14128 11.7783L7.18776 11.731L8.56037 10.098Z"
          />
        </symbol>

        <symbol
          id="planner"
          viewBox="0 0 15 17"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.37946 1.46521H4.1914C2.58554 1.46521 1.20117 2.7669 1.20117 4.37355V12.8349C1.20117 14.5321 2.49429 15.7792 4.1914 15.7792H10.4214C12.0281 15.7792 13.3306 14.4416 13.3306 12.8349V5.58009L9.37946 1.46521Z"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.17383 1.45557V3.72437C9.17383 4.83186 10.07 5.73033 11.1775 5.73267C12.2038 5.73501 13.2544 5.73579 13.3254 5.73111"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.0332 8.40243L9.9604 9.01994L11.2506 7.69128"
            strokeLinecap="round"
          />
          <path
            d="M9.0332 12.0713L9.9604 12.6888L11.2506 11.3601"
            strokeLinecap="round"
          />
          <line
            x1="3.12109"
            y1="8.76868"
            x2="7.12715"
            y2="8.76868"
            strokeLinecap="round"
          />
          <line
            x1="3.12109"
            y1="5.2345"
            x2="7.12715"
            y2="5.2345"
            strokeLinecap="round"
          />
          <line
            x1="3.12109"
            y1="12.5707"
            x2="7.12743"
            y2="12.5707"
            strokeLinecap="round"
          />
        </symbol>

        <symbol
          id="presentation"
          viewBox="0 0 19 15"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.37988 1.00732V0.868652C9.37988 0.59251 9.60374 0.368652 9.87988 0.368652C10.156 0.368652 10.3799 0.59251 10.3799 0.868652V1.00732H15.8223C17.4791 1.00732 18.8223 2.35047 18.8223 4.00732V9.49308C18.8223 11.1499 17.4791 12.4931 15.8223 12.4931H15.32L16.2693 13.7864C16.4327 14.009 16.3847 14.3219 16.1621 14.4853C15.9395 14.6487 15.6266 14.6007 15.4632 14.3781L14.3752 12.896L14.0795 12.4931H10.3765L10.37 14.2808C10.369 14.5569 10.1443 14.7799 9.86817 14.7789C9.59203 14.7779 9.36899 14.5533 9.36999 14.2771L9.37648 12.4931H5.87094L5.57781 12.8976L4.50642 14.3759C4.34438 14.5995 4.03175 14.6494 3.80816 14.4874C3.58456 14.3253 3.53466 14.0127 3.6967 13.7891L4.63595 12.4931H3.7207C2.06385 12.4931 0.720703 11.1499 0.720703 9.49308V4.00732C0.720703 2.35047 2.06385 1.00732 3.7207 1.00732H9.37988ZM1.7207 9.49308V4.00732C1.7207 2.90275 2.61614 2.00732 3.7207 2.00732H15.8223C16.9268 2.00732 17.8223 2.90275 17.8223 4.00732V9.49308C17.8223 10.5976 16.9268 11.4931 15.8223 11.4931H3.7207C2.61613 11.4931 1.7207 10.5977 1.7207 9.49308ZM3.95727 4.4544C3.95727 3.52817 4.70942 2.77653 5.63693 2.77653C6.56448 2.77653 7.31727 3.52821 7.31727 4.4544C7.31727 5.38059 6.56448 6.13227 5.63693 6.13227C4.70942 6.13227 3.95727 5.38063 3.95727 4.4544ZM6.30954 4.45319C6.30954 4.08212 6.00742 3.78044 5.6358 3.78044C5.26439 3.78044 4.96272 4.0819 4.96272 4.45319C4.96272 4.82449 5.26439 5.12595 5.6358 5.12595C6.00742 5.12595 6.30954 4.82427 6.30954 4.45319ZM8.82285 7.15285C9.36821 6.50355 10.3502 6.43783 10.9802 6.9874L11.0603 7.06258L12.3388 8.3529C12.5163 8.53207 12.5117 8.8181 12.3285 8.99175C12.162 9.14962 11.9052 9.16027 11.7265 9.02629L11.6754 8.98176L10.397 7.6915C10.1743 7.4668 9.81217 7.4647 9.58613 7.67443L9.53651 7.72659L8.16401 9.35941C7.67852 9.93786 6.80502 9.99984 6.23986 9.51509L6.16477 9.4456L5.61702 8.89889C5.47314 8.75284 5.24368 8.73902 5.0839 8.85687L5.03343 8.90104L4.0918 9.87269C3.91631 10.0538 3.62396 10.0614 3.43883 9.88977C3.27053 9.73372 3.24877 9.4832 3.37805 9.30289L3.42137 9.25107L4.3628 8.27961C4.85842 7.76755 5.67458 7.74028 6.20254 8.19703L6.27949 8.26917L6.82448 8.81309C6.98379 8.97205 7.23912 8.9761 7.40376 8.8331L7.45024 8.7858L8.82285 7.15285ZM11.7369 5.60897C11.7369 5.33283 11.9608 5.10897 12.2369 5.10897L16.5616 5.10897C16.8377 5.10897 17.0616 5.33283 17.0616 5.60897C17.0616 5.88511 16.8377 6.10897 16.5616 6.10897L12.2369 6.10897C11.9608 6.10897 11.7369 5.88511 11.7369 5.60897ZM13.7168 3.38157C13.4407 3.38157 13.2168 3.60543 13.2168 3.88157C13.2168 4.15771 13.4407 4.38157 13.7168 4.38157H16.319C16.5952 4.38157 16.819 4.15771 16.819 3.88157C16.819 3.60543 16.5952 3.38157 16.319 3.38157L13.7168 3.38157Z"
          />
        </symbol>

        <symbol
          id="business-card"
          viewBox="0 0 19 14"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1.21094 10.7788V3.00537C1.21094 1.9008 2.10637 1.00537 3.21094 1.00537H15.3121C16.4166 1.00537 17.3121 1.9008 17.3121 3.00537V10.7788C17.3121 11.8833 16.4166 12.7788 15.3121 12.7788H3.21094C2.10637 12.7788 1.21094 11.8833 1.21094 10.7788ZM3.21094 13.7788C1.55408 13.7788 0.210938 12.4356 0.210938 10.7788V3.00537C0.210938 1.34852 1.55408 0.00537109 3.21094 0.00537109H15.3121C16.9689 0.00537109 18.3121 1.34852 18.3121 3.00537V10.7788C18.3121 12.4356 16.9689 13.7788 15.3121 13.7788H3.21094ZM10.9795 6.19153C10.7033 6.18904 10.4775 6.41087 10.475 6.687C10.4725 6.96313 10.6943 7.189 10.9705 7.19149L15.6057 7.23328C15.8819 7.23577 16.1077 7.01394 16.1102 6.7378C16.1127 6.46167 15.8909 6.23581 15.6147 6.23332L10.9795 6.19153ZM10.4383 8.53659C10.4383 8.26045 10.6622 8.0366 10.9383 8.03662L15.606 8.03696C15.8822 8.03698 16.106 8.26085 16.106 8.53699C16.106 8.81314 15.8821 9.03698 15.6059 9.03696L10.9382 9.03662C10.6621 9.0366 10.4383 8.81273 10.4383 8.53659ZM12.9451 4.25729C12.6689 4.25729 12.4451 4.48115 12.4451 4.75729C12.4451 5.03343 12.6689 5.25729 12.9451 5.25729L15.5473 5.25729C15.8234 5.25729 16.0473 5.03343 16.0473 4.75729C16.0473 4.48115 15.8234 4.25729 15.5473 4.25729L12.9451 4.25729Z"
          />
          <path
            d="M5.54442 6.87217C6.4922 6.87217 7.26053 6.10384 7.26053 5.15605C7.26053 4.20827 6.4922 3.43994 5.54442 3.43994C4.59664 3.43994 3.82831 4.20827 3.82831 5.15605C3.82831 6.10384 4.59664 6.87217 5.54442 6.87217Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2.82227 9.25898C2.82182 9.13834 2.8488 9.01918 2.90118 8.9105C3.06556 8.58174 3.52911 8.4075 3.91376 8.3286C4.19117 8.2694 4.47241 8.22985 4.75538 8.21024C5.27929 8.16422 5.80623 8.16422 6.33014 8.21024C6.61309 8.23007 6.89432 8.26962 7.17177 8.3286C7.55641 8.4075 8.01997 8.5653 8.18435 8.9105C8.28969 9.13203 8.28969 9.38922 8.18435 9.61076C8.01997 9.95596 7.55641 10.1138 7.17177 10.1894C6.89468 10.251 6.61334 10.2917 6.33014 10.311C5.90372 10.3472 5.47531 10.3538 5.04798 10.3307C4.94935 10.3307 4.85401 10.3307 4.75538 10.311C4.47324 10.2919 4.19298 10.2513 3.91705 10.1894C3.52911 10.1138 3.06885 9.95596 2.90118 9.61076C2.84906 9.50082 2.82211 9.38065 2.82227 9.25898Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </symbol>

        <symbol
          id="web-banner"
          viewBox="0 0 19 14"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5.86523 4.15162C5.86523 4.87799 6.45418 5.46681 7.1794 5.46681C7.90463 5.46681 8.49358 4.87799 8.49358 4.15162C8.49358 3.42525 7.90463 2.83643 7.1794 2.83643C6.45418 2.83643 5.86523 3.42525 5.86523 4.15162ZM7.1794 1.83643C5.90132 1.83643 4.86523 2.87354 4.86523 4.15162C4.86523 5.4297 5.90132 6.46681 7.1794 6.46681C8.45749 6.46681 9.49358 5.4297 9.49358 4.15162C9.49358 2.87354 8.45749 1.83643 7.1794 1.83643ZM13.8949 2.83643H11.2666V5.46681L13.8949 5.46681V2.83643ZM11.2666 1.83643C10.7143 1.83643 10.2666 2.28414 10.2666 2.83643V5.46681C10.2666 6.01909 10.7143 6.46681 11.2666 6.46681H13.8949C14.4472 6.46681 14.8949 6.01909 14.8949 5.46681V2.83643C14.8949 2.28414 14.4472 1.83643 13.8949 1.83643H11.2666ZM12.2815 10.2658C11.7215 10.2658 11.2666 9.81108 11.2666 9.24995C11.2666 8.68883 11.7215 8.2341 12.2815 8.2341C12.8415 8.2341 13.2965 8.68883 13.2965 9.24995C13.2965 9.81108 12.8415 10.2658 12.2815 10.2658ZM10.2666 9.24995C10.2666 8.13712 11.1687 7.2341 12.2815 7.2341C13.3944 7.2341 14.2965 8.13712 14.2965 9.24995C14.2965 9.65998 14.174 10.0415 13.9637 10.3599C14.0041 10.3821 14.0421 10.4104 14.0764 10.4447L14.7251 11.0934C14.9204 11.2887 14.9204 11.6053 14.7251 11.8005C14.5299 11.9958 14.2133 11.9958 14.018 11.8005L13.3692 11.1518C13.3262 11.1088 13.2927 11.0598 13.2686 11.0076C12.9769 11.172 12.6402 11.2658 12.2815 11.2658C11.1687 11.2658 10.2666 10.3628 10.2666 9.24995ZM7.17744 8.72064L8.12494 10.546H6.22994L7.17744 8.72064ZM6.28989 8.25994C6.66313 7.54087 7.69175 7.54088 8.06499 8.25994L9.0125 10.0853C9.35803 10.751 8.87495 11.546 8.12494 11.546H6.22994C5.47993 11.546 4.99685 10.751 5.34238 10.0853L6.28989 8.25994Z"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1.83008 3.00537V10.7788C1.83008 11.8833 2.72551 12.7788 3.83008 12.7788H15.9312C17.0358 12.7788 17.9312 11.8833 17.9312 10.7788V3.00537C17.9312 1.9008 17.0358 1.00537 15.9312 1.00537H3.83008C2.72551 1.00537 1.83008 1.9008 1.83008 3.00537ZM0.830078 10.7788C0.830078 12.4356 2.17322 13.7788 3.83008 13.7788H15.9312C17.5881 13.7788 18.9312 12.4356 18.9312 10.7788V3.00537C18.9312 1.34852 17.5881 0.00537109 15.9312 0.00537109H3.83008C2.17322 0.00537109 0.830078 1.34852 0.830078 3.00537V10.7788Z"
          />
        </symbol>

        <symbol
          id="etsy"
          viewBox="0 0 13 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.0595 1.18604L11.7871 5.02783H11.124L10.9679 4.38432L10.7144 3.44822L10.5019 2.79732C10.4662 2.6882 10.4177 2.58372 10.3574 2.48609C10.0942 2.06056 9.62957 1.80157 9.12927 1.80157H8.04237H6.62847H5.99191C5.94504 1.80157 5.89823 1.80496 5.85185 1.81171C5.3741 1.88127 5.01978 2.29091 5.01978 2.7737V2.9826V3.62861V4.92063V7.70387H6.59946H7.49655H8.32286C8.59288 7.70387 8.84961 7.58669 9.02652 7.3827C9.11288 7.28312 9.17712 7.16635 9.21499 7.0401L9.27455 6.84159L9.40099 6.21254L9.49023 5.51544H9.62229L9.55258 6.58574L9.49023 7.85407V9.10025L9.62229 10.352H9.40099V9.82818L9.29124 8.97354C9.28014 8.88712 9.26021 8.80206 9.23177 8.7197L9.21526 8.67188C9.17708 8.56131 9.11963 8.45836 9.04557 8.3678C8.85723 8.13749 8.57543 8.0039 8.2779 8.0039H7.52557H6.62847H5.0488L5.01978 12.0097V12.9728C5.01978 13.0972 5.03604 13.2212 5.06813 13.3415L5.11016 13.499C5.16621 13.709 5.29173 13.8939 5.46626 14.0236C5.63224 14.1468 5.8335 14.2134 6.04025 14.2134H6.28742H7.84759H9.40247C9.54816 14.2134 9.693 14.1912 9.83199 14.1475C10.1383 14.0512 10.4034 13.8548 10.5848 13.5898L10.8119 13.2578L11.3775 12.1852L12.0595 10.742H12.6451L12.2161 14.779L10.7144 14.6619H9.7393H8.43266H6.75547H5.33182H3.77165L1.11914 14.779V13.9989L1.95937 13.8446C2.03631 13.8305 2.112 13.8102 2.18572 13.7841L2.40263 13.7071C2.58172 13.6435 2.7334 13.5201 2.83204 13.3577C2.91046 13.2286 2.95193 13.0804 2.95193 12.9293V12.4777V8.7333V4.11129V3.16448C2.95193 2.89989 2.83238 2.64946 2.62665 2.48309C2.50794 2.38709 2.36623 2.32377 2.21553 2.2994L1.78232 2.22933L1.11914 2.12207V1.34199H2.95193H4.66832H7.08649H9.15378H9.93408H10.7144L11.387 1.26401L12.0595 1.18604Z"
            strokeWidth="0.5"
          />
        </symbol>

        <symbol id="a4" viewBox="0 0 15 16" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.51826 0.233029C9.48499 0.227174 9.45075 0.224121 9.4158 0.224121C9.38085 0.224121 9.34661 0.227174 9.31333 0.233029H4.41171C2.46406 0.233029 0.822266 1.81307 0.822266 3.74025V12.1289C0.822266 14.1653 2.39194 15.7787 4.41171 15.7787H10.6674C12.5884 15.7787 14.1746 14.0858 14.1746 12.1289V4.95161C14.1746 4.80001 14.116 4.65427 14.011 4.5449L10.0449 0.413597C9.93417 0.298239 9.78117 0.233029 9.62126 0.233029H9.51826ZM8.82852 1.4069L4.41171 1.40753C3.10289 1.40753 1.99682 2.47199 1.99682 3.74019V12.1289C1.99682 13.5236 3.04796 14.6041 4.41171 14.6041H10.6674C11.922 14.6041 13.0001 13.4535 13.0001 12.1289L12.9996 5.69214L12.3143 5.69448C12.053 5.69416 11.7558 5.69361 11.4254 5.69285C10.0398 5.68993 8.90897 4.60388 8.83263 3.23677L8.82852 3.08926V1.4069ZM12.3571 4.51817L11.428 4.5183C10.6406 4.51664 10.0031 3.87735 10.0031 3.08926V2.06611L12.3571 4.51817ZM9.26709 10.253C9.59143 10.253 9.85437 10.5159 9.85437 10.8402C9.85437 11.1376 9.63343 11.3833 9.34678 11.4222L9.26709 11.4275H5.04103C4.71669 11.4275 4.45376 11.1646 4.45376 10.8402C4.45376 10.5429 4.67469 10.2972 4.96134 10.2583L5.04103 10.253H9.26709ZM8.25542 6.96253C8.25542 6.63818 7.99249 6.37525 7.66814 6.37525H5.04027L4.96058 6.38061C4.67393 6.4195 4.45299 6.66521 4.45299 6.96253C4.45299 7.28687 4.71592 7.54981 5.04027 7.54981H7.66814L7.74783 7.54444C8.03448 7.50556 8.25542 7.25984 8.25542 6.96253Z"
          />
        </symbol>

        <symbol
          id="flyer"
          viewBox="0 0 14 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.20095 0.224121C9.23591 0.224121 9.27015 0.227174 9.30342 0.233029H9.40642C9.56633 0.233029 9.71933 0.298239 9.83007 0.413597L13.7962 4.5449C13.9012 4.65427 13.9598 4.80001 13.9598 4.95161V12.1289C13.9598 14.0858 12.3736 15.7787 10.4526 15.7787H4.19687C2.1771 15.7787 0.607422 14.1653 0.607422 12.1289V3.74025C0.607422 1.81307 2.24922 0.233029 4.19687 0.233029H9.09849C9.13176 0.227174 9.166 0.224121 9.20095 0.224121ZM4.19687 1.40753L8.61368 1.4069V3.08926L8.61778 3.23677C8.69412 4.60388 9.82494 5.68993 11.2106 5.69285C11.541 5.69361 11.8382 5.69416 12.0994 5.69448L12.7847 5.69214L12.7852 12.1289C12.7852 13.4535 11.7072 14.6041 10.4526 14.6041H4.19687C2.83312 14.6041 1.78198 13.5236 1.78198 12.1289V3.74019C1.78198 2.47199 2.88805 1.40753 4.19687 1.40753ZM11.2131 4.5183L12.1423 4.51817L9.78823 2.06611V3.08926C9.78823 3.87735 10.4258 4.51664 11.2131 4.5183ZM9.63987 11.9319C9.63987 11.6075 9.37694 11.3446 9.05259 11.3446H4.82654L4.74685 11.35C4.46019 11.3888 4.23926 11.6346 4.23926 11.9319C4.23926 12.2562 4.50219 12.5192 4.82654 12.5192H9.05259L9.13228 12.5138C9.41893 12.4749 9.63987 12.2292 9.63987 11.9319ZM7.45343 9.09265C7.77778 9.09265 8.04071 9.35558 8.04071 9.67992C8.04071 9.97724 7.81978 10.223 7.53312 10.2618L7.45343 10.2672H4.82556C4.50121 10.2672 4.23828 10.0043 4.23828 9.67992C4.23828 9.38261 4.45922 9.13689 4.74587 9.09801L4.82556 9.09265H7.45343ZM5.60336 4.02086C4.67585 4.02086 3.92369 4.7725 3.92369 5.69873C3.92369 6.62496 4.67585 7.3766 5.60336 7.3766C6.5309 7.3766 7.28369 6.62492 7.28369 5.69873C7.28369 4.77254 6.5309 4.02086 5.60336 4.02086ZM5.60222 5.02477C5.97384 5.02477 6.27596 5.32645 6.27596 5.69752C6.27596 6.0686 5.97384 6.37028 5.60222 6.37028C5.23081 6.37028 4.92915 6.06882 4.92915 5.69752C4.92915 5.32623 5.23081 5.02477 5.60222 5.02477Z"
          />
        </symbol>

        <symbol
          id="phone-wallpaper"
          viewBox="0 0 11 14"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.14698 2.20331C3.21947 2.20331 2.46732 2.95495 2.46732 3.88118C2.46732 4.8074 3.21947 5.55905 4.14698 5.55905C5.07453 5.55905 5.82732 4.80736 5.82732 3.88118C5.82732 2.95499 5.07453 2.20331 4.14698 2.20331ZM4.14584 3.20721C4.51747 3.20721 4.81959 3.50889 4.81959 3.87997C4.81959 4.25105 4.51747 4.55273 4.14584 4.55273C3.77444 4.55273 3.47277 4.25127 3.47277 3.87997C3.47277 3.50867 3.77444 3.20721 4.14584 3.20721ZM8.8378 6.41467C8.20785 5.8651 7.22585 5.93081 6.68049 6.58012L5.30788 8.21307L5.2614 8.26037C5.09677 8.40336 4.84143 8.39932 4.68212 8.24035L4.13713 7.69643L4.06018 7.62429C3.53223 7.16755 2.71606 7.19481 2.22045 7.70688L1.27902 8.67833L1.23569 8.73015C1.10641 8.91047 1.12817 9.16098 1.29647 9.31703C1.48161 9.48869 1.77395 9.48105 1.94944 9.29996L2.89107 8.3283L2.94154 8.28414C3.10133 8.16628 3.33078 8.18011 3.47466 8.32616L4.02241 8.87286L4.0975 8.94235C4.66266 9.42711 5.53617 9.36513 6.02165 8.78667L7.39415 7.15385L7.44377 7.1017C7.66981 6.89197 8.03189 6.89406 8.25462 7.11876L9.53306 8.40902L9.58416 8.45355C9.76285 8.58754 10.0197 8.57689 10.1862 8.41902C10.3694 8.24536 10.3739 7.95934 10.1964 7.78016L8.9179 6.48984L8.8378 6.41467Z"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1.74805 3.00537V10.7788C1.74805 11.8834 2.64348 12.7788 3.74805 12.7788H7.32737C8.43194 12.7788 9.32737 11.8834 9.32737 10.7788V3.00537C9.32737 1.9008 8.43194 1.00537 7.32737 1.00537H3.74805C2.64348 1.00537 1.74805 1.9008 1.74805 3.00537ZM0.748047 10.7788C0.748047 12.4357 2.09119 13.7788 3.74805 13.7788H7.32737C8.98423 13.7788 10.3274 12.4357 10.3274 10.7788V3.00537C10.3274 1.34852 8.98423 0.00537109 7.32737 0.00537109H3.74805C2.09119 0.00537109 0.748047 1.34852 0.748047 3.00537V10.7788Z"
          />
        </symbol>

        <symbol
          id="desktop-wallpaper"
          viewBox="0 0 21 14"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2.47266 10.7788V3.00537C2.47266 1.9008 3.36809 1.00537 4.47266 1.00537H16.5738C17.6784 1.00537 18.5738 1.9008 18.5738 3.00537V10.7788C18.5738 11.1431 18.4764 11.4846 18.3062 11.7788H2.74022C2.57005 11.4846 2.47266 11.1431 2.47266 10.7788ZM1.64336 11.7788C1.53281 11.466 1.47266 11.1294 1.47266 10.7788V3.00537C1.47266 1.34851 2.8158 0.00537109 4.47266 0.00537109H16.5738C18.2307 0.00537109 19.5738 1.34851 19.5738 3.00537V10.7788C19.5738 11.1294 19.5136 11.466 19.4031 11.7788H19.7681C20.3203 11.7788 20.7681 12.2265 20.7681 12.7788C20.7681 13.3311 20.3203 13.7788 19.7681 13.7788H16.5738H4.47266H1.28125C0.728958 13.7788 0.28125 13.3311 0.28125 12.7788C0.28125 12.2265 0.728958 11.7788 1.28125 11.7788H1.64336ZM8.27904 2.56133C7.35153 2.56133 6.59938 3.31297 6.59938 4.2392C6.59938 5.16542 7.35153 5.91707 8.27904 5.91707C9.20659 5.91707 9.95938 5.16537 9.95938 4.2392C9.95938 3.313 9.20659 2.56133 8.27904 2.56133ZM8.27791 3.56523C8.64954 3.56523 8.95166 3.86691 8.95166 4.23799C8.95166 4.60907 8.64954 4.91074 8.27791 4.91074C7.90649 4.91074 7.60483 4.60928 7.60483 4.23799C7.60483 3.8667 7.90649 3.56523 8.27791 3.56523ZM13.6227 6.77269C12.9928 6.22311 12.0108 6.28883 11.4654 6.93814L10.0928 8.57109L10.0463 8.61839C9.8817 8.76138 9.62636 8.75734 9.46704 8.59837L8.92206 8.05444L8.84511 7.98232C8.31715 7.52556 7.50099 7.55283 7.00537 8.0649L6.06395 9.03635L6.02061 9.08817C5.89134 9.26848 5.9131 9.519 6.08141 9.67505C6.26654 9.84671 6.55888 9.83907 6.73438 9.65797L7.67599 8.68631L7.72647 8.64215C7.88626 8.52429 8.11571 8.53812 8.25958 8.68417L8.80734 9.23088L8.88243 9.30037C9.44759 9.78513 10.3211 9.72314 10.8066 9.14468L12.1791 7.51187L12.2287 7.45972C12.4547 7.24998 12.8168 7.25208 13.0396 7.47678L14.318 8.76704L14.3691 8.81157C14.5478 8.94556 14.8046 8.93491 14.9711 8.77704C15.1543 8.60338 15.1589 8.31735 14.9813 8.13818L13.7028 6.84785L13.6227 6.77269Z"
          />
        </symbol>

        <symbol
          id="photo-collage"
          viewBox="0 0 12 11"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.64551 1.74948H1.88477L1.88477 6.12776H4.64551V1.74948ZM1.88477 0.749481C1.33248 0.749481 0.884766 1.1972 0.884766 1.74948V6.12776C0.884766 6.68005 1.33248 7.12776 1.88477 7.12776H4.64551C5.19779 7.12776 5.64551 6.68005 5.64551 6.12776V1.74948C5.64551 1.1972 5.19779 0.749481 4.64551 0.749481H1.88477ZM10.0742 2.76315H7.31409L7.31409 1.75321H10.0742L10.0742 2.76315ZM11.0742 2.76315C11.0742 3.31544 10.6265 3.76315 10.0742 3.76315H7.31409C6.76181 3.76315 6.31409 3.31544 6.31409 2.76315V1.75321C6.31409 1.20093 6.76181 0.753209 7.31409 0.753209H10.0742C10.6265 0.753209 11.0742 1.20092 11.0742 1.75321V2.76315ZM1.88574 8.76901H4.64587L4.64587 9.77896H1.88574L1.88574 8.76901ZM0.885742 8.76901C0.885742 8.21673 1.33346 7.76901 1.88574 7.76901H4.64587C5.19816 7.76901 5.64587 8.21673 5.64587 8.76901V9.77896C5.64587 10.3312 5.19815 10.779 4.64587 10.779H1.88574C1.33346 10.779 0.885742 10.3312 0.885742 9.77896V8.76901ZM10.0742 9.77878H7.31348V5.4005L10.0742 5.4005V9.77878ZM11.0742 9.77878C11.0742 10.3311 10.6265 10.7788 10.0742 10.7788H7.31348C6.76119 10.7788 6.31348 10.3311 6.31348 9.77878V5.4005C6.31348 4.84821 6.76119 4.4005 7.31348 4.4005H10.0742C10.6265 4.4005 11.0742 4.84821 11.0742 5.4005V9.77878Z"
          />
        </symbol>

        <symbol
          id="youtube"
          viewBox="0 0 16 11"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.32701 0.51416H9.96735L11.7324 0.55433L12.5889 0.592913L13.1368 0.670079L13.5072 0.739529L13.6039 0.767523C13.7345 0.805333 13.8606 0.857478 13.9797 0.923008L13.9852 0.926034C14.0677 0.97139 14.1464 1.02327 14.2206 1.08118C14.3565 1.18723 14.4761 1.31261 14.5756 1.45333L14.6493 1.55749C14.7622 1.76802 14.857 1.98783 14.9326 2.21449L14.9348 2.22112L15.0428 2.74585L15.1277 3.37861L15.1894 4.26602L15.228 4.9991V5.72446V6.1643L15.1894 6.83565L15.1277 7.57644L15.0351 8.34039L14.8808 9.14292L14.8537 9.22578C14.7895 9.42234 14.7109 9.61388 14.6184 9.79883L14.5783 9.86391C14.5229 9.95406 14.4587 10.0386 14.3868 10.1162L14.3823 10.1211C14.3289 10.1788 14.2711 10.2324 14.2094 10.2813C14.1222 10.3504 14.0278 10.4099 13.9278 10.4587L13.9188 10.4631C13.8145 10.514 13.705 10.5536 13.5923 10.5812L13.5343 10.5954C13.4136 10.625 13.2905 10.6443 13.1665 10.653L12.3652 10.7094L11.0391 10.7788H9.30169H8.05178H5.60037H4.84118L4.21387 10.7593L3.22149 10.7325L2.7815 10.694L2.42631 10.6477L2.41633 10.6461C2.16625 10.606 1.91954 10.5472 1.67828 10.4702L1.55852 10.4188C1.45871 10.376 1.36381 10.3226 1.27546 10.2594L1.27193 10.2569C1.18326 10.1935 1.10191 10.1205 1.02938 10.0391C0.973817 9.97677 0.923661 9.90983 0.879453 9.839L0.847088 9.78715C0.759122 9.6462 0.687495 9.4957 0.633592 9.33855L0.545316 9.08118L0.422077 8.45614L0.306041 7.3681L0.236328 5.75532V4.55925L0.352367 3.34774L0.498982 2.39088L0.572577 2.06707C0.600606 1.94374 0.641201 1.82361 0.693725 1.70855L0.697457 1.70038C0.750186 1.58488 0.815203 1.47539 0.891384 1.37382L0.900244 1.362C0.987323 1.2459 1.08928 1.14175 1.20351 1.05222C1.27899 0.993058 1.35946 0.940566 1.44403 0.895335L1.48874 0.871418C1.59513 0.814515 1.70718 0.768916 1.82307 0.73537C1.90225 0.71245 1.98296 0.695228 2.0646 0.683837L2.2738 0.654646L2.90656 0.608346L3.72657 0.553649L4.60889 0.51416H5.93148H7.32701ZM6.21094 3.24268V8.05127L10.3776 5.63189L6.21094 3.24268Z"
          />
        </symbol>
      </svg>
    </>
  );
};

// TemplatesLayout.defaultProps = {
//   authorized: false,
//   templateCategory: {_id: '', value: 'Popular', url: ''}
// }

export default TemplatesLayout;
