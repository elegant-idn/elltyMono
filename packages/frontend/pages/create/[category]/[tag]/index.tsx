import clsx from "clsx";
import { nanoid } from "nanoid";
import type {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  NextPage,
} from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Image from "next/image";
import NextLink from "next/link";
import { useRouter } from "next/router";
import createPagesData from "../../../../data/createPages";
import s from "../CreatePage.module.scss";

import BtnOutline from "../../../../components/BtnOutline";
import BtnPrimary from "../../../../components/BtnPrimary";
import Container from "../../../../components/Container";
import ContainerFluid from "../../../../components/ContainerFluid";
import BrandIdentity from "../../../../components/ContentBlocks/BrandIdentity";
import MainLayout from "../../../../components/Layouts/MainLayout";
import PageLayout from "../../../../components/Layouts/PageLayout";
import Link from "../../../../components/Link";
import { StripeCTA } from "../../../../components/StripeSections";
import { useClientSideCookie } from "../../../../utils/useClientSideCookie";
import { useEffect } from "react";
import { SetUser } from "../../../../redux/actions";
import { useDispatch } from "react-redux";
import { localeNSExists } from "../../../../utils/serverTranslationHelpers";

interface CreatePageProps {
  pageData: any;
  tagNs: string;
  languageSelector: boolean;
}

