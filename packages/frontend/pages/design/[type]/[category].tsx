import type { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";

import { useCookies } from "react-cookie";
import AcceptCookie from "../../../components/AcceptCookie";
import AuthModal from "../../../components/AuthModal";
import CheckoutModal from "../../../components/CheckoutModal";
import { DownloadModal } from "../../../components/DownloadModal";
import PageLayout from "../../../components/Layouts/PageLayout";
import {
  ProElementModal,
  ProTemplateModal,
} from "../../../components/ProTemplateModal";
import RemainingDownloadsModal from "../../../components/RemainingDownloadsModal";

interface DesignProps {
  userToken: string;
}

const Polotno = dynamic(() => import("../../../components/Polotno"), {
  ssr: false,
});

const DesignPage: NextPage<DesignProps> = ({ userToken }) => {
  const { t: local }: any = useTranslation("index");
  const { t }: any = useTranslation("design");
  const i18n = t("head", { returnObjects: true });

  const [cookie, setCookie] = useCookies();
  const router = useRouter();

  return (
    <PageLayout userToken={userToken}>
      <Head>
        <title>{i18n.title}</title>
        {/* meta tags... */}
      </Head>

      <DownloadModal remainingDownloads={cookie.user?.remainingDownloads} />

      <RemainingDownloadsModal
        remainingDownloads={cookie.user?.remainingDownloads}
      />
      <ProTemplateModal />
      <ProElementModal />
      {/* <TryElltyProModal /> */}
      <AuthModal />
      <CheckoutModal userToken={userToken} />

      <AcceptCookie local={local} />
      <Polotno userToken={userToken} templateId={String(router.query.type)} />
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
        "design",
        "modalPro",
        "downloadModal",
        "replaceTemplate",
      ])),
      userToken: !!req.cookies.user_token && (req.cookies.user_token || null),
    },
  };
}

export default DesignPage;
