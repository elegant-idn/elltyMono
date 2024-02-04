import { ThemeProvider } from "@mui/material/styles";
import { appWithTranslation } from "next-i18next";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { CookiesProvider } from "react-cookie";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import "../styles/globals.scss";
import "../styles/normalize.scss";
import { theme } from "../theme";

import Script from "next/script";
import FbPixel from "../components/FbPixel";
import { FB_PIXEL_ID } from "../utils/fpixel";
import { useIsMac } from "../utils/useIsMac";
import GoogleAnalytics from "./../components/GoogleAnalytics";

const GTM_TRACKING_ID = "GTM-W4CJT92";

const isMacCallback = (isMac: boolean) => {
  if (isMac) {
    document.body.style.fontWeight = "300";
    document.documentElement.style.setProperty("--bold-text", "400");
    document.documentElement.style.setProperty("--extrabold-text", "500");
  } else {
    document.body.style.fontWeight = "400";
    document.documentElement.style.setProperty("--bold-text", "500");
    document.documentElement.style.setProperty("--extrabold-text", "600");
  }
};

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useIsMac(isMacCallback);

  React.useEffect(() => {
    router.asPath == "/design"
      ? document.querySelector("body")!.classList.add("overflowHidden")
      : document.querySelector("body")!.classList.remove("overflowHidden");
  }, [router]);

  return (
    <>
      <Head>
        {/* Common head tags for all pages. Specific tags are specified in the layouts of each page */}
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=5"
        />
        <meta
          name="keywords"
          content="Design software, Templates, Instagram post, Instagram Stories, Presentations, Print, Posters, Create design"
        />
        <meta
          name="description"
          content="Create professional brand marketing materials, social media templates, prints, documents and more without design skills."
        />
        <meta property="og:site_name" content="Ellty" />
        <meta property="og:url" content="https://www.ellty.com" />
        <meta property="og:type" content="Web Service" />
        <meta
          property="og:title"
          content="Ellty | Free Online Graphic Design Tool"
        />
        <meta property="og:image" content="/og/templates.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="/og/templates.png" />
      </Head>
      <Script id="gtm-start" strategy="lazyOnload">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_TRACKING_ID}');`}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
          alt="fb pixel"
        />
      </noscript>
      <noscript
        dangerouslySetInnerHTML={{
          __html: `<iframe src="https://www.googletagmanager.com/ns.html?id='${GTM_TRACKING_ID}'"
          height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
        }}
      ></noscript>
      <Provider store={store}>
        <CookiesProvider>
          <ThemeProvider theme={theme}>
            {/* <Script src="https://static.yoomoney.ru/checkout-js/v1/checkout.js" async></Script> */}
            <Component {...pageProps} />
            {/* <UnderMaintenancePage /> */}
            {process.env.NODE_ENV === "production" && (
              <>
                <GoogleAnalytics />
              </>
            )}
            <FbPixel />
          </ThemeProvider>
        </CookiesProvider>
      </Provider>
    </>
  );
}

export default appWithTranslation(MyApp);
