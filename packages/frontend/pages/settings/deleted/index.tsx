import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Image from "next/image";
import NextLink from "next/link";
import BtnPrimary from "../../../components/BtnPrimary";
import PageLayout from "../../../components/Layouts/PageLayout";
import hero from "../../../public/hero/hero.png";
import s from "./AccountDeleted.module.scss";
interface DeletedAccountProps {
  cookieUser: any;
  userToken: string;
}

const DeletedAccount: NextPage<DeletedAccountProps> = ({
  cookieUser,
  userToken,
}) => {
  const { t: local }: any = useTranslation("index");
  const { t }: any = useTranslation("AccountSetings");
  const restoreInfo = t("deletedAccount", { returnObjects: true });

  return (
    <PageLayout userToken={userToken}>
      <Head>
        <title>{t("headTitle")}</title>
      </Head>
      <div className={s.root}>
        <div className={s.photo}>
          <div className={s.photoWrappper}>
            <Image src={hero} alt="hero image" />
          </div>
        </div>
        <div className={s.restoration}>
          <div className={s.wrapper}>
            <label>{restoreInfo.title}</label>
            <p>{restoreInfo.text}</p>
            <NextLink href="/">
              <BtnPrimary>{restoreInfo.btn}</BtnPrimary>
            </NextLink>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

// @ts-ignore
export async function getServerSideProps({ req, res, locale }) {
  const cookieUser = !!req.cookies.user && (JSON.parse(req.cookies.user) || "");

  if (!cookieUser) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      ...(await serverSideTranslations(locale || req.cookies.locale || "en", [
        "common",
        "index",
        "AuthModal",
        "Checkout",
        "AccountSetings",
      ])),
      cookieUser: !!req.cookies.user && (JSON.parse(req.cookies.user) || ""),
      userToken: !!req.cookies.user_token && (req.cookies.user_token || null),
    },
  };
}

export default DeletedAccount;
