import React from "react";
import Script from "next/script";
import { useRouter } from "next/router";

const GA_TRACKING_ID = "G-6DD6HX0909";

const GoogleAnalytics = () => {
  const router = useRouter();

  React.useEffect(() => {
    const handleRouteChange = (url: any) => {
      // @ts-ignore
      window.gtag("config", GA_TRACKING_ID, { page_path: url });
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            window.gtag = function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              send_page_view: false,
              send_scroll: false
            });
            gtag('config', 'AW-10854775011');
          `,
        }}
      />
    </>
  );
};

// page_path: window.location.pathname,

export default GoogleAnalytics;
