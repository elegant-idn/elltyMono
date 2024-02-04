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
  const i18n = t("policy.socialMediaPage", { returnObjects: true });

  return (
    <PageLayout userToken={userToken}>
      <Head>
        <title>{i18n.headTitle}</title>
        <meta
          name="description"
          content="Our social media pages are available to the public and are openly available to all users of the relevant social media website."
        />
        {/* <meta name="robots" content="noindex, nofollow" /> */}
      </Head>
      <PolicyLayout
        userToken={userToken}
        cookieUser={cookieUser}
        authorized={cookieUser.accessToken ? true : false}
        title="Social Media Terms"
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
            path: "/policy/social-media-terms",
            title: "Social Media Terms",
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
            Our social media pages are available to the public and are openly
            available to all users of the relevant social media website. Our
            social media pages are those pages on social media websites
            including, but not limited to, Facebook, Twitter, Pinterest, Tiktok,
            GooglePlus, Instagram, YouTube, that are identified as being a web
            page associated with Ellty Social Media Pages. To avoid any
            confusion between a third party social media page and our own, a
            link to each Social Media Page that is associated with Ellty can be
            found on our website (our Website). We do not associate ourselves
            with, or provide any warranties as to the quality, content or
            legality of any social media page that is not linked to from our{" "}
            <a href="https://ellty.com/">Website</a>. In accessing and using our
            Social Media Pages, you must comply with any relevant terms and
            conditions associated with the relevant social media channels, as
            well as with these terms and conditions.
          </p>
          <h3>2. Content on Social Media Pages</h3>
          <p>
            Regardless of whether it was posted and/or uploaded by us or a third
            party, Ellty:
          </p>
          <p>
            1. Does not endorse any comments, advice, statements, visuals,
            audio, videos or other material (Content) posted to our Social Media
            Pages.
          </p>
          <p>
            2. Does not represent or warrant the accuracy of Content posted to
            our Social Media Pages.
          </p>
          <p>
            3. Will not be liable for any Content posted to our Social Media
            Pages.
          </p>
          <p>
            Whilst we may not monitor all Content that you post to our Social
            Media Pages, we expect that you will not post any Content that we
            may deem to:
          </p>
          <p>
            1) Be defamatory, abusive or hateful, intimidating, or misleading.
          </p>
          <p>2) Constitute junk mail or bullying.</p>
          <p>3) Infringe a third parties rights.</p>
          <p>4) Breach any other laws.</p>
          <p>
            In the event that you do post such material, we reserve the right to
            remove that material from our Social Media Pages immediately and
            without notice to you.
          </p>
          <p>
            We will also remove, without notice to you, any unapproved Content
            that is commercial in nature. Ellty is not responsible for any
            advertising material that may be displayed on our Social Media Pages
            by third parties.
          </p>
          <h3>3. Third Party Links</h3>
          <p>
            Ellty may, from time to time, provide hyperlinks to third party
            websites (Linked Websites). We do not control content posted on the
            Linked Websites, and we are therefore not responsible for any
            content found on them. We provide hyperlinks to Linked Websites for
            your convenience only, and do not endorse or approve any of the
            content found within Linked Websites. We do not take any
            responsibility or warrant the accuracy of any aspect of content or
            information provided on the Linked Websites.
          </p>
          <h3>4. Intellectual Property</h3>
          <p>
            By uploading Content to a Social Media Page, you grant Ellty a
            worldwide non-exclusive, sub-licensable, royalty-free licence to:
          </p>
          <p>
            1. Use, reproduce, distribute, display, publish and adapt any part
            or all of the Content.
          </p>
          <p>
            2. Publicly promote, endorse or market the Content in any way
            whatsoever, including via the Social Media Pages or otherwise.
          </p>
          <p>
            3. Perform or carry out any actions associated with achieving any of
            the above.
          </p>
          <p>
            Ellty may use the Content for any period of time beyond your removal
            of the Content from the Social Media Pages.
          </p>
          <h3>5. Privacy Policy</h3>
          <p>
            By agreeing to these Social Media Terms, you also agree to the terms
            of our Privacy Policy.
          </p>
          <h3>6. Miscellaneous</h3>
          <p>
            To the extent permitted by law, you agree to indemnify us from and
            against all actions, claims, suits, demands, damages, liabilities,
            costs or expenses (whether in tort or in contract including and
            without limitation, negligence) arising out of or in any way
            connected to the use of the Social Media Pages by you.
          </p>
          <p>
            We do not make any claims that the information or Content on the
            Social Media Pages is appropriate or may be downloaded in all areas,
            countries or jurisdictions. If you access any Social Media Pages,
            you do so at your own risk and you are responsible for compliance
            with the laws of your jurisdiction.
          </p>
          <h3>7. Contact us</h3>
          <p>
            Thank you for taking the time to observe our Social Media Terms.
            Please email us if you have any concerns about any Content on our
            Social Media Pages.
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
