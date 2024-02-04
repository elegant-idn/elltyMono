import type { NextPage } from "next";
import s from "../../styles/Policy.module.scss";
import PolicyLayout from "../../components/Layouts/PolicyLayout";
import Link from "../../components/Link";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import PageLayout from "../../components/Layouts/PageLayout";
import Head from "next/head";

interface PolicyProps {
  cookieUser: any;
  userToken: string;
}

const Policy: NextPage<PolicyProps> = ({ cookieUser, userToken }) => {
  const { t }: any = useTranslation("index");
  const i18n = t("policy", { returnObjects: true });

  return (
    <PageLayout userToken={userToken}>
      <Head>
        <title>{i18n.headTitle}</title>
        <meta
          name="description"
          content="Protecting your privacy is important to us. Accordingly, we’re providing this Privacy Policy to explain our practices regarding the collection."
        />
      </Head>
      <PolicyLayout
        userToken={userToken}
        cookieUser={cookieUser}
        authorized={cookieUser.accessToken ? true : false}
        title="Policy Table of Contents"
        routes={[
          {
            path: "/",
            title: "Home",
          },
          {
            path: "/policy/",
            title: "Policies and Terms",
          },
        ]}
      >
        <div className={s.content}>
          <h3>Privacy Policy</h3>
          <p>
            Protecting your privacy is important to us. Accordingly, we’re
            providing this Privacy Policy to explain our practices regarding the
            collection, use and disclosure of information that we receive when
            you use our Services (as defined in our Terms of Service). This
            Privacy Policy applies only to those websites, services and
            applications included within “Services” and doesn’t apply to any
            third-party websites, services or applications, even if they are
            accessible through our Services. Also, please note that, unless we
            define a term in this Privacy Policy, all capitalized words used in
            this Privacy Policy have the same meanings as in our Terms of
            Service.
          </p>
          <div className={s.linkText}>
            <Link href="/policy/privacy-policy" chevron>
              Read more
            </Link>
          </div>

          <h3>Terms of Use</h3>
          <p>
            Welcome to the Ellty website (www.ellty.com) (the “Site”). Please
            read these Terms of Service (the “Terms”) carefully because they
            govern your use of our Site and our design tool services accessible
            via our Site. To make these Terms easier to read, the Site and our
            services are collectively called the “Services.”
          </p>
          <div className={s.linkText}>
            <Link href="/policy/terms-of-use" chevron>
              Read more
            </Link>
          </div>

          <h3>Cookies Policy</h3>
          <p>
            Cookies are small pieces of information that are temporarily stored
            on your computer (or other internet enabled devices) when you visit
            a website. Cookies usually contain the name of the website from
            which the cookie has come from and the lifetime of the cookie (i.e.
            how long it will remain on your device).
          </p>
          <div className={s.linkText}>
            <Link href="/policy/cookie-policy" chevron>
              Read more
            </Link>
          </div>

          <h3>Social Media Terms</h3>
          <p>
            Our social media pages are available to the public and are openly
            available to all users of the relevant social media website. Our
            social media pages are those pages on social media websites
            including, but not limited to, Facebook, Twitter, Pinterest, Tiktok,
            GooglePlus, Instagram, YouTube, that are identified as being a web
            page associated with Ellty Social Media Pages.
          </p>
          <div className={s.linkText}>
            <Link href="/policy/social-media-terms" chevron>
              Read more
            </Link>
          </div>

          <h3>GDPR</h3>
          <p>
            We recognise that you have an interest in our collection and use of
            your personal information via our website, which is located at our
            website. We have implemented this Privacy Policy in order to be open
            and transparent about how we collect, hold, and use your personal
            information, and under what circumstances we may disclose or
            transfer your personal information. This Privacy Policy also
            outlines your rights under the General Data Protection Regulation
            (GDPR).
          </p>
          <div className={s.linkText}>
            <Link href="/policy/gdpr" chevron>
              Read more
            </Link>
          </div>
        </div>
      </PolicyLayout>
    </PageLayout>
  );
};

// @ts-ignore
export async function getServerSideProps({ req, res, locale, resolvedUrl }) {
  const fullLocale = locale || req.cookies.locale || "en";

  const redirect =
    fullLocale === "en"
      ? undefined
      : { destination: resolvedUrl, permanent: false };

  return {
    redirect,
    props: {
      ...(await serverSideTranslations(fullLocale, [
        "common",
        "index",
        "AuthModal",
        "Checkout",
      ])),
      cookieUser: !!req.cookies.user && (JSON.parse(req.cookies.user) || ""),
      userToken: !!req.cookies.user_token && (req.cookies.user_token || null),
    },
  };
}

export default Policy;
