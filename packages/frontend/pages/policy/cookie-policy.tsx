import Head from "next/head";
import type { NextPage } from "next";
import s from "../../styles/Policy.module.scss";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import PolicyLayout from "../../components/Layouts/PolicyLayout";
import Link from "../../components/Link";
import PageLayout from "../../components/Layouts/PageLayout";

interface PolicyProps {
  cookieUser: any;
  userToken: string;
}

const PrivacyPolicy: NextPage<PolicyProps> = ({ cookieUser, userToken }) => {
  const { t }: any = useTranslation("index");
  const i18n = t("policy.cookiePolicyPage", { returnObjects: true });

  return (
    <PageLayout userToken={userToken}>
      <Head>
        <title>{i18n.headTitle}</title>
        <meta
          name="description"
          content="Cookies are small pieces of information that are temporarily stored on your computer  when you visit a website."
        />
        {/* <meta name="robots" content="noindex, nofollow" /> */}
      </Head>
      <PolicyLayout
        userToken={userToken}
        cookieUser={cookieUser}
        authorized={cookieUser.accessToken ? true : false}
        title="Cookie Policy"
        routes={[
          {
            path: "/",
            title: "Home",
          },
          {
            path: "/policy/",
            title: "Policies and Terms",
          },
          {
            path: "/policy/cookie-policy",
            title: "Cookie Policy",
          },
        ]}
      >
        <div className={s.content}>
          <div className={s.date}>
            <div className={s.dateTitle}>Effective Date:</div>
            <div className={s.dateText}>November 10, 2021</div>
          </div>

          <h3>1. Introduction</h3>
          <p>
            This website uses cookies to enhance your experience and to help us
            improve the site. In this Cookie Policy any reference to we, us and
            our is a reference to TASKINA PTY LTD, ABN 63639538891.
          </p>
          <h3>2. What are cookies?</h3>
          <p>
            Cookies are small pieces of information that are temporarily stored
            on your computer (or other internet enabled devices) when you visit
            a website. Cookies usually contain the name of the website from
            which the cookie has come from and the lifetime of the cookie (i.e.
            how long it will remain on your device).
          </p>
          <h3>3. How are Cookies used on this website?</h3>
          <p>
            We use cookies to collect aggregated information about us of our
            website. We may also use cookies to remember your preferences,
            tailor content, improve your experience in dealing with our website
            and to observe your behaviour.
          </p>
          <h3>4. Which Cookies does this website use?</h3>
          <p>
            The following info sets out the cookies used by our website, as well
            as their purpose:
          </p>
          <ul>
            <li>
              <Link href="http://www.google.com/intl/en/policies/privacy/">
                Google Analytics
              </Link>
            </li>
            <li>
              <Link href="http://www.facebook.com/about/privacy">Facebook</Link>
            </li>
          </ul>
          <h3>5. How long do cookies stay on my device?</h3>
          <p>
            Persistent cookies – these cookies will allow our website to
            recognise you when you return to our website at a later date. This
            provides us with useful analytics, which assist us to optimise our
            website and your visits. <br />
            Session cookies – these cookies exist only for the life of your
            current visit, whilst you have your web browser open. They’re not
            stored on your computer and are deleted, when you exit your web
            browser.{" "}
          </p>
          <h3>6. How can you control the use of Cookies by this website?</h3>
          <p>
            Your Internet browser should have settings, which allow you to
            control the placement of cookies on your computer or device. You can
            change the settings to allow or block the storage of cookies.
            Alternatively, you can adjust your browser settings to provide
            alerts when a cookie is being sent for storage on your computer or
            device. Please refer to your Internet browsers manual or help
            function for more information on adjusting the settings of your
            specific browser. Alternately, you may click on the links provided
            above in the Privacy Choices section of the table.
          </p>

          <div className={s.link}>
            <Link href="/policy" chevron>
              Back to Policies and Terms
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

export default PrivacyPolicy;