const CreatePage: NextPage<CreatePageProps> = ({
  pageData,
  tagNs,
  languageSelector,
}) => {
  const Router = useRouter();
  const {
    t,
    i18n: { language },
  }: any = useTranslation(tagNs);
  const { t: tCommon }: any = useTranslation(`create-page/common`);
  const { t: local }: any = useTranslation("index");
  const { t: tAppCommon } = useTranslation("common");
  const categories = tAppCommon("categories", { returnObjects: true }) as any[];
  const i18nCommon = tCommon("main", { returnObjects: true });
  const i18n = t("main", { returnObjects: true });

  const [cookie] = useClientSideCookie();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!cookie.user) return;

    dispatch(SetUser(cookie.user));
  }, [dispatch, cookie.user]);

  const tagElements = pageData.tagLinks.map((item: any) => {
    const categoryTranslation = categories.find(
      (category) => category.value === item.value
    );

    if (item?.excludeFromLocales?.includes(language)) return;

    const text = categoryTranslation?.text ?? item.value;

    return (
      <NextLink key={nanoid(5)} href={`/create/${item.href}`} passHref>
        <a className={s.tagItem}>{text}</a>
      </NextLink>
    );
  });

  const exploreElements = pageData.images.exploreSection.src.map(
    (item: any) => {
      return (
        <div key={nanoid(5)}>
          <Image
            src={`/create/${item}`}
            width={pageData.images.exploreSection.imageWidth}
            height={pageData.images.exploreSection.imageHeight}
            layout="responsive"
            alt="block image"
          />
        </div>
      );
    }
  );

  return (
    <PageLayout userToken={cookie.user_token}>
      <Head>
        <title>{i18n.head.title}</title>
        <meta name="description" content={i18n.head.metaDescription} />
      </Head>
      <MainLayout
        userToken={cookie.user_token}
        cookieUser={cookie.user}
        authorized={cookie.user?.accessToken ? true : false}
        languageSelector={languageSelector}
      >
        <section className={s.hero}>
          <Container>
            <div className={s.content}>
              <h1 className={s.title}>{i18n.heroSection.title}</h1>
              <h2 className={s.subtitle}>{i18n.heroSection.subtitle}</h2>
              <BtnPrimary
                onClick={() => {
                  // Router.push('/templates/facebook-cover')
                  // dispatch(ToggleAuthModalAction(null))
                  // dispatch(ChangeAuthFormAction('signUp'))
                }}
                // onClickRedirect={`/templates/${pageData.templatesPageLink}`}
                onClickRedirect={`/design?category_id=${pageData.categoryId}`}
              >
                {i18n.primaryBtn}
              </BtnPrimary>
            </div>
            <div className={s.img}>
              <Image
                src={`/create/${pageData.images.heroSection.src}`}
                width={pageData.images.heroSection.imageWidth}
                height={pageData.images.heroSection.imageHeight}
                layout="responsive"
                alt="block image"
                priority
              />
            </div>
          </Container>
        </section>
        {/* ./hero */}
        <section className={s.explore}>
          <ContainerFluid>
            <div className={s.title}>{i18n.exploreSection.title}</div>
            <div className={s.subtitle}>{i18n.exploreSection.subtitle}</div>

            <div
              className={clsx(
                s.grid,
                s[`grid${pageData.images.exploreSection.src.length}`]
              )}
            >
              {exploreElements}
            </div>

            <div className={s.link}>
              <Link href={`/templates/${pageData.templatesPageLink}`} chevron>
                {i18n.allTemplates}
              </Link>
            </div>
          </ContainerFluid>
        </section>
        {/* ./explore */}
        <section className={s.startDesign}>
          <Container>
            <div className={s.wrapper}>
              <div className={s.left}>
                <div className={s.title}>{i18n.designSection.title}</div>
                <div>
                  <div className={s.listTitle}>
                    {i18nCommon.designSection.blockTitle1}
                  </div>
                  <div className={s.listText}>
                    {i18n.designSection.blockSubtitle1}
                  </div>

                  <div className={s.listTitle}>
                    {i18nCommon.designSection.blockTitle2}
                  </div>
                  <div className={s.listText}>
                    {i18n.designSection.blockSubtitle2}
                  </div>

                  <div className={s.listTitle}>
                    {i18nCommon.designSection.blockTitle3}
                  </div>
                  <div className={s.listText}>
                    {i18n.designSection.blockSubtitle3}
                  </div>
                </div>
                <BtnOutline
                  variant="blue"
                  onClickRedirect={`/design?category_id=${pageData.categoryId}`}
                >
                  {i18n.designSection.btn}
                </BtnOutline>
              </div>
              <div className={s.right}>
                <div className={s.title}>{i18n.designSection.title}</div>
                <div className={s.img}>
                  <Image
                    src={`/create/${pageData.images.designSection.src}`}
                    width={pageData.images.designSection.imageWidth}
                    height={pageData.images.designSection.imageHeight}
                    layout="responsive"
                    alt="block image"
                  />
                </div>
              </div>
            </div>
          </Container>
        </section>
        {/* ./startDesign */}
        <section className={s.about}>
          <div className={s.wrapper}>
            <Container>
              <div className={clsx(s.item, s.first)}>
                <div className={s.imgFirst}>
                  <Image
                    src={`/create/${pageData.images.aboutSection.image1.src}`}
                    width={pageData.images.aboutSection.image1.imageWidth}
                    height={pageData.images.aboutSection.image1.imageHeight}
                    layout="responsive"
                    alt="block image"
                  />
                </div>
                <div className={clsx(s.content, s.reverse)}>
                  <div className={s.title}>{i18n.aboutSection.title1}</div>
                  <div className={s.subtitle}>
                    {i18n.aboutSection.subtitle1}
                  </div>
                  <div className={s.link}>
                    <Link
                      href={`/templates/${pageData.templatesPageLink}`}
                      chevron
                    >
                      {i18nCommon.createADesign}
                    </Link>
                  </div>
                </div>
              </div>

              <div className={clsx(s.item, s.second)}>
                <div className={clsx(s.content)}>
                  <div className={s.title}>{i18n.aboutSection.title2}</div>
                  <div className={s.subtitle}>
                    {i18n.aboutSection.subtitle2}
                  </div>
                  <div className={s.link}>
                    <Link
                      href={`/templates/${pageData.templatesPageLink}`}
                      chevron
                    >
                      {i18nCommon.createADesign}
                    </Link>
                  </div>
                </div>
                <div className={s.imgSecond}>
                  <Image
                    src={`/create/${pageData.images.aboutSection.image2.src}`}
                    width={pageData.images.aboutSection.image2.imageWidth}
                    height={pageData.images.aboutSection.image2.imageHeight}
                    layout="responsive"
                    alt="block image"
                  />
                </div>
              </div>

              <div className={clsx(s.item, s.third)}>
                <div className={s.imgThird}>
                  <Image
                    src={`/create/${pageData.images.aboutSection.image3.src}`}
                    width={pageData.images.aboutSection.image3.imageWidth}
                    height={pageData.images.aboutSection.image3.imageHeight}
                    layout="responsive"
                    alt="block image"
                  />
                </div>
                <div className={clsx(s.content, s.reverse)}>
                  <div className={s.title}>{i18n.aboutSection.title3}</div>
                  <div className={s.subtitle}>
                    {i18n.aboutSection.subtitle3}
                  </div>
                  <div className={s.link}>
                    <Link
                      href={`/templates/${pageData.templatesPageLink}`}
                      chevron
                    >
                      {i18nCommon.createADesign}
                    </Link>
                  </div>
                </div>
              </div>
            </Container>
          </div>
        </section>
        {/* ./about */}
        <section className={s.info}>
          <Container>
            <div className={s.wrapper}>
              <div className={s.infoItem}>
                <div className={s.title}>{i18n.infoSection.title1}</div>
                <div className={s.infoSubtitle}>
                  {i18n.infoSection.subtitle1}
                </div>
              </div>
              <div className={s.infoItem}>
                <div className={s.title}>{i18n.infoSection.title2}</div>
                <div className={s.infoSubtitle}>
                  {i18n.infoSection.subtitle2}
                </div>
              </div>
              <div className={s.infoItem}>
                <div className={s.title}>{i18n.infoSection.title3}</div>
                <div className={s.infoSubtitle}>
                  {i18n.infoSection.subtitle3}
                </div>
              </div>
            </div>
          </Container>
        </section>
        {/* ./info */}
        <section className={s.brand}>
          <BrandIdentity
            title={i18n.brandSection.title}
            subtitle={i18n.brandSection.subtitle}
          />
        </section>
        {/* ./brand */}
        <section className={s.tags}>
          <Container>
            <div className={s.title}>{i18nCommon.tagsSection.title}</div>
            <div className={s.tagsWrapper}>{tagElements}</div>
          </Container>
        </section>
        {/* ./tags */}
        <section className={s.stripe}>
          <StripeCTA
            onClickBtn={() => {
              // Router.push(`/templates/${pageData.templatesPageLink}`)
              Router.push(`/design?category_id=${pageData.categoryId}`);
            }}
            titleText={i18n.stripeSection.title}
            btnText={i18n.primaryBtn}
            hasOval={false}
            local={local}
          />
        </section>
        {/* ./stripe */}
      </MainLayout>
    </PageLayout>
  );
};

