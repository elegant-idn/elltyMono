import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <>
        <Html>
          <Head>
            {/* <meta httpEquiv="Content-Security-Policy" content="default-src 'self';" /> */}
            {/* <title>Ellty</title> */}
            {/* <link rel="icon" type="image/png" href="/fav.png" /> */}
            <link
              href="https://unpkg.com/@blueprintjs/icons@4/lib/css/blueprint-icons.css"
              rel="stylesheet"
            />
            <link
              href="https://unpkg.com/@blueprintjs/core@4/lib/css/blueprint.css"
              rel="stylesheet"
            />
            <link
              href="https://unpkg.com/@blueprintjs/popover2@1/lib/css/blueprint-popover2.css"
              rel="stylesheet"
            />
            <link
              href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&display=swap"
              rel="stylesheet"
            />
            <link rel="preconnect" href="https://www.googletagmanager.com" />
            <link rel="preconnect" href="https://www.google-analytics.com" />
            <link
              type="image/x-icon"
              rel="shortcut icon"
              href="favicon/favicon.ico"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="16x16"
              href="favicon/favicon-16x16.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="32x32"
              href="favicon/favicon-32x32.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="96x96"
              href="favicon/favicon-96x96.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="120x120"
              href="favicon/favicon-120x120.png"
            />
            <link
              rel="apple-touch-icon"
              sizes="57x57"
              href="favicon/apple-touch-icon-57x57.png"
            />
            <link
              rel="apple-touch-icon"
              sizes="60x60"
              href="favicon/apple-touch-icon-60x60.png"
            />
            <link
              rel="apple-touch-icon"
              sizes="72x72"
              href="favicon/apple-touch-icon-72x72.png"
            />
            <link
              rel="apple-touch-icon"
              sizes="76x76"
              href="favicon/apple-touch-icon-76x76.png"
            />
            <link
              rel="apple-touch-icon"
              sizes="114x114"
              href="favicon/apple-touch-icon-114x114.png"
            />
            <link
              rel="apple-touch-icon"
              sizes="120x120"
              href="favicon/apple-touch-icon-120x120.png"
            />
            <link
              rel="apple-touch-icon"
              sizes="144x144"
              href="favicon/apple-touch-icon-144x144.png"
            />
            <link
              rel="apple-touch-icon"
              sizes="152x152"
              href="favicon/apple-touch-icon-152x152.png"
            />
            <link
              rel="apple-touch-icon"
              sizes="180x180"
              href="favicon/apple-touch-icon-180x180.png"
            />
            <meta name="apple-mobile-web-app-title" content="Ellty" />
          </Head>
          <body>
            <Main />
            <NextScript />
          </body>
        </Html>
      </>
    );
  }
}
