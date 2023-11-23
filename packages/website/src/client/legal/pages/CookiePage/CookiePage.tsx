import 'reflect-metadata';
import { getHomePath, getPrivacyPath } from '@pcpartdb/shared';
import React, { useCallback, useMemo, useState } from 'react';
import { Breadcrumb } from '../../../shared/components/Breadcrumbs/Breadcrumb';
import { Breadcrumbs } from '../../../shared/components/Breadcrumbs/Breadcrumbs';
import { GenericButton } from '../../../shared/components/Button/GenericButton';
import { PrimaryButton } from '../../../shared/components/Button/PrimaryButton';
import { Seo } from '../../../shared/components/Seo/Seo';
import { useConfig } from '../../../shared/config/config-context';
import { WebsiteLayout } from '../../../shared/layouts/website/WebsiteLayout';
import { legalService } from '../../services/legalService';

interface CookiePageProps {}

export const CookiePage = (_props: CookiePageProps) => {
  const { config } = useConfig();

  const pageTitle = 'Cookie Policy and Preferences';
  const seoTitle = `${pageTitle}`;
  const seoDescription = 'Cookie policy and preferences for PC Part DB.';
  const seoCanonical = useMemo(() => getPrivacyPath(), []);
  const seoKeywords: string[] = [];

  const homeHref = useMemo(() => getHomePath(), []);

  console.log(config);

  const [consent, setConsent] = useState<boolean>(config.cookieConsent);

  const handleReject = useCallback(async () => {
    await legalService.updateCookieConsent({ consent: false });
    setConsent(false);
  }, []);

  const handleAccept = useCallback(async () => {
    await legalService.updateCookieConsent({ consent: true });
    setConsent(true);
  }, []);

  return (
    <WebsiteLayout disableCookieConsent={true}>
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
        <section>
          <h1 className="font-semibold">Cookie Preferences</h1>

          <p>
            We use cookies to enhance the site experience, serve personalized
            ads, and analyze our traffic. Please choose your cookie preference
            below:
          </p>

          <p>
            Your current preference:{' '}
            <span className="font-semibold">
              {consent === true && 'Allow Cookies'}
              {consent === false && 'Reject Cookies'}
              {consent == null && 'Select an option below'}
            </span>
          </p>

          <div className="flex gap-4 justify-center items-center">
            <GenericButton
              onClick={handleReject}
              className="bg-transparent border-px border-black text-black rounded-none"
            >
              Reject Cookies
            </GenericButton>

            <PrimaryButton onClick={handleAccept} className="rounded-none">
              Allow Cookies
            </PrimaryButton>
          </div>
        </section>

        <h1 className="font-semibold">Cookie Policy</h1>

        <section>
          <p>
            We use cookies to improve functionality of our website for our
            users. This includes using them for our login system and storing
            user preferences. We may also use them to collect aggregate data
            about website interaction so we can improve our user experience.
          </p>

          <p>
            A cookie is a piece of text stored by your browser. It may help
            remember login information and site preferences. It might also
            collect information such as your browser type, operating system, web
            pages visited, duration of visit, content viewed, and other
            click-stream data. You can adjust cookie retention settings and
            accept or block individual cookies in your browser settings,
            although our apps won&apos;t work and other aspects of our website
            may not function properly if you turn cookies off.
          </p>

          <h2>Changes &amp; questions</h2>

          <p>
            We may update this policy as needed to comply with relevant
            regulations and reflect any new practices. Whenever we make a
            significant change to our policies, we will refresh the date at the
            bottom of this page and take any other appropriate steps to notify
            users.
          </p>

          <p>
            Have any questions, comments, or concerns about this privacy policy,
            your data, or your rights with respect to your information? Please
            get in touch by emailing us at{' '}
            <a href="mailto:hello@pcpartdb.com">hello@pcpartdb.com</a> and
            we&apos;ll be happy to try to answer them!
          </p>

          <p className="italic">Last updated: November 23, 2023</p>
        </section>
      </article>
    </WebsiteLayout>
  );
};
