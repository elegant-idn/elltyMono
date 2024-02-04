import { nanoid } from "nanoid";
import type { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Router from "next/router";
import s from "./ContactPage.module.scss";

import Box from "@mui/material/Box";
import Accordion from "../../components/Accordion";
import MainLayout from "../../components/Layouts/MainLayout";
import PageLayout from "../../components/Layouts/PageLayout";
import { StripeCTA } from "../../components/StripeSections";

interface ContactProps {
  cookieUser: any;
  userToken: string;
}

const Contact: NextPage<ContactProps> = ({ cookieUser, userToken }) => {
  const { t }: any = useTranslation("index");
  const contactLocal = t("contactPage", { returnObjects: true });
  const accordionLocal = t("accordionData", { returnObjects: true });
  //@ts-ignore
  const accordions = accordionLocal.map((item: any) => {
    return (
      <Accordion key={nanoid(5)} title={item.title} content={item.content} />
    );
  });

  return (
    <PageLayout userToken={userToken}>
      <Head>
        <title>{contactLocal.headTitle}</title>
        <meta name="description" content={contactLocal.meta.description} />
      </Head>
      <MainLayout
        userToken={userToken}
        cookieUser={cookieUser}
        authorized={cookieUser.accessToken ? true : false}
      >
        <div className={s.contactContainer}>
          <div className={s.wrapper}>
            <Box className={s.content}>
              <div>
                <h1 className={s.title}>{contactLocal.title}</h1>
                <h2 className={s.text}>{contactLocal.subtitle}</h2>
              </div>

              <div>
                <div className={s.subtitle}>{contactLocal.details.title}</div>
                <div className={s.address}>
                  <div className={s.addressItem}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.30684 19.8943V17.1342C9.30682 16.4322 9.90927 15.8617 10.6557 15.857H13.3899C14.1399 15.857 14.7478 16.4288 14.7478 17.1342V19.9028C14.7477 20.4989 15.2535 20.986 15.8871 21H17.7099C19.527 21 21 19.6146 21 17.9056V10.0541C20.9903 9.38174 20.6547 8.75041 20.0886 8.33973L13.8547 3.61677C12.7626 2.79441 11.2101 2.79441 10.118 3.61677L3.91139 8.3483C3.34319 8.75732 3.007 9.3897 3 10.0626V17.9056C3 19.6146 4.47304 21 6.29013 21H8.11291C8.76223 21 9.28861 20.5049 9.28861 19.8943"
                        stroke="#36373C"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {contactLocal.details.name}
                  </div>
                  <div className={s.addressItem}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M5.07129 10.5188V10.5305C5.13856 12.4124 5.78957 14.2269 6.93426 15.7225L6.93905 15.7288C8.27985 17.5193 9.92523 19.06 11.8 20.2802C11.8285 20.2988 11.8558 20.3193 11.8815 20.3416C11.9493 20.4002 12.0498 20.4002 12.1176 20.3416C12.144 20.3187 12.1721 20.2977 12.2015 20.2787C13.4591 19.4668 14.6187 18.5123 15.6572 17.4343C17.4802 15.5097 18.8782 13.1363 18.9279 10.6493V10.5697L18.9279 10.5671C18.9408 6.74075 15.8495 3.62832 12.0231 3.61528C8.19711 3.60232 5.08496 6.693 5.07129 10.5188ZM3.57129 10.5149C3.58711 5.86015 7.37339 2.09952 12.0282 2.11528C16.6826 2.13115 20.443 5.9168 20.4279 10.5711V10.6566L20.4277 10.6708C20.3705 13.6934 18.6921 16.4122 16.744 18.4682L16.7398 18.4725C15.631 19.6239 14.3941 20.6444 13.0531 21.5142C12.4381 22.0096 11.5594 22.0093 10.9447 21.5132C8.93892 20.2015 7.17772 18.5493 5.7407 16.6311C4.40535 14.885 3.64721 12.7662 3.57173 10.5693C3.57144 10.5608 3.57129 10.5522 3.57129 10.5436L3.57129 10.5149Z"
                        fill="#36373C"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M11.9992 8.95419C11.0542 8.95419 10.2882 9.72023 10.2882 10.6652C10.2882 11.6102 11.0542 12.3762 11.9992 12.3762C12.9441 12.3762 13.7102 11.6102 13.7102 10.6652C13.7102 9.72023 12.9441 8.95419 11.9992 8.95419ZM8.78816 10.6652C8.78816 8.89181 10.2258 7.45419 11.9992 7.45419C13.7725 7.45419 15.2102 8.89181 15.2102 10.6652C15.2102 12.4386 13.7725 13.8762 11.9992 13.8762C10.2258 13.8762 8.78816 12.4386 8.78816 10.6652Z"
                        fill="#36373C"
                      />
                    </svg>
                    {contactLocal.details.address}
                  </div>
                  <div className={s.addressItem}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M5.75286 8.53462C6.01128 8.21091 6.48319 8.15797 6.80691 8.41639L11.1062 11.8484C11.6403 12.2655 12.3864 12.2658 12.9209 11.8493L17.1821 8.41835C17.5048 8.15858 17.9769 8.20955 18.2367 8.53218C18.4965 8.85482 18.4455 9.32695 18.1228 9.58672L13.8498 13.0271C12.7709 13.873 11.2572 13.8729 10.1783 13.027L10.1731 13.023L5.87109 9.58867C5.54737 9.33025 5.49444 8.85834 5.75286 8.53462Z"
                        fill="#36373C"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M7.27264 4.19141C4.84383 4.19141 3.13477 6.14975 3.13477 8.73552V15.2634C3.13477 17.8492 4.84383 19.8075 7.27264 19.8075H16.6962C17.8475 19.7935 18.9441 19.3063 19.7307 18.4575C20.5184 17.6075 20.9263 16.4692 20.858 15.3074C20.8572 15.2927 20.8567 15.2781 20.8567 15.2634V8.73552C20.8567 8.72085 20.8572 8.70618 20.858 8.69154C20.9263 7.52976 20.5184 6.39138 19.7307 5.5414C18.9441 4.69259 17.8475 4.20543 16.6962 4.19141H7.27264ZM1.63477 8.73552C1.63477 5.48396 3.86163 2.69141 7.27264 2.69141H16.709C18.275 2.70897 19.7645 3.37107 20.8309 4.52182C21.892 5.66683 22.4423 7.19624 22.3567 8.75677V15.2422C22.4423 16.8027 21.892 18.3321 20.8309 19.4771C19.7645 20.6279 18.275 21.2899 16.709 21.3075L16.7006 21.3076L7.27264 21.3075C3.86163 21.3075 1.63477 18.515 1.63477 15.2634V8.73552Z"
                        fill="#36373C"
                      />
                    </svg>
                    <a
                      href="https://help.ellty.com/hc/en-us"
                      className={s.linkMailto}
                    >
                      {contactLocal.details.email}
                    </a>
                  </div>
                </div>
                <div className={s.subtitle}>{contactLocal.socials}</div>
                <div className={s.socials}>
                  <a
                    href="https://www.instagram.com/elltycom/"
                    className={s.socialItem}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <svg className={s.inst}>
                      <use href="#inst" />
                    </svg>
                  </a>
                  <a
                    href="https://www.facebook.com/elltycom/"
                    className={s.socialItem}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <svg className={s.fb}>
                      <use href="#fb" />
                    </svg>
                  </a>
                  <a
                    href="https://twitter.com/elltycom"
                    className={s.socialItem}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <svg className={s.twitter}>
                      <use href="#twitter" />
                    </svg>
                  </a>
                  <a
                    href="https://www.pinterest.com/elltycom/"
                    className={s.socialItem}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <svg className={s.pinterest}>
                      <use href="#pinterest" />
                    </svg>
                  </a>
                </div>
              </div>
            </Box>
            <Box className={s.accordionsWrapper}>{accordions}</Box>
          </div>
        </div>

        <StripeCTA
          onClickBtn={() => {
            Router.push("/templates");
          }}
          hasOval={true}
          local={t}
        />
      </MainLayout>
    </PageLayout>
  );
};

// @ts-ignore
export async function getServerSideProps({ req, res, locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale || req.cookies.locale || "en", [
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

export default Contact;