export async function getStaticPaths(ctx: GetStaticPathsContext) {
  const paths: GetStaticPathsResult["paths"] = [];

  createPagesData.createTagPages.forEach((data) => {
    ctx.locales?.forEach((locale) => {
      paths.push({
        params: { category: data.parent, tag: data.value },
        locale,
      });
    });
  });

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps(
  ctx: GetStaticPropsContext<{ category?: string; tag?: string }>
) {
  const locale = ctx.locale ?? "en";
  const tagQuery = createPagesData.createTagPages.find(
    (s) => s.parent == ctx.params?.category && s.value == ctx.params?.tag
  );

  // if the page is not found, page 404 is returned.
  if (!tagQuery) return { notFound: true };

  const tagNs = `create-page/tags/${tagQuery.parent}-${tagQuery.value}`;

  const pageTrans = await serverSideTranslations(
    locale,
    [tagNs],
    null,
    ctx.locales
  );

  if (!localeNSExists(pageTrans, locale, tagNs)) {
    return { notFound: true };
  }

  const languageSelector = localeNSExists(pageTrans, ctx.locales ?? [], tagNs);

  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "index",
        "AuthModal",
        "create-page/common",
        "ContentBlocks",
        tagNs,
      ])),
      pageData: tagQuery,
      tagNs,
      languageSelector,
    },
  };
}

export default CreatePage;
