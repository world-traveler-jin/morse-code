import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="google-site-verification" content="OsdOU7OzUuRCcIb7iGgmVeJRk20FZSAjBOFZA2FoGLg" />
      </Head>
      <body>
        <Main />
        <NextScript />
        <script
          type="module"
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "a4aaa1f79dce4efbba999b65106b5a6d"}'
        />
      </body>
    </Html>
  );
}
