import 'reflect-metadata';
import { getHomePath, getPrivacyPath } from '@pcpartdb/shared';
import React, { useMemo } from 'react';
import { Breadcrumb } from '../../../shared/components/Breadcrumbs/Breadcrumb';
import { Breadcrumbs } from '../../../shared/components/Breadcrumbs/Breadcrumbs';
import { Seo } from '../../../shared/components/Seo/Seo';
import { WebsiteLayout } from '../../../shared/layouts/website/WebsiteLayout';

interface PrivacyPageProps {}

export const PrivacyPage = (_props: PrivacyPageProps) => {
  const pageTitle = 'Privacy Policy';
  const seoTitle = `${pageTitle}`;
  const seoDescription = 'Privacy Policy for PC Part DB.';
  const seoCanonical = useMemo(() => getPrivacyPath(), []);
  const seoKeywords: string[] = [];

  const homeHref = useMemo(() => getHomePath(), []);

  return (
    <WebsiteLayout disableConsent>
      <Seo
        title={seoTitle}
        keywords={seoKeywords}
        description={seoDescription}
        canonical={seoCanonical}
      />

      <Breadcrumbs className="mb-4">
        <Breadcrumb href={homeHref}>Home</Breadcrumb>
        <Breadcrumb>{pageTitle}</Breadcrumb>
      </Breadcrumbs>

      <article>
        <h1 className="font-semibold mb-2">{pageTitle}</h1>

        <p className="italic">Last modified: November 25, 2023</p>

        <section>
          <p>
            Your privacy is important to us. PC Part DB (&quot;us,&quot;
            &quot;we,&quot; or &quot;our&quot;) is committed to protecting your
            privacy. This policy explains how we collect, use, and disclose your
            personal information when you visit our website or use our services.
          </p>
          <p>
            If you have any questions or concerns about how we handle your
            privacy, do not hesitate to contact us (contact information is
            provided at the bottom of this page).
          </p>
          <h2>Information We Collect</h2>
          <p>We collect the following types of information from you:</p>
          <ul className="flex flex-col gap-2 list-disc list-outside mx-4 mb-4">
            <li className="mx-4">
              <span className="font-semibold">Identifying information:</span>{' '}
              This includes your name, display name, and email address, which
              you provide to us when you sign up for an account, the newsletter,
              or updates.
            </li>

            <li className="mx-4">
              <span className="font-semibold">Usage information:</span> This
              includes information about your use of our website, such as the
              pages you visit, the links you click, and the amount of time you
              spend on our website. We collect this information using cookies,
              system logs, and other tracking technologies.
            </li>

            <li className="mx-4">
              <span className="font-semibold">Third-party information:</span> We
              may receive information about you from third-party sources (e.g.
              Google Analytics, Microsoft Clarity).
            </li>
          </ul>
          <h2>How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul className="flex flex-col gap-2 list-disc list-outside mx-4 mb-4">
            <li className="mx-4">
              Improve your experience by providing services like newsletters,
              updates, and account-related features on the website.
            </li>
            <li className="mx-4">
              Improve and optimize our website by getting a better understanding
              of its usage.
            </li>
            <li className="mx-4">Serve you personalized advertising.</li>
          </ul>
          <h2>Sharing Your Information</h2>
          <p>
            We may share your information with third-party vendors, such as
            Google Analytics and advertising networks. These third-party vendors
            are responsible for protecting your information, and using it only
            for the purposes we have authorized. The following
          </p>
          <ul className="flex flex-col gap-2 list-disc list-outside mx-4 mb-4">
            <li className="mx-4">
              Advertising &amp; Analytics
              <ul className="mt-2 flex flex-col gap-2 list-outside list-[circle]">
                <li className="mx-4">
                  <a
                    href="https://affiliate-program.amazon.com/"
                    rel="nofollow"
                  >
                    Amazon Associates Program
                  </a>
                </li>
                <li className="mx-4">
                  <a href="https://adsense.google.com/" rel="nofollow">
                    Google AdSense
                  </a>
                </li>
                <li className="mx-4">
                  <a
                    href="https://marketingplatform.google.com/about/analytics/"
                    rel="nofollow"
                  >
                    Google Analytics
                  </a>
                </li>
                <li className="mx-4">
                  <a href="https://clarity.microsoft.com/" rel="nofollow">
                    Microsoft Clarity
                  </a>
                </li>
              </ul>
            </li>
            <li className="mx-4">
              Functionality
              <ul className="mt-2 flex flex-col gap-2 list-outside list-[circle]">
                <li className="mx-4">
                  <a href="https://www.cloudflare.com/" rel="nofollow">
                    Cloudflare
                  </a>{' '}
                  (Caching, DDoS &amp; Bot Protection)
                </li>
                <li className="mx-4">
                  <a href="https://www.digitalocean.com/" rel="nofollow">
                    Digital Ocean
                  </a>{' '}
                  (Server Hosting)
                </li>
                <li className="mx-4">
                  <a
                    href="https://support.google.com/tagmanager/answer/6102821?hl=en"
                    rel="nofollow"
                  >
                    Google Tag Manager
                  </a>{' '}
                  (Deployment of{' '}
                  <a href="https://support.google.com/tagmanager/answer/3281060?sjid=3690112745708305619-NA">
                    tags
                  </a>
                  )
                </li>
                <li className="mx-4">
                  <a href="https://choice.inmobi.com" rel="nofollow">
                    InMobi Choice
                  </a>{' '}
                  (Consent Management Platform)
                </li>
              </ul>
            </li>
          </ul>
          <h2>Your Choices</h2>

          <p>
            You may opt out of personalized advertising by visiting
            Google&apos;s{' '}
            <a href="https://www.google.com/settings/ads" rel="nofollow">
              Ads Settings
            </a>
            . Additionally, you can opt out of our third-party vendor&apos;s use
            of cookies for personalized advertising by visiting{' '}
            <a href="http://www.aboutads.info/choices/" rel="nofollow">
              www.aboutads.info
            </a>
            .
          </p>

          <h2>Cookie Policy &amp; GDPR</h2>

          <p>
            The General Data Protection Regulation (GDPR) is a European Union
            (EU) law on data protection and privacy in the EU and the European
            Economic Area (EEA).
          </p>

          <p>
            We use cookies on our website to improve your experience. Cookies
            are small text files that are stored on your computer when you visit
            a website. They are used to remember your preferences and settings
            so that you don&apos;t have to enter them again the next time you
            visit the website.
          </p>

          <p>
            Third party vendors, including Google, use advertising cookies to
            serve ads based on your prior visits to this website or other
            websites.
          </p>

          <p>
            You can choose to accept or reject cookies. If you refuse cookies,
            then some features on the website might be impacted. Cookies that
            are necessary only for functionality (e.g. account sign-in, storing
            cookie consent) may still be used.
          </p>

          <h2>Links to other sites</h2>

          <p>
            We often include links to third-party websites, services, or parts.
            These third-party websites are separate entities that have their own
            privacy policies. We are not responsible for their own compliance,
            activities, and content.
          </p>

          <p>
            We strive to uphold a strong reputation for our website. We welcome
            any feedback about links to these websites.
          </p>

          <h2>Microsoft Clarity Privacy Policy Disclosure</h2>

          <p>
            We partner with Microsoft Clarity and Microsoft Advertising to
            capture how you use and interact with our website through behavioral
            metrics, heatmaps, and session replay to improve and market our
            products/services. Website usage data is captured using first and
            third-party cookies and other tracking technologies to determine the
            popularity of products/services and online activity. Additionally,
            we use this information for site optimization, fraud/security
            purposes, and advertising. For more information about how Microsoft
            collects and uses your data, visit the{' '}
            <a
              href="https://privacy.microsoft.com/en-US/privacystatement"
              rel="nofollow"
            >
              Microsoft Privacy Statement
            </a>
            .
          </p>

          <h2>Changes To Our Privacy Policy</h2>

          <p>
            We may update this policy as needed to comply with relevant
            regulations and reflect any new practices. Whenever we make a
            significant change to our policies, we will refresh the date at the
            top of this page and take any other appropriate steps to notify
            users.
          </p>

          <h2>Contact Us</h2>

          <p>
            Have any questions, comments, or concerns about this privacy policy?
            Please get in touch by emailing us at{' '}
            <a href="mailto:hello@pcpartdb.com">hello@pcpartdb.com</a>.
          </p>
        </section>
      </article>
    </WebsiteLayout>
  );
};
