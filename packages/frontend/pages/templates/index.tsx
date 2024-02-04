import type { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";
import { Api } from "../../api";

import PageLayout from "../../components/Layouts/PageLayout";
import TemplatesLayout, {
  ELEMENTS_ON_TEMPLATES_LAYOUT,
} from "../../components/Layouts/TemplatesLayout";

interface TemplatesProps {
  cookieUser: any;
  userToken: string;
  templates: any[];
  // pageData: any,
}

const Templates: NextPage<TemplatesProps> = ({
  cookieUser,
  userToken,
  templates,
}) => {
  const { t }: any = useTranslation("index");
  const mainTemplatesLocal = t("templatesPage", { returnObjects: true });

  return (
    <PageLayout userToken={userToken}>
      <Head>
        <title>{mainTemplatesLocal.defaultCategory.headTitle}</title>
        <meta
          name="description"
          content={mainTemplatesLocal.defaultCategory.meta.description}
        />
        <meta property="og:description" content="Description of this page" />
        <meta property="og:image" content="/og/templates.png" />
      </Head>
      <TemplatesLayout
        userToken={userToken}
        cookieUser={cookieUser}
        authorized={cookieUser?.accessToken ? true : false}
        pageData={mainTemplatesLocal.defaultCategory}
        local={t}
        templates={templates}
        blankItem={false}
      />
    </PageLayout>
  );
};

// @ts-ignore
export async function getServerSideProps({ req, res, locale }) {
  // const pageData = {
  //   title: 'Customizable Templates | Ellty',
  //   meta: {
  //     description: 'Customize your design with Ellty, the powerful drag and drop tool. Create beautiful design to promote your brand.'
  //   },
  //   path: '/templates',
  //   name: 'All Templates',
  //   text: 'Choose an eye-catching templates or create your own with powerful design tools to grab attention on your brand, product, social media and more.',
  //   src: '/templates/hero.png',
  //   imgClassName: 'imgInstagramPost',
  //   width: 1000,
  //   height: 1000,
  //   stripeBottom: {
  //     title: "Ellty's Customizable Design Templates",
  //     text: [
  //       'Get ready to design with joy because your future awaits with the help of customizable design templates.',
  //       'Designing is a complex process, and only the most seasoned professionals can hope to understand it. Fortunately, you have visited Ellty, which has plenty of design resources that can make your job a lot easier. From icon sets to color palettes, there are design resources that can help you create a seamless look that fits your brand. Ellty is the perfect place to find beautiful, customize-able templates for any occasion. With a drag and drop interface, you can create beautiful designs in minutes.',
  //       'Ellty is a platform that provides you with a library of customizable design templates. This means that you will not have to search for the perfect template for your next project. You can simply browse through the template option and select one that suits your needs. The simple interface makes it easy to find and choose a suitable template. Whether you are looking for an icon set, website background, or an image pack, Ellty has it all. You can also use the filters provided to find precisely what you need in no time.',
  //       'When designing templates, there’s a simple and easy process that you can follow. With Ellty, you simply drag and drop designs onto your page. From there, you can customize them according to your choice and need. There are tons of options available, so you can find the perfect design for your business. You can also change the colors and fonts of your designs, which will give your website a more professional look. Ellty offers an extensive range of features to help you with your marketing efforts as an added bonus.'
  //     ],
  //   }
  // }
  const commonRequestParams = {
    page: 1,
  };

  let templates: undefined | any[] = undefined;

  const cookieLocale = req.cookies.locale;

  const langResult = await Api.get("/templates", {
    params: {
      ...commonRequestParams,
      amount: ELEMENTS_ON_TEMPLATES_LAYOUT,
      language: cookieLocale,
    },
  });

  templates = [];

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

  return {
    props: {
      ...(await serverSideTranslations(locale || req.cookies.locale || "en", [
        "common",
        "index",
        "AuthModal",
        "Checkout",
        "modalPro",
        "categoriesSections",
      ])),
      templates,
      cookieUser: !!req.cookies.user && (JSON.parse(req.cookies.user) || ""),
      userToken: !!req.cookies.user_token && (req.cookies.user_token || null),
    },
  };
}

export default Templates;
