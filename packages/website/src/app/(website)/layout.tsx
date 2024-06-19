import '../../assets/styles/global.css';
import {
  ApiError,
  base64Decode,
  Config,
  CONFIG_HEADER,
  ERROR_HEADER,
  getAboutPath,
  getHomePath,
  getListCpusPath,
  getListGpusPath,
  getPrivacyPath,
  WEBSITE_NAME,
} from '@pcpartdb/shared';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import React from 'react';
import { Button } from '../_common/components/Button/Button';
import { ButtonVariant } from '../_common/components/Button/types';
import { List, ListItem } from '../_common/components/List/List';
import { Toolbar } from '../_common/components/Toolbar/Toolbar';
import { ConfigProvider } from '../_common/contexts/ConfigProvider';
import { UserSettingsProvider } from '../_common/contexts/UserSettingsProvider';
import { ErrorPage } from '../_common/errors/ErrorPage/ErrorPage';
import { CookieConsentScript } from '../_common/third-party/CookieConsentScript';
import { GoogleTagManagerScript } from '../_common/third-party/GoogleTagManagerScript';
import { ManageCookiesLink } from '../_common/third-party/ManageCookiesLink';

interface RootLayoutProps {
  children: React.ReactNode;
}

export async function generateMetadata(): Promise<Metadata> {
  const error = base64Decode<ApiError | null>(headers().get(ERROR_HEADER));

  return { robots: error != null ? 'noindex' : undefined };
}

export default async function RootWebsiteLayout(props: RootLayoutProps) {
  const config = base64Decode<Config>(headers().get(CONFIG_HEADER));
  const error = base64Decode<ApiError | null>(headers().get(ERROR_HEADER));

  const enableGtm = process.env.ENABLE_GTM === 'true';
  const gtmId = process.env.GTM_ID;

  return (
    <html lang="en" className="bg-html">
      <head>
        <CookieConsentScript />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com/" />
        <GoogleTagManagerScript config={config} />
        <meta charSet="utf-8" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicon/site.webmanifest"></link>
        <link
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900|Sacramento&display=swap"
          rel="preconnect"
        />
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900|Sacramento&display=swap"
          as="style"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900|Sacramento&display=swap"
        />
      </head>
      <body className="bg-html">
        {enableGtm && gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              className="hidden invisible"
            ></iframe>
          </noscript>
        )}
        <ConfigProvider config={config}>
          <UserSettingsProvider userSettings={config.userSettings}>
            <a
              href={getHomePath()}
              className="flex gap-4 border-x-px container bg-content p-container md:p-4 font-bold items-center text-5xl text-main-brand leading-none"
            >
              <img
                src="/images/logo-transparent.png"
                alt="PC Part DB: Build Smarter: Compare PC part benchmarks & specs"
                className="h-12"
              />
              <span className="font-san">{WEBSITE_NAME.toUpperCase()}</span>
            </a>

            <Toolbar>
              <Button
                href={getListGpusPath()}
                variant={ButtonVariant.None}
                className="hover:underline"
              >
                Graphics Cards
              </Button>
              <Button
                href={getListCpusPath()}
                variant={ButtonVariant.None}
                className="hover:underline"
              >
                Processors
              </Button>
            </Toolbar>

            <div className="bg-html">
              <main className="border-x-px bg-content container p-container md:p-4 text-base text-content w-full">
                {error == null && <>{props.children}</>}
                {error != null && <ErrorPage error={error} />}
              </main>
            </div>

            <footer className="bg-main-brand text-default container p-container md:p-4 flex flex-wrap gap-8">
              <nav className="flex-1 min-w-50 text-sm">
                <header className="border-b-px mb-3 text-base">Pages</header>
                <List direction="vertical">
                  <ListItem>
                    <a
                      href={getHomePath()}
                      className="text-light-shades underline"
                    >
                      Home
                    </a>
                  </ListItem>
                  <ListItem>
                    <a
                      href={getAboutPath()}
                      className="text-light-shades underline"
                    >
                      About Us
                    </a>
                  </ListItem>
                  <ListItem>
                    <a
                      href={getPrivacyPath()}
                      className="text-light-shades underline"
                    >
                      Privacy Policy
                    </a>
                  </ListItem>
                  <ListItem>
                    <ManageCookiesLink />
                  </ListItem>
                </List>
              </nav>

              <section className="flex-1 min-w-50 text-sm">
                <header className="border-b-px mb-3 text-base">
                  Disclaimer &amp; Disclosure
                </header>

                <p>
                  {WEBSITE_NAME} provides specs and benchmarks based on various
                  sources. If you discover an error, please{' '}
                  <a
                    href={getAboutPath()}
                    className="text-light-shades underline"
                  >
                    contact us
                  </a>
                  .
                </p>

                <p>
                  {WEBSITE_NAME} is a participant in the Amazon Services LLC
                  Associates Program, an affiliate advertising program. We earn
                  from qualifying purchases.
                </p>

                <p>
                  We improve our products and advertising by using Microsoft
                  Clarity to see how you use our website. By using our site, you
                  agree that we and Microsoft can collect and use this data.
                </p>
              </section>

              <section className="flex-none text-center min-w-50 text-sm w-full">
                Copyright &copy; {WEBSITE_NAME}
              </section>
            </footer>
          </UserSettingsProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
