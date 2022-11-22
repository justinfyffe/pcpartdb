import 'reflect-metadata';
import { Article, ArticleHeader } from '@client/shared/components';
import { WebsiteLayout } from '@client/shared/layouts';
import React from 'react';

interface PrivacyPageProps {}

export const PrivacyPage = (_props: PrivacyPageProps) => {
  return (
    <WebsiteLayout>
      <Article>
        <ArticleHeader>
          <h1>Privacy Policy</h1>
        </ArticleHeader>

        <section>
          <p>
            The privacy of your data is very important to us. In this policy, we
            specify which information we record, how we collect it, and what we
            do with it.
          </p>

          <p>
            If you have any questions or concerns about how we handle your
            privacy, do not hesitate to contact us (contact information is
            provided at the bottom of this page).
          </p>

          <h2>What personal information do we collect?</h2>

          <p>
            Our guiding principle is to collect only the personal information
            that we need to provide a high-quality experience for our users.
          </p>

          <p>
            When you sign up on our website, we ask for identifying information
            such as your name and email address. This allows you to personalize
            your account, along with being able to receive product updates and
            other essential information. With your consent, we may also send you
            our newsletter and other updates.
          </p>

          <p>
            When you access our website, we collect essential information that
            can be used to help optimize, prioritize, and debug various
            features. This data may be included in analytics software and server
            log files.
          </p>

          <p>
            We do not sell your personal information to third parties, and will
            not use
          </p>

          <h2>How do we protect your information?</h2>

          <p>
            We implement a variety of security measures to protect our
            users&apos; sensitive information. This includes encrypting and/or
            hashing sensitive personal information.
          </p>

          <p>
            All sensitive information that you provide to us is encrypted using
            Secure Socket Layer (SSL) technology.
          </p>

          <p>
            Your personal information is only accessible by a limited number of
            persons that have special access rights and are required to keep the
            information confidential.
          </p>

          <h2>Do we use cookies?</h2>

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

          <h2>Third-party disclosure</h2>

          <p>test</p>

          <h2>Links to other sites</h2>

          <p>
            We often include links to third-party websites, services, or
            products. These third-party websites are separate entities that have
            their own privacy policies. We have no liability or responsiblity
            for their activities or content.
          </p>

          <p>
            We strive to uphold a strong reputation for our website. We welcome
            any feedback about links to these websites.
          </p>

          <h2>Changes &amp; questions</h2>

          <p>
            We may update this policy as needed to comply with relevant
            regulations and reflect any new practices. Whenever we make a
            significant change to our policies, we will refresh the date at the
            top of this page and take any other appropriate steps to notify
            users.
          </p>

          <p>
            Have any questions, comments, or concerns about this privacy policy,
            your data, or your rights with respect to your information? Please
            get in touch by emailing us at hello@pcpartsdb.com and we&apos;ll be
            happy to try to answer them!
          </p>
        </section>
      </Article>
    </WebsiteLayout>
  );
};
