import type { GetServerSidePropsContext, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { Api } from "../../../api";

import Head from "next/head";
import PageLayout from "../../../components/Layouts/PageLayout";
import TemplatesLayout, {
  ELEMENTS_ON_TEMPLATES_LAYOUT,
} from "../../../components/Layouts/TemplatesLayout";
import data from "../../../data/main";
import templateTagsData from "../../../data/templateTags";
import { localeNSExists } from "../../../utils/serverTranslationHelpers";

interface TemplatesProps {
  cookieUser: any;
  userToken: string;
  section: any;
  categories: any[];
  templates: any[];
  templatePageNs: string | null;
  tag: string;
  // pageData: any
}

const Templates: NextPage<TemplatesProps> = ({
  cookieUser,
  userToken,
  categories,
  templates,
  templatePageNs,
  tag,
}) => {
  const router = useRouter();
  const [category, setCategory] = React.useState({
    _id: "",
    value: "Popular",
    url: "",
  });
  const { t }: any = useTranslation("index");
  const { t: tCategory } = useTranslation(templatePageNs ?? "");
  const categoryData = templatePageNs
    ? tCategory("data", { returnObjects: true })
    : null;
  const mainTemplatesLocal = t("templatesPage", { returnObjects: true });

  // information about categories is stored separately both in the
  // data.categories file and in the database
  const routeTitle = useMemo(() => {
    for (let i = 0; i < data.categories.length; i++) {
      const title = data.categories[i].sections.find(
        (s) => s.value === `/${router.query.id}`
      );

      if (title) return title;
    }
  }, [router.query.id]);

  React.useEffect(() => {
    // if routeTitle is undefined, it means that this is not a category page,
    // but a page with an open template modal window.
    // In this case, the default category "all templates" is set
    // if(!routeTitle && !firstRenderRef.current) return;
    if (!routeTitle) return;

    const category = categories.find((s: any) => s.value == routeTitle.name);

    setCategory({
      _id: category._id,
      value: category.value,
      url: routeTitle.value,
    });
  }, [router.query.id, categories, routeTitle]);

  const { isModal, translatedData } = useMemo(() => {
    if (categoryData) {
      return {
        isModal: false,
        translatedData: categoryData,
      };
    }

    return {
      isModal: true,
      translatedData: mainTemplatesLocal.defaultCategory,
    };
  }, [categoryData, mainTemplatesLocal.defaultCategory]);

  return (
    <PageLayout userToken={userToken}>
      <Head>
        <meta property="og:description" content="Description of this page" />
        <meta property="og:image" content="/og/templates.png" />
        {!isModal ? (
          <>
            <title>{translatedData.HeadTitle}</title>
            <meta
              name="description"
              content={translatedData?.meta?.description}
            />
          </>
        ) : (
          <>
            <title>{mainTemplatesLocal.defaultCategory.headTitle}</title>
            <meta
              name="description"
              content={mainTemplatesLocal.defaultCategory.meta.description}
            />
          </>
        )}
      </Head>
      <TemplatesLayout
        userToken={userToken}
        cookieUser={cookieUser}
        authorized={cookieUser?.accessToken ? true : false}
        templateCategory={category}
        tag={tag}
        pageData={translatedData}
        withCategory
        templates={templates}
        local={t}
      />
    </PageLayout>
  );
};

// @ts-ignore
export async function getServerSideProps({
  params,
  req,
  locale: reqLocale,
}: GetServerSidePropsContext) {
  const locale = reqLocale || req.cookies.locale || "en";

  let routeMeta: any;
  for (let i = 0; i < data.categories.length; i++) {
    routeMeta = data.categories[i].sections.find(
      (s) => s.value === `/${params?.id}`
    );
    if (routeMeta) break;
  }

  if (!routeMeta) return { notFound: true };

  const templateTags = (templateTagsData.categoryValueToTagValue as any)[
    routeMeta.value
  ];

  if (!templateTags?.includes(params?.tag)) return { notFound: true };

  // url already starts with /
  const templatePageNs =
    routeMeta.value && params?.tag
      ? `template-page/tags${routeMeta.value}-${params.tag}`
      : null;

  if (!templatePageNs) return { notFound: true };

  const templatePageTrans = await serverSideTranslations(
    locale,
    [templatePageNs],
    null
  );

  if (!localeNSExists(templatePageTrans, locale, templatePageNs)) {
    return { notFound: true };
  }

  const categoriesResult = await Api.get("/categories");

  const tagConfig = (templateTagsData.tagConfig as any)[params?.tag as string];

  if (!tagConfig?.locales.includes(locale)) return { notFound: true };

  const tagResult = await Api.get(`/tags/single/${tagConfig?.name}`);

  if (!tagResult.data) return { notFound: true };

  const selectedCategory = categoriesResult
    ? {
        ...categoriesResult.data.find((s: any) => s.value == routeMeta.name),
        url: routeMeta.value,
      }
    : null;

  const commonRequestParams: any = {
    page: 1,
    tags: [tagResult.data._id],
  };

  if (selectedCategory) {
    commonRequestParams.categories = selectedCategory?._id;
  }

  const templates: any[] = [];
  const cookieLocale = req.cookies.locale;

  const langResult = await Api.get("/templates", {
    params: {
      ...commonRequestParams,
      amount: ELEMENTS_ON_TEMPLATES_LAYOUT,
      language: cookieLocale,
    },
  });

  templates.push(...langResult.data.templates);

  const neededAmountAfterLang = ELEMENTS_ON_TEMPLATES_LAYOUT - templates.length;

  if (neededAmountAfterLang > 0 && cookieLocale !== "en") {
    const enResult = await Api.get("/templates", {
      params: {
        ...commonRequestParams,
        amount: neededAmountAfterLang,
        language: "en",
        page: 1,
      },
    });

    templates.push(...enResult.data.templates);
  }

  const neededAmountAfterEn = ELEMENTS_ON_TEMPLATES_LAYOUT - templates.length;

  if (neededAmountAfterEn > 0) {
    const result = await Api.get("/templates", {
      params: {
        ...commonRequestParams,
        amount: neededAmountAfterLang,
        "language[nin]": [cookieLocale, "en"],
        page: 1,
      },
    });
    templates.push(...result.data.templates);
  }

  const translationsToLoad = [
    "common",
    "index",
    "AuthModal",
    "Checkout",
    "categoriesSections",
    "modalPro",
    "tags",
    templatePageNs,
  ];

  return {
    props: {
      ...(await serverSideTranslations(locale, translationsToLoad)),
      templates,
      categories: categoriesResult?.data,
      selectedCategory,
      templatePageNs,
      cookieUser: !!req.cookies.user && (JSON.parse(req.cookies.user) || ""),
      userToken: !!req.cookies.user_token && (req.cookies.user_token || null),
      tag: params?.tag,
      // pageData: pageData
    },
  };
}

export default Templates;
