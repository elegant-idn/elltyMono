import clsx from "clsx";
import { nanoid } from "nanoid";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Router, { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import {
  ChangeAuthFormAction,
  SetDesignTabAction,
  ToggleAuthModalAction,
} from "../redux/actions";
import { RootState } from "../redux/store";
import s from "../styles/Home.module.scss";
import imgAbout1 from "/public/about/about4.png";
import imgAbout2 from "/public/about/about5.png";
import imgAbout3 from "/public/about/about6.png";
import imgHero from "/public/hero/hero.png";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import {
  TabPanelUnstyled,
  TabsListUnstyled,
  TabsUnstyled,
  TabUnstyled,
} from "@mui/base";
import Box from "@mui/material/Box";
import { Controller, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";

import BtnPrimary from "../components/BtnPrimary";
import Container from "../components/Container";
import ContainerFluid from "../components/ContainerFluid";
import BrandIdentity from "../components/ContentBlocks/BrandIdentity";
import MainLayout from "../components/Layouts/MainLayout";
import PageLayout from "../components/Layouts/PageLayout";
import Link from "../components/Link";
import { StripeCTA } from "../components/StripeSections";

import { Api } from "../api";
import Dashboard from "../components/Dashboard";
import gaEvent from "../utils/gaEvent";

interface HomeProps {
  cookieUser: any;
  userToken: string;
  // userGoogleAuth: any
}

const templatesSliderLinks: any[] = [
  {
    elem: "6451e0d6b99e40ab6e776db9",
    categoryId: "6230383d1b30dc912e40460c", // inst post
  },
  {
    elem: "643e117ad270cc41131926ac",
    categoryId: "6230d1127416ac790f87d88b", // Facebook Stories
  },
  {
    elem: "63a12354619d97d854d04665",
    categoryId: "622f97adbf3b0eec62acaf1e", // Facebook Post
  },
  {
    elem: "6433d91fdeb1e22f258317b1",
    categoryId: "6230e8b47416ac790f87d8d6", // Phone Wallpaper
  },
  {
    elem: "63eb99431771a349cb1ab39b",
    categoryId: "6230e8897416ac790f87d8c6",
  },
  {
    elem: "64215b4159fbe88a13bfad8b",
    categoryId: "6230383d1b30dc912e40460c",
  },
  {
    elem: "627e988eb944eb5648e472ac",
    categoryId: "6230e8777416ac790f87d8be", // logo
  },
  {
    elem: "63c7b96d8351d2eab5c7be50",
    categoryId: "6230e8477416ac790f87d8aa", // presentation
  },
  {
    elem: "63ea3dc1930c2a16362a7f13",
    categoryId: "6230d1127416ac790f87d88b",
  },
  {
    elem: "63aac1a823d231c653ea0e0f",
    categoryId: "6230e8897416ac790f87d8c6",
  },
  {
    elem: "63e5d694e0a3f0ac94a5ad86",
    categoryId: "6230e8897416ac790f87d8c6", // poster
  },
  {
    elem: "639edf731468c559f101ddb2",
    categoryId: "6230e8477416ac790f87d8aa",
  },
  {
    elem: "63f5df0d5bf3890d703b8e45",
    categoryId: "6230383d1b30dc912e40460c",
  },
  {
    elem: "6360f85c3fc7da0a6a21dbfa",
    categoryId: "622f97adbf3b0eec62acaf1e",
  },
  {
    elem: "640991ae9751fb0699db4424",
    categoryId: "6230d1127416ac790f87d88b",
  },
  {
    elem: "63d21d0c913045b8ce5732a3",
    categoryId: "6230e8897416ac790f87d8c6",
  },
  {
    elem: "6433d66b7e8d2fa0c8e729fb",
    categoryId: "6230383d1b30dc912e40460c",
  },
  {
    elem: "63cd35a527bee756848a7f24",
    categoryId: "6230e8897416ac790f87d8c6",
  },
  {
    elem: "63a122ec619d97d854d042dd",
    categoryId: "6230e8777416ac790f87d8be",
  },
  {
    elem: "63e38ed9933fc948db354503",
    categoryId: "6230e9147416ac790f87d8e2",
  },
];

const handleClickSliderTemplate = (elem: string, categoryId: string) => {
  Router.push(`/design?template_id=${elem}&category_id=${categoryId}`);
};

const Home: NextPage<HomeProps> = ({ cookieUser, userToken }) => {
  const { t } = useTranslation("index");
  const { t: tCategoriesSections } = useTranslation("categoriesSections");
  const tabsFromi18: any = t("designTabsData", { returnObjects: true });
  const dispatch = useDispatch();
  const router = useRouter();
  const [cookie, setCookie, removeCookie] = useCookies();

  // authorization via social networks
  useEffect(() => {
    const userQueryToken = router.query.token;

    // auth via social media
    if (userQueryToken) {
      const axiosHeaders = {
        headers: {
          Authorization: `Bearer ${userQueryToken}`,
        },
      };

      Api.get("/auth/me", axiosHeaders)
        .then((result) => {
          // console.log("auth me result ", result);
          const cookieUserAuth = {
            ...result.data,
            expiresIn: Date.now() + 1000 * 60 * 60 * 24 * 30,
            accessToken: `Bearer ${userQueryToken}`,
          };

          // gaEvent('finish_auth_test')
          if (router.query.action == "login") gaEvent("finish_log_in");
          if (router.query.action == "signup") gaEvent("complete_sign_up");

          try {
            setCookie("user_token", `Bearer ${userQueryToken}`, {
              path: "/",
              expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
            });
            setCookie("user", cookieUserAuth, {
              path: "/",
              expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
            });

            const initialPage = router.query.goto || window.location.pathname;

            // @ts-ignore
            window.location = initialPage;
          } catch (e) {
            console.log(e);
          }

          // gaEvent('complete_sign_up', gaCallback)
        })
        .catch((err) => {
          console.log(err.message);
        })
        .finally(() => {});
    }
  }, [router.query.action, router.query.goto, router.query.token, setCookie]);

  const activeDesignTab = useSelector(
    (state: RootState) => state.mainReducer.designTab
  );

  // store swiper instances
  const [firstSwiper, setFirstSwiper] = useState();
  const [secondSwiper, setSecondSwiper] = useState();

  const tabs = tabsFromi18.filter((tab: any) => tab.homepage !== false);
  const designTabs = tabs.map((item: any) => {
    return (
      <TabUnstyled
        key={nanoid(5)}
        className="tab"
        value={item.value}
        onClick={() => {
          dispatch(SetDesignTabAction(item.value));
        }}
      >
        {item.text}
      </TabUnstyled>
    );
  });

  // let designTabSlides = useRef<any>(null);
  const [designTabSlides, setDesignTabSlides] = useState<any>("");
  const designSwiperRef = useRef<any>();

  useEffect(() => {
    // console.log(t("test", {returnObjects: true})["test3"])
    const categories: any = tCategoriesSections("sections", {
      returnObjects: true,
      defaultValue: [],
    });

    const activeCategory = categories.find(
      (item: any) => item.value === activeDesignTab
    );
    // console.log(data.categories);
    setDesignTabSlides(
      activeCategory?.sections
        .filter((item: any) => item.homepage !== false)
        .map((item: any) => {
          const handleClick = () => {
            router.push(`/templates/${item.value}`);
          };
          // when the tab changes, you need to set the slider scroll
          // to the beginning (left edge)
          designSwiperRef.current?.swiper.setProgress(0, 0);

          return (
            <SwiperSlide
              key={nanoid(5)}
              onClick={handleClick}
              className={s.swiperSlide}
            >
              <div className={s.img}>
                <Image
                  src={`/design${item.value}.png`}
                  layout="fill"
                  alt={item.name}
                />
              </div>
              {/* <img src={`/design${item.value}.jpg`} alt=""/> */}
              <span className={s.name}>{item.name}</span>
            </SwiperSlide>
          );
        })
    );
  }, [activeDesignTab, router, tCategoriesSections]);

  return userToken ? (
    <PageLayout userToken={userToken}>
      <Dashboard
        userToken={userToken}
        cookieUser={cookieUser}
        authorized={cookieUser.accessToken}
        local={t}
      />
    </PageLayout>
  ) : (
    <PageLayout userToken={null}>
      <Head>
        <title>{t("head.titleNotAuth")}</title>
        <meta name="description" content={t("head.metaDesc")} />
        {/* meta tags... */}
      </Head>
      <MainLayout
        userToken={userToken}
        cookieUser={cookieUser}
        authorized={cookieUser?.accessToken ? true : false}
      >
        <div className={s.hero}>
          <Container>
            <div className={s.content}>
              <h1 className={s.title}>{t("hero.title1")}</h1>
              <h2 className={s.subtitle}>{t("hero.subtitle")}</h2>
              <BtnPrimary
                onClick={() => {
                  dispatch(ToggleAuthModalAction(null));
                  dispatch(ChangeAuthFormAction("signUp"));
                }}
              >
                {t("hero.btn")}
              </BtnPrimary>
            </div>
            <div className={s.img}>
              <Image
                src={imgHero}
                layout="responsive"
                alt="block image"
                priority
              />
            </div>
          </Container>
        </div>
        {/* ./hero */}

        <section id="slider" className={s.design}>
          <ContainerFluid>
            <TabsUnstyled className={s.tabs} value={activeDesignTab}>
              <TabsListUnstyled className={s.tabsList}>
                {designTabs}
              </TabsListUnstyled>
              <TabPanelUnstyled value={activeDesignTab}>
                <Box sx={{ position: "relative" }} className={s.tagSwiper}>
                  <Swiper
                    // @ts-ignore
                    ref={designSwiperRef}
                    className={s.swiper}
                    modules={[Navigation]}
                    spaceBetween={15}
                    speed={200}
                    slidesPerView="auto"
                    navigation={{
                      prevEl: ".designPrevSlide",
                      nextEl: ".designNextSlide",
                      disabledClass: "disabled",
                    }}
                  >
                    {designTabSlides}
                  </Swiper>

                  <div
                    className={clsx(s.prevSlide, "prevSlide designPrevSlide")}
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
                    className={clsx(s.nextSlide, "nextSlide designNextSlide")}
                  >
                    <svg viewBox="0 0 6 10">
                      <path
                        d="M1.45222 0.644603L5.40234 4.59473L1.39462 8.60245"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </Box>
              </TabPanelUnstyled>
            </TabsUnstyled>
          </ContainerFluid>
        </section>
        {/* ./slider */}

        <section className={s.templates}>
          <ContainerFluid>
            <h2 className={s.title}>
              <span>{t("home.title")}</span>
            </h2>
            <div className={s.subtitle}>{t("home.subtitle")}</div>
          </ContainerFluid>

          <ContainerFluid>
            <Box sx={{ position: "relative" }} className={s.wrapper}>
              <Swiper
                className={s.swiper1}
                modules={[Controller, Navigation]}
                spaceBetween={15}
                speed={200}
                slidesPerView="auto"
                // @ts-ignore
                controller={{ control: secondSwiper, by: "container" }}
                // @ts-ignore
                onSwiper={setFirstSwiper}
                navigation={{
                  prevEl: ".templatesPrevSlide",
                  nextEl: ".templatesNextSlide",
                  disabledClass: "disabled",
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                  <SwiperSlide
                    key={i}
                    onClick={() => {
                      handleClickSliderTemplate(
                        templatesSliderLinks[i - 1].elem,
                        templatesSliderLinks[i - 1].categoryId
                      );
                    }}
                    className={s.swiperSlide}
                  >
                    <Image
                      src={`/templates/${i}.webp`}
                      layout="fill"
                      objectFit="cover"
                      alt="slider img"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              <Swiper
                className={s.swiper2}
                modules={[Controller, Navigation]}
                spaceBetween={15}
                speed={200}
                slidesPerView="auto"
                // @ts-ignore
                controller={{ control: secondSwiper, by: "container" }}
                // @ts-ignore
                onSwiper={() => {
                  setSecondSwiper;
                }}
              >
                {[11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((i) => (
                  <SwiperSlide
                    key={i}
                    onClick={() => {
                      handleClickSliderTemplate(
                        templatesSliderLinks[i - 1].elem,
                        templatesSliderLinks[i - 1].categoryId
                      );
                    }}
                    className={s.swiperSlide}
                  >
                    <Image
                      src={`/templates/${i}.webp`}
                      layout="fill"
                      objectFit="cover"
                      alt="slider img"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              <div
                className={clsx(s.prevSlide, "prevSlide templatesPrevSlide")}
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
                className={clsx(s.nextSlide, "nextSlide templatesNextSlide")}
              >
                <svg viewBox="0 0 6 10">
                  <path
                    d="M1.45222 0.644603L5.40234 4.59473L1.39462 8.60245"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </Box>

            <Box className={s.link}>
              <Link href="/templates" chevron>
                {t("home.allTemplates")}
              </Link>
            </Box>
          </ContainerFluid>
        </section>
        {/* ./templates */}

        <section className={s.about}>
          <Container>
            <div className={clsx(s.item, s.first)}>
              <div className={s.content}>
                <div className={s.title}>{t("about.firstTitle")}</div>
                <div className={s.subtitle}>{t("about.firstSubtitle")}</div>
                <div className={s.link}>
                  <Link href="/templates" chevron>
                    {t("about.link")}
                  </Link>
                </div>
              </div>
              <div className={s.imgFirst}>
                <Image
                  src={imgAbout1}
                  width={475}
                  height={268}
                  layout="responsive"
                  alt="block image"
                />
              </div>
            </div>

            <div className={clsx(s.item, s.second)}>
              <div className={s.imgSecond}>
                <Image
                  src={imgAbout2}
                  width={490}
                  height={284}
                  layout="responsive"
                  alt="block image"
                />
              </div>
              <div className={clsx(s.content, s.reverse)}>
                <div className={s.title}>{t("about.secondTitle")}</div>
                <div className={s.subtitle}>{t("about.secondSubtitle")}</div>
                <div className={s.link}>
                  <Link href="/templates" chevron>
                    {t("about.link")}
                  </Link>
                </div>
              </div>
            </div>
            <div className={clsx(s.item, s.third)}>
              <div className={s.content}>
                <div className={s.title}>{t("about.thirdTitle")}</div>
                <div className={s.subtitle}>{t("about.thirdSubtitle")}</div>
                <div className={s.link}>
                  <Link href="/templates" chevron>
                    {t("about.link")}
                  </Link>
                </div>
              </div>
              <div className={s.imgThird}>
                <Image
                  src={imgAbout3}
                  width={490}
                  height={318}
                  layout="responsive"
                  alt="block image"
                />
              </div>
            </div>
          </Container>
        </section>
        {/* ./about */}

        <section className={s.brandIdentity}>
          <BrandIdentity />
        </section>

        <StripeCTA
          onClickBtn={() => {
            dispatch(ToggleAuthModalAction(null));
            dispatch(ChangeAuthFormAction("signUp"));
          }}
          hasOval={true}
          local={t}
        />
      </MainLayout>
    </PageLayout>
  );
};

// @ts-ignore
export async function getServerSideProps({ req, res, locale, query }) {
  return {
    props: {
      ...(await serverSideTranslations(locale || req.cookies.locale || "en", [
        "common",
        "index",
        "categoriesSections",
        "AuthModal",
        "Checkout",
        "ContentBlocks",
        "design",
        "Dashboard",
      ])),
      cookieUser: !!req.cookies.user && (JSON.parse(req.cookies.user) || ""),
      userToken: !!req.cookies.user_token && (req.cookies.user_token || null),
    },
  };
}

export default Home;
