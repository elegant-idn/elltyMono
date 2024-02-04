import type {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  NextPage,
} from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import featurePagesData from "../../../data/featurePages";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { FeatureHero } from "../../../components/Feature/Hero";
import MainLayout from "../../../components/Layouts/MainLayout";
import PageLayout from "../../../components/Layouts/PageLayout";
import { SetUser } from "../../../redux/actions";
import { localeNSExists } from "../../../utils/serverTranslationHelpers";
import { useClientSideCookie } from "../../../utils/useClientSideCookie";
import { FeatureTextIcons } from "../../../components/Feature/TextIcons";
import s from "./FeaturePage.module.scss";
import { FeatureTextPicture } from "../../../components/Feature/TextPicture";
import { FeatureHowTo } from "../../../components/Feature/HowTo";
import clsx from "clsx";
import { FeatureText } from "../../../components/Feature/Text";
import { FeatureTags } from "../../../components/Feature/Tags";
import BtnPrimary from "../../../components/BtnPrimary";

interface CreatePageProps {
  pageData: any;
  featurePageNs: string;
  languageSelector: boolean;
}

const CreatePage: NextPage<CreatePageProps> = ({
  pageData,
  featurePageNs,
  languageSelector,
}) => {
  const { t }: any = useTranslation(featurePageNs);

  const i18n = t("main", { returnObjects: true, fallbackLng: "en" });
  const dispatch = useDispatch();

  const [cookie] = useClientSideCookie();

  useEffect(() => {
    if (!cookie.user) return;

    dispatch(SetUser(cookie.user));
  }, [dispatch, cookie.user]);

  return (
    <PageLayout userToken={cookie.user_token}>
      <Head>
        <title>{i18n.meta.title}</title>
        <meta name="description" content={i18n.meta.description} />
      </Head>
      <MainLayout
        userToken={cookie.user_token}
        cookieUser={cookie.user}
        authorized={cookie.user?.accessToken ? true : false}
        languageSelector={languageSelector}
      >
        <div
          style={{
            background: pageData.gradient,
          }}
        >
          <div className={s.sectionContainer}>
            <FeatureHero translations={i18n} pageData={pageData} />
          </div>
        </div>
        <div className={s.sectionContainer}>
          <FeatureTextIcons translations={i18n} pageData={pageData} />
        </div>

        <div className={s.sectionContainer}>
          <FeatureTextPicture translations={i18n} pageData={pageData} />
        </div>

        <div className={s.howTo}>
          <div className={s.sectionContainer}>
            <FeatureHowTo translations={i18n} pageData={pageData} />
          </div>
        </div>

        <div className={s.sectionContainer}>
          <FeatureText translations={i18n} pageData={pageData} />
        </div>

        <div className={s.sectionContainer}>
          <FeatureTags translations={i18n} pageData={pageData} />
        </div>

        <div className={clsx(s.sectionContainer, s.CTASection)}>
          <BtnPrimary className={s.CTA} onClickRedirect="/design">
            {i18n.content.CTA}
          </BtnPrimary>
        </div>
      </MainLayout>
    </PageLayout>
  );
};

export async function getStaticPaths(ctx: GetStaticPathsContext) {
  const paths: GetStaticPathsResult["paths"] = [];

  featurePagesData.featurePages.forEach((data) => {
    ctx.locales?.forEach((locale) => {
      paths.push({
        params: { slug: data.slug },
        locale,
      });
    });
  });

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps(ctx: GetStaticPropsContext) {
  const featureQuery = featurePagesData.featurePages.find(
    (s) => s.slug == ctx.params?.slug
  );

  // if the page is not found, page 404 is returned.
  if (!featureQuery) return { notFound: true };

  const featurePageNs = `feature-page/${featureQuery.slug}`;

  const locale = ctx.locale ?? "en";
  const pageTrans = await serverSideTranslations(
    locale,
    [featurePageNs],
    null,
    ctx.locales
  );

  if (!localeNSExists(pageTrans, locale, featurePageNs)) {
    return { notFound: true };
  }

  const languageSelector = localeNSExists(
    pageTrans,
    ctx.locales ?? [],
    featurePageNs
  );

  return {
    props: {
      ...(await serverSideTranslations(
        ctx.locale ?? "en",
        [
          "common",
          "index",
          "AuthModal",
          "Checkout",
          featurePageNs,
          "feature-page/common",
          "ContentBlocks",
        ],
        {
          fallbackLng: "en",
          i18n: {
            defaultLocale: "en",
            locales: ["en", "de", "fr", "es", "ru", "pt"],
          },
        }
      )),
      featurePageNs,
      pageData: featureQuery,
      languageSelector,
    },
  };
}

export default CreatePage;
