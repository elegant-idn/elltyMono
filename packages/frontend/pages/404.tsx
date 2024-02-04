import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useDispatch } from "react-redux";
import BtnPrimary from "../components/BtnPrimary";
import BtnSecondary from "../components/BtnSecondary";
import ContainerFluid from "../components/ContainerFluid";
import MainLayout from "../components/Layouts/MainLayout";
import PageLayout from "../components/Layouts/PageLayout";

interface Custom404Props {
  // auth: string
}

const Custom404: NextPage<Custom404Props> = ({}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { t }: any = useTranslation("index");
  const Custom404Local = t("404Page", { returnObjects: true });

  const handleClickOpenDesign = () => {
    router.push("/design");
  };

  return (
    <PageLayout userToken={""}>
      <Head>
        {/* <title>{Custom404Local.headTitle}</title> */}
        <title>Ellty | Free Online Graphic Design Software</title>
      </Head>
      <MainLayout
        userToken={""}
        cookieUser={null}
        authorized={false}
        centerContent
      >
        <Box className="containerFluid">
          <ContainerFluid>
            <div className="wrapper">
              {/* <h3 className='title'>{Custom404Local.title}</h3> */}
              <h3 className="title">Oh no! Error 404</h3>
              {/* <p className='subtitle'>{Custom404Local.subTitle}</p> */}
              <p className="subtitle">
                The page you’re looking for is not available, go back, or still
                try to create a design and download for free.
              </p>
              <Stack
                gap="10px"
                justifyContent="center"
                sx={{
                  width: "100%",
                  flexDirection: "row",
                  button: {
                    width: "170px",
                  },
                  ["@media (max-width: 480px)"]: {
                    flexDirection: "column",
                    button: {
                      width: "100%",
                    },
                  },
                }}
              >
                {/* <BtnSecondary onClickRedirect='/'>{Custom404Local.link}</BtnSecondary> */}
                <BtnSecondary onClickRedirect="/">Go to Home</BtnSecondary>
                {/* <BtnPrimary onClick={handleClickOpenDesign}>{Custom404Local.btn}</BtnPrimary> */}
                <BtnPrimary onClick={handleClickOpenDesign}>
                  Create a design
                </BtnPrimary>
              </Stack>
            </div>
          </ContainerFluid>
        </Box>

        <style
          // eslint-disable-next-line
          jsx
        >{`
          .containerFluid {
            height: 100%;
          }

          .containerFluid > div {
            height: 100% !important;
          }

          .wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            height: 100%;
            max-width: 443px;
            text-align: center;
            margin: 0 auto;
          }

          .title {
            font-size: 2.25rem;
            line-height: 43px;
            font-weight: var(--bold-text);
            margin-bottom: 15px;
          }

          .subtitle {
            color: var(--gray-color);
            line-height: 21px;
            margin-bottom: 30px;
          }

          @media screen and (max-width: 1440px) {
            .wrapper {
              max-width: 382px;
            }

            .subtitle {
              font-size: 0.875rem;
              line-height: 18px;
            }
          }

          @media screen and (max-width: 768px) {
            .wrapper {
              margin: 64px auto;
            }
          }

          @media screen and (max-width: 480px) {
            .wrapper {
              max-width: 100%;
            }

            .subtitle {
              font-size: 1rem;
              line-height: 21px;
            }
          }

          @media screen and (max-width: 375px) {
            .wrapper {
              margin-top: 40px;
            }

            .title {
              margin-bottom: 16px;
            }

            .subtitle {
              font-size: 0.875rem;
              line-height: 18px;
              margin-bottom: 32px;
            }
          }
        `}</style>
      </MainLayout>
    </PageLayout>
  );
};

// @ts-ignore
export async function getStaticProps({ req, res }) {
  return {
    props: {
      ...(await serverSideTranslations("en", [
        "common",
        "index",
        "AuthModal",
        "Checkout",
      ])),
    },
  };
}

export default Custom404;
