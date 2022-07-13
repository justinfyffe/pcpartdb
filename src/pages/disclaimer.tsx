import 'reflect-metadata';
import React from 'react';
import { WebsiteLayout } from '../web/shared/layouts/website';

interface DisclaimerPageProps {}

const DisclaimerPage = (_props: DisclaimerPageProps) => {
  return (
    <WebsiteLayout>
      <article>
        <header>
          <h1>About Us</h1>
        </header>
      </article>
    </WebsiteLayout>
  );
};

export default DisclaimerPage;
